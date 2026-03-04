import { describe, expect, it } from "vitest";
import { getVerbInsight } from "~/features/vocabulary/model/verb-insights";

describe("getVerbInsight", () => {
  it("builds irregular forms for know in english", () => {
    const insight = getVerbInsight("know", "en");

    expect(insight).not.toBeNull();
    if (!insight) {
      return;
    }

    expect(insight.formsByTense.past_simple.map((row) => row.form)).toEqual([
      "knew",
      "knew",
      "knew",
      "knew",
      "knew"
    ]);

    expect(insight.formsByTense.present_perfect.map((row) => row.form)).toEqual([
      "have known",
      "have known",
      "has known",
      "have known",
      "have known"
    ]);

    expect(insight.formsByTense.past_perfect.map((row) => row.form)).toEqual([
      "had known",
      "had known",
      "had known",
      "had known",
      "had known"
    ]);
  });
});
