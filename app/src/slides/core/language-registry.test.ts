import { describe, expect, it } from "vitest";
import { getSlideModulesForLanguage } from "~/slides/core/language-registry";

describe("spanish A1 coverage", () => {
  it("covers required grammar and vocabulary topics", () => {
    const modules = getSlideModulesForLanguage("es").filter((module) => module.meta.level === "a1");
    const moduleIds = new Set(modules.map((module) => module.meta.id));
    const tags = new Set(modules.flatMap((module) => module.meta.ruleTags));

    expect(moduleIds.has("es.grammar.ser-estar")).toBe(true);
    expect(moduleIds.has("es.grammar.tener-llamarse")).toBe(true);
    expect(moduleIds.has("es.grammar.presente-basico")).toBe(true);
    expect(moduleIds.has("es.grammar.presente-irregulares")).toBe(true);
    expect(moduleIds.has("es.grammar.articulos-genero-numero")).toBe(true);
    expect(moduleIds.has("es.grammar.ir-a-infinitivo")).toBe(true);
    expect(moduleIds.has("es.grammar.csv-flashcards-a1")).toBe(true);
    expect(moduleIds.has("es.vocabulary.numeros-0-100")).toBe(true);

    expect(tags.has("querer")).toBe(true);
    expect(tags.has("poder")).toBe(true);
    expect(tags.has("articulos")).toBe(true);
    expect(tags.has("genero")).toBe(true);
    expect(tags.has("numero")).toBe(true);
    expect(tags.has("ir_a_infinitivo")).toBe(true);
    expect(tags.has("familia")).toBe(true);
    expect(tags.has("comida")).toBe(true);
    expect(tags.has("colores")).toBe(true);
    expect(tags.has("dias_semana")).toBe(true);
    expect(tags.has("tiempo")).toBe(true);
    expect(tags.has("numeros")).toBe(true);
    expect(tags.has("0_100")).toBe(true);
    expect(tags.has("csv_flashcards")).toBe(true);
  });
});

describe("english flashcards coverage", () => {
  it("includes EN flashcards modules generated from CSV", () => {
    const modules = getSlideModulesForLanguage("en").filter((module) => module.meta.level === "a1");
    const moduleIds = new Set(modules.map((module) => module.meta.id));
    const tags = new Set(modules.flatMap((module) => module.meta.ruleTags));

    expect(moduleIds.has("grammar.flashcards-en-rules")).toBe(true);
    expect(moduleIds.has("vocabulary.flashcards-en-words")).toBe(true);
    expect(tags.has("flashcards_en_rules")).toBe(true);
    expect(tags.has("flashcards_en_words")).toBe(true);
  });
});
