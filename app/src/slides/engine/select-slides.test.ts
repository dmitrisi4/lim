import { describe, expect, it } from "vitest";
import { getAllSlideModules, getSlideModules } from "~/slides/core/registry";
import { buildSlidePool, selectSlideCards } from "~/slides/engine/select-slides";

describe("slide engine", () => {
  it("prioritizes preferred categories in pool start", () => {
    const modules = getSlideModules();
    const pool = buildSlidePool(modules, {
      targetLevels: ["a1", "a2"],
      preferredCategories: ["grammar"],
      focusRules: ["present_simple"]
    });

    expect(pool.length).toBeGreaterThan(0);
    expect(pool[0].tracking?.category).toBe("grammar");
  });

  it("returns deterministic slice and next cursor", () => {
    const modules = getAllSlideModules();
    const selection = selectSlideCards({
      modules,
      cursor: 0,
      limit: 4,
      profile: {
        targetLevels: ["b1"],
        preferredCategories: ["vocabulary"]
      }
    });

    expect(selection.cards).toHaveLength(2);
    expect(selection.hasMore).toBe(true);
    expect(selection.nextCursor).toBeGreaterThanOrEqual(0);
    expect(selection.cards.every((card) => card.tracking?.level === "b1")).toBe(true);
  });

  it("filters modules by explicit categories when provided", () => {
    const modules = getAllSlideModules();
    const pool = buildSlidePool(modules, {
      targetLevels: ["a1"],
      targetCategories: ["reading"],
      preferredCategories: ["reading"]
    });

    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((card) => card.tracking?.category === "reading")).toBe(true);
  });
});
