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

  it("builds irregular forms for think in english", () => {
    const insight = getVerbInsight("think", "en");

    expect(insight).not.toBeNull();
    if (!insight) {
      return;
    }

    expect(insight.formsByTense.past_simple.map((row) => row.form)).toEqual([
      "thought",
      "thought",
      "thought",
      "thought",
      "thought"
    ]);

    expect(insight.formsByTense.present_perfect.map((row) => row.form)).toEqual([
      "have thought",
      "have thought",
      "has thought",
      "have thought",
      "have thought"
    ]);

    expect(insight.formsByTense.past_perfect.map((row) => row.form)).toEqual([
      "had thought",
      "had thought",
      "had thought",
      "had thought",
      "had thought"
    ]);
  });

  it("builds irregular forms for understand in english", () => {
    const insight = getVerbInsight("understand", "en");

    expect(insight).not.toBeNull();
    if (!insight) {
      return;
    }

    expect(insight.formsByTense.past_simple.map((row) => row.form)).toEqual([
      "understood",
      "understood",
      "understood",
      "understood",
      "understood"
    ]);

    expect(insight.formsByTense.present_perfect.map((row) => row.form)).toEqual([
      "have understood",
      "have understood",
      "has understood",
      "have understood",
      "have understood"
    ]);

    expect(insight.formsByTense.past_perfect.map((row) => row.form)).toEqual([
      "had understood",
      "had understood",
      "had understood",
      "had understood",
      "had understood"
    ]);
  });
});
