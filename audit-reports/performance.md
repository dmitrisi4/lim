# Performance Audit

## Desktop (Baseline)
- URL: http://localhost:5173/
- LCP: 104 ms
- CLS: 0.00
- TTFB: 32 ms
- Findings:
  - Extremely fast on local dev server.
  - LCP is text-based (no image download required).
  - TTFB and Render Delay are both under 100ms.

## Mobile (Emulated: Slow 4G, 4x CPU)
- URL: http://localhost:5173/
- LCP: 1230 ms
- CLS: 0.00
- TTFB: 27 ms
- Findings:
  - LCP increased by >10x compared to desktop.
  - Render delay is the main bottleneck (1203 ms).
  - Render-blocking requests are estimated to cost ~514ms of LCP.
- Recommendations:
  - Optimize render-blocking resources (Scripts/Styles).
  - Ensure critical CSS is inlined or prioritized.
  - Audit Qwik's resumability and bundle sizes for mobile.

## Comparative Summary
| Metric | Desktop | Mobile | Delta |
| :--- | :--- | :--- | :--- |
| LCP | 104 ms | 1230 ms | +1126 ms |
| CLS | 0.00 | 0.00 | 0 |
| TTFB | 32 ms | 27 ms | -5 ms |
