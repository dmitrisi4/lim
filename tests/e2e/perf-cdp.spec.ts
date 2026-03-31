import { expect, test } from "@playwright/test";

const parseNumberEnv = (name: string, fallback: number): number => {
  const rawValue = process.env[name];
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
};

test("collects CDP web performance metrics", async ({ browserName, context, page }, testInfo) => {
  test.skip(browserName !== "chromium", "CDP metrics are available only in Chromium");

  const targetPath = process.env.PERF_PATH ?? "/";
  const cpuThrottleRate = parseNumberEnv("PERF_CPU_THROTTLE", 4);
  const settleMs = parseNumberEnv("PERF_SETTLE_MS", 1_500);
  const observerWindowMs = parseNumberEnv("PERF_OBSERVER_WINDOW_MS", 1_000);

  const cdp = await context.newCDPSession(page);

  await cdp.send("Network.enable");
  await cdp.send("Performance.enable");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottleRate });

  let bytes = 0;
  cdp.on("Network.loadingFinished", (event: { encodedDataLength?: number }) => {
    bytes += event.encodedDataLength ?? 0;
  });

  await page.goto(targetPath, { waitUntil: "networkidle" });
  await page.waitForTimeout(settleMs);

  const nav = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null;

    return {
      ttfb: navigation?.responseStart ?? null,
      dcl: navigation?.domContentLoadedEventEnd ?? null,
      load: navigation?.loadEventEnd ?? null,
      fcp
    };
  });

  const lcp = await page.evaluate(async (windowMs) => {
    return await new Promise<number | null>((resolve) => {
      let last = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          last = entries[entries.length - 1].startTime;
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(last || null);
      }, windowMs);
    });
  }, observerWindowMs);

  const cls = await page.evaluate(async (windowMs) => {
    type LayoutShiftEntry = PerformanceEntry & {
      hadRecentInput: boolean;
      value: number;
    };

    return await new Promise<number>((resolve) => {
      let value = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            value += entry.value;
          }
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(value);
      }, windowMs);
    });
  }, observerWindowMs);

  type Metric = { name: string; value: number };
  const { metrics } = (await cdp.send("Performance.getMetrics")) as { metrics: Metric[] };
  const byName = Object.fromEntries(metrics.map((metric) => [metric.name, metric.value]));

  const result = {
    url: page.url(),
    bytes_kb: Math.round(bytes / 1024),
    ttfb_ms: nav.ttfb !== null ? Math.round(nav.ttfb) : null,
    fcp_ms: nav.fcp !== null ? Math.round(nav.fcp) : null,
    lcp_ms: lcp !== null ? Math.round(lcp) : null,
    dcl_ms: nav.dcl !== null ? Math.round(nav.dcl) : null,
    load_ms: nav.load !== null ? Math.round(nav.load) : null,
    cls: Number(cls.toFixed(3)),
    js_heap_mb: byName.JSHeapUsedSize !== undefined ? Number((byName.JSHeapUsedSize / 1024 / 1024).toFixed(1)) : null,
    script_duration_s: byName.ScriptDuration !== undefined ? Number(byName.ScriptDuration.toFixed(3)) : null
  };

  console.log(result);
  await testInfo.attach("cdp-perf-metrics", {
    body: JSON.stringify(result, null, 2),
    contentType: "application/json"
  });

  expect(result.url).toContain(targetPath === "/" ? "/" : targetPath);
});
