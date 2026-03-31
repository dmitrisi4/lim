import { component$, Slot, useContextProvider, useStylesScoped$ } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { I18N_CONTEXT } from "~/shared/i18n/context";
import {
  LEARNING_LANGUAGE_COOKIE,
  LEARNING_LANGUAGE_OPTIONS,
  buildLanguageHref,
  detectLearningLanguage,
  getUiCopy
} from "~/shared/i18n/ui";
import styles from "~/routes/layout.css?inline";

const navItemClass = (active: boolean) => (active ? "nav-link active" : "nav-link");
const navItemLabelClass = (active: boolean) => (active ? "nav-label active" : "nav-label");
const languageChipClass = (active: boolean) => (active ? "language-chip active" : "language-chip");

export const useLanguageLoader = routeLoader$(({ cookie, url }) => {
  const cookieLanguage = cookie.get(LEARNING_LANGUAGE_COOKIE)?.value;
  const language = detectLearningLanguage(url, cookieLanguage);

  if (cookieLanguage !== language) {
    cookie.set(LEARNING_LANGUAGE_COOKIE, language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return {
    language,
    ui: getUiCopy(language)
  };
});

export default component$(() => {
  useStylesScoped$(styles);
  const location = useLocation();
  const i18n = useLanguageLoader();
  useContextProvider(I18N_CONTEXT, i18n.value);

  const ui = i18n.value.ui;
  const currentLanguage = i18n.value.language;

  const homeActive = location.url.pathname === "/";
  const feedActive = location.url.pathname.startsWith("/feed");
  const vocabularyActive = location.url.pathname.startsWith("/vocabulary");
  const mapActive = location.url.pathname.startsWith("/language-map");
  const questsActive = location.url.pathname.startsWith("/quests");
  const profileActive = location.url.pathname.startsWith("/profile");
  const pageWrapClass = "page-wrap page-wrap-fluid";

  return (
    <div class={pageWrapClass}>
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">
            <span class="brand-dot" aria-hidden="true" />
            <div>
              <p class="eyebrow">{ui.appName}</p>
              <h1 class="headline">{ui.appTagline}</h1>
            </div>
          </div>

          <div class="language-inline" aria-label={ui.languageControlTitle} title={ui.languageControlHint}>
            <span class="language-inline-label">{ui.languageControlShort}</span>
            <div class="language-chip-row">
              {LEARNING_LANGUAGE_OPTIONS.map((option) => (
                <Link
                  key={`lang-${option.code}`}
                  href={buildLanguageHref(location.url, option.code)}
                  class={languageChipClass(option.code === currentLanguage)}
                  aria-current={option.code === currentLanguage ? "page" : undefined}
                >
                  <span class="language-chip-code">{option.code.toUpperCase()}</span>
                  <span>{option.nativeName}</span>
                </Link>
              ))}
            </div>
          </div>

          <nav class="nav" aria-label="Main">
            <a href="/" class={navItemClass(homeActive)} aria-current={homeActive ? "page" : undefined}>
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 0 1-1.5-1.5z" />
                </svg>
              </span>
              <span class={navItemLabelClass(homeActive)}>{ui.navHome}</span>
            </a>

            <a href="/feed" class={navItemClass(feedActive)} aria-current={feedActive ? "page" : undefined}>
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <rect x="4.5" y="4.5" width="15" height="15" rx="4" ry="4" />
                  <circle cx="12" cy="12" r="2.25" />
                  <path d="M16.875 7.125h.01" />
                </svg>
              </span>
              <span class={navItemLabelClass(feedActive)}>{ui.navFeed}</span>
            </a>

            <a href="/vocabulary/" class={navItemClass(vocabularyActive)} aria-current={vocabularyActive ? "page" : undefined}>
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M5.25 5.25h9a2.25 2.25 0 0 1 2.25 2.25v11.25H7.5a2.25 2.25 0 0 0-2.25 2.25z" />
                  <path d="M7.5 5.25v15.75" />
                  <path d="M18.75 7.5v11.25H9.75" />
                </svg>
              </span>
              <span class={navItemLabelClass(vocabularyActive)}>{ui.navVocabulary}</span>
            </a>

            <a href="/language-map/" class={navItemClass(mapActive)} aria-current={mapActive ? "page" : undefined}>
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="6.75" cy="6.75" r="2.1" />
                  <circle cx="17.25" cy="6.75" r="2.1" />
                  <circle cx="12" cy="17.25" r="2.1" />
                  <path d="m8.7 7.8 2.55 7.65" />
                  <path d="m15.3 7.8-2.55 7.65" />
                  <path d="M8.7 6.75h6.6" />
                </svg>
              </span>
              <span class={navItemLabelClass(mapActive)}>{ui.navMap}</span>
            </a>

            <a href="/quests/" class={navItemClass(questsActive)} aria-current={questsActive ? "page" : undefined}>
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M7.5 4.5h9l3 3v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4.5 19.5v-12z" />
                  <path d="M16.5 4.5v4.5h4.5" />
                  <path d="m9 12 2.1 2.1L15 10.2" />
                </svg>
              </span>
              <span class={navItemLabelClass(questsActive)}>{ui.navQuests}</span>
            </a>

            <Link
              href="/profile"
              class={navItemClass(profileActive)}
              aria-current={profileActive ? "page" : undefined}
            >
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="12" cy="8.25" r="3.15" />
                  <path d="M5.25 19.5c1.65-3.3 4.2-4.95 6.75-4.95s5.1 1.65 6.75 4.95" />
                </svg>
              </span>
              <span class={navItemLabelClass(profileActive)}>{ui.navProfile}</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Slot />
      </main>
    </div>
  );
});
