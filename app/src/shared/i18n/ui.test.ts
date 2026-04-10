import { describe, expect, it } from "vitest";
import {
  buildLanguageHref,
  buildUiLanguageHref,
  detectLearningLanguage,
  detectUiLanguage,
  getUiCopy,
  isUiLanguage,
  resolveUiLanguage
} from "~/shared/i18n/ui";

// ---------------------------------------------------------------------------
// isUiLanguage
// ---------------------------------------------------------------------------

describe("isUiLanguage", () => {
  it("returns true for valid ui languages", () => {
    expect(isUiLanguage("ru")).toBe(true);
    expect(isUiLanguage("en")).toBe(true);
    expect(isUiLanguage("es")).toBe(true);
  });

  it("returns false for unknown values", () => {
    expect(isUiLanguage("fr")).toBe(false);
    expect(isUiLanguage("")).toBe(false);
    expect(isUiLanguage(null)).toBe(false);
    expect(isUiLanguage(undefined)).toBe(false);
    expect(isUiLanguage("RU")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resolveUiLanguage
// ---------------------------------------------------------------------------

describe("resolveUiLanguage", () => {
  it("returns the value unchanged for valid ui languages", () => {
    expect(resolveUiLanguage("ru")).toBe("ru");
    expect(resolveUiLanguage("en")).toBe("en");
    expect(resolveUiLanguage("es")).toBe("es");
  });

  it("falls back to Russian for unknown / missing values", () => {
    expect(resolveUiLanguage(null)).toBe("ru");
    expect(resolveUiLanguage(undefined)).toBe("ru");
    expect(resolveUiLanguage("unknown")).toBe("ru");
    expect(resolveUiLanguage("")).toBe("ru");
  });
});

// ---------------------------------------------------------------------------
// detectUiLanguage
// ---------------------------------------------------------------------------

describe("detectUiLanguage", () => {
  it("uses ui_lang URL param when valid", () => {
    expect(detectUiLanguage(new URL("https://example.com/feed?ui_lang=en"))).toBe("en");
    expect(detectUiLanguage(new URL("https://example.com/feed?ui_lang=ru"))).toBe("ru");
    expect(detectUiLanguage(new URL("https://example.com/feed?ui_lang=es"))).toBe("es");
  });

  it("URL param takes priority over cookie", () => {
    expect(detectUiLanguage(new URL("https://example.com/?ui_lang=en"), "ru")).toBe("en");
    expect(detectUiLanguage(new URL("https://example.com/?ui_lang=ru"), "es")).toBe("ru");
  });

  it("falls back to cookie when URL param is absent", () => {
    expect(detectUiLanguage(new URL("https://example.com/feed"), "es")).toBe("es");
    expect(detectUiLanguage(new URL("https://example.com/feed"), "ru")).toBe("ru");
  });

  it("falls back to cookie when URL param is unknown", () => {
    expect(detectUiLanguage(new URL("https://example.com/?ui_lang=fr"), "en")).toBe("en");
    expect(detectUiLanguage(new URL("https://example.com/?ui_lang=zh"), "es")).toBe("es");
  });

  it("defaults to Russian when neither URL param nor cookie is set", () => {
    expect(detectUiLanguage(new URL("https://example.com/feed"))).toBe("ru");
    expect(detectUiLanguage(new URL("https://example.com/feed"), null)).toBe("ru");
    expect(detectUiLanguage(new URL("https://example.com/?ui_lang=fr"))).toBe("ru");
  });
});

// ---------------------------------------------------------------------------
// buildUiLanguageHref
// ---------------------------------------------------------------------------

describe("buildUiLanguageHref", () => {
  it("adds ui_lang param to a clean URL", () => {
    const url = new URL("https://example.com/feed");
    expect(buildUiLanguageHref(url, "ru")).toBe("/feed?ui_lang=ru");
    expect(buildUiLanguageHref(url, "en")).toBe("/feed?ui_lang=en");
  });

  it("preserves existing query params", () => {
    const url = new URL("https://example.com/feed?lang=en");
    expect(buildUiLanguageHref(url, "ru")).toBe("/feed?lang=en&ui_lang=ru");
  });

  it("replaces existing ui_lang param", () => {
    const url = new URL("https://example.com/feed?ui_lang=en");
    expect(buildUiLanguageHref(url, "ru")).toBe("/feed?ui_lang=ru");
  });

  it("preserves all existing params while updating ui_lang", () => {
    const url = new URL("https://example.com/vocabulary?lang=en&ui_lang=ru");
    expect(buildUiLanguageHref(url, "es")).toBe("/vocabulary?lang=en&ui_lang=es");
  });
});

// ---------------------------------------------------------------------------
// getUiCopy — correct block per language
// ---------------------------------------------------------------------------

describe("getUiCopy", () => {
  it("returns English copy for 'en'", () => {
    const ui = getUiCopy("en");
    expect(ui.navHome).toBe("Home");
    expect(ui.navFeed).toBe("Feed");
    expect(ui.feedTitle).toBe("Feed");
    expect(ui.uiLanguageControlTitle).toBe("Interface language");
    expect(ui.uiLanguageControlShort).toBe("UI lang");
  });

  it("returns Spanish copy for 'es'", () => {
    const ui = getUiCopy("es");
    expect(ui.navHome).toBe("Inicio");
    expect(ui.navFeed).toBe("Feed");
    expect(ui.feedTitle).toBe("Feed");
    expect(ui.uiLanguageControlTitle).toBe("Idioma de interfaz");
  });

  it("returns Russian copy for 'ru'", () => {
    const ui = getUiCopy("ru");
    expect(ui.navHome).toBe("Главная");
    expect(ui.navFeed).toBe("Лента");
    expect(ui.feedTitle).toBe("Лента");
    expect(ui.uiLanguageControlTitle).toBe("Язык интерфейса");
    expect(ui.uiLanguageControlShort).toBe("Интерфейс");
  });
});

// ---------------------------------------------------------------------------
// Independence of learning language and UI language
// ---------------------------------------------------------------------------

describe("learning language and UI language independence", () => {
  it("reads lang and ui_lang from independent URL params", () => {
    const url = new URL("https://example.com/feed?lang=es&ui_lang=ru");
    expect(detectLearningLanguage(url)).toBe("es");
    expect(detectUiLanguage(url)).toBe("ru");
  });

  it("both can be set to the same language", () => {
    const url = new URL("https://example.com/feed?lang=en&ui_lang=en");
    expect(detectLearningLanguage(url)).toBe("en");
    expect(detectUiLanguage(url)).toBe("en");
  });

  it("missing ui_lang defaults to ru while lang stays en", () => {
    const url = new URL("https://example.com/feed?lang=en");
    expect(detectLearningLanguage(url)).toBe("en");
    expect(detectUiLanguage(url)).toBe("ru");
  });

  it("buildLanguageHref and buildUiLanguageHref update their own params independently", () => {
    const url = new URL("https://example.com/feed?lang=es&ui_lang=ru");
    expect(buildLanguageHref(url, "en")).toBe("/feed?lang=en&ui_lang=ru");
    expect(buildUiLanguageHref(url, "en")).toBe("/feed?lang=es&ui_lang=en");
  });
});

// ---------------------------------------------------------------------------
// New UiCopy keys present in all three languages
// ---------------------------------------------------------------------------

describe("new UiCopy keys present in all languages", () => {
  const languages = ["ru", "en", "es"] as const;

  for (const lang of languages) {
    it(`${lang}: feedTitle is a non-empty string`, () => {
      expect(getUiCopy(lang).feedTitle.length).toBeGreaterThan(0);
    });

    it(`${lang}: feedSubtitle is a non-empty string`, () => {
      expect(getUiCopy(lang).feedSubtitle.length).toBeGreaterThan(0);
    });

    it(`${lang}: uiLanguageControlTitle is a non-empty string`, () => {
      expect(getUiCopy(lang).uiLanguageControlTitle.length).toBeGreaterThan(0);
    });

    it(`${lang}: uiLanguageControlShort is a non-empty string`, () => {
      expect(getUiCopy(lang).uiLanguageControlShort.length).toBeGreaterThan(0);
    });
  }
});
