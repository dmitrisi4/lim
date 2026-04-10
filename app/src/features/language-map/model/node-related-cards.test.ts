import { describe, expect, it } from "vitest";
import { buildSlideCardId } from "~/slides/core/tracking";
import { getNodeRelatedCardIds } from "~/features/language-map/model/node-related-cards";

describe("getNodeRelatedCardIds", () => {
  it("returns grammar and vocabulary cards for present-simple node", () => {
    const cardIds = getNodeRelatedCardIds("present-simple", "en");

    expect(cardIds).toContain(buildSlideCardId("grammar.present-simple", "rules-overview"));
    expect(cardIds).toContain("en-verb-do");
    expect(cardIds.length).toBeGreaterThan(3);
  });

  it("returns focused irregular set for irregular-verbs node", () => {
    const cardIds = getNodeRelatedCardIds("irregular-verbs", "en");

    expect(cardIds).toContain("en-verb-go");
    expect(cardIds).toContain("en-verb-see");
    expect(cardIds).not.toContain("en-other-the");
  });
});
