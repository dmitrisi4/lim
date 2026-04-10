import { $, component$, Slot, useContextProvider, useSignal, useStore, useStylesScoped$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { I18N_CONTEXT } from "~/shared/i18n/context";
import { SESSION_CONTEXT, type SessionStateType } from "~/entities/session/model/context";
import {
  LEARNING_LANGUAGE_COOKIE,
  LEARNING_LANGUAGE_OPTIONS,
  UI_LANGUAGE_COOKIE,
  UI_LANGUAGE_OPTIONS,
  buildLanguageHref,
  buildUiLanguageHref,
  detectLearningLanguage,
  detectUiLanguage,
  getUiCopy
} from "~/shared/i18n/ui";
import styles from "~/routes/layout.css?inline";

const navItemClass = (active: boolean) => (active ? "nav-link active" : "nav-link");
const navItemLabelClass = (active: boolean) => (active ? "nav-label active" : "nav-label");
const languageChipClass = (active: boolean) => (active ? "language-chip active" : "language-chip");
const mobileMenuItemClass = (active: boolean) => (active ? "mobile-menu-item active" : "mobile-menu-item");
const mobileMenuLabelClass = (active: boolean) => (active ? "mobile-menu-item-label active" : "mobile-menu-item-label");

export const useLanguageLoader = routeLoader$(({ cookie, url }) => {
  const cookieLanguage = cookie.get(LEARNING_LANGUAGE_COOKIE)?.value;
  const language = detectLearningLanguage(url, cookieLanguage);
  if (cookieLanguage !== language) {
    cookie.set(LEARNING_LANGUAGE_COOKIE, language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  const cookieUiLanguage = cookie.get(UI_LANGUAGE_COOKIE)?.value;
  const uiLanguage = detectUiLanguage(url, cookieUiLanguage);
  if (cookieUiLanguage !== uiLanguage) {
    cookie.set(UI_LANGUAGE_COOKIE, uiLanguage, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return {
    language,
    uiLanguage,
    ui: getUiCopy(uiLanguage)
  };
});

export const useAuthGlobalLoader = routeLoader$(({ cookie }) => {
  const isAuth = cookie.get("mock_auth_token")?.value === "true";
  return { 
    isAuth, 
    user: isAuth ? { id: "1", email: "admin@admin.com", name: "Admin" } : null 
  };
});

export default component$(() => {
  useStylesScoped$(styles);
  const location = useLocation();
  const i18n = useLanguageLoader();
  const authGlobal = useAuthGlobalLoader();
  // Reactive store so child components update when language changes via SPA navigation
  const i18nStore = useStore({ ...i18n.value });
  useTask$(({ track }) => {
    const value = track(() => i18n.value);
    i18nStore.language = value.language;
    i18nStore.uiLanguage = value.uiLanguage;
    i18nStore.ui = value.ui;
  });
  useContextProvider(I18N_CONTEXT, i18nStore);

  const sessionStore = useStore<SessionStateType>({
    isAuth: authGlobal.value.isAuth,
    user: authGlobal.value.user,
    isLoading: false
  });
  useTask$(({ track }) => {
    const value = track(() => authGlobal.value);
    sessionStore.isAuth = value.isAuth;
    sessionStore.user = value.user;
  });
  useContextProvider(SESSION_CONTEXT, sessionStore);

  const ui = i18nStore.ui;
  const currentLanguage = i18nStore.language;
  const currentUiLanguage = i18nStore.uiLanguage;
  const mobileMenuOpen = useSignal(false);
  const langPopupOpen = useSignal(false);

  const openMobileMenu = $(() => {
    mobileMenuOpen.value = true;
  });

  const closeMobileMenu = $(() => {
    mobileMenuOpen.value = false;
  });

  const openLangPopup = $(() => {
    langPopupOpen.value = true;
  });

  const closeLangPopup = $(() => {
    langPopupOpen.value = false;
  });

  useVisibleTask$(({ track }) => {
    track(() => mobileMenuOpen.value);
    document.body.style.overflow = mobileMenuOpen.value ? "hidden" : "";
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.href);
    langPopupOpen.value = false;
  });

  const homeActive = location.url.pathname === "/" || location.url.pathname === "/path" || location.url.pathname === "/path/";
  const feedActive = location.url.pathname.startsWith("/feed");
  const vocabularyActive = location.url.pathname.startsWith("/vocabulary");
  const mapActive = location.url.pathname.startsWith("/language-map");
  const questsActive = location.url.pathname.startsWith("/quests");
  const profileActive = location.url.pathname.startsWith("/profile");

  return (
    <div class="page-wrap page-wrap-fluid">
      {langPopupOpen.value && (
        <button
          type="button"
          class="lang-popup-backdrop"
          aria-label="Close language settings"
          onClick$={closeLangPopup}
        />
      )}

      <div class={mobileMenuOpen.value ? "mobile-menu-layer open" : "mobile-menu-layer"}>
        <button type="button" class="mobile-menu-backdrop" aria-label={ui.mobileMenuClose} onClick$={closeMobileMenu} />

        <aside class="mobile-menu-drawer" aria-label={ui.mobileMenuLabel}>
          <div class="mobile-menu-head">
            <div class="mobile-menu-brand">
              <span class="brand-dot" aria-hidden="true" />
              <div>
                <p class="eyebrow">{ui.appName}</p>
                <p class="mobile-menu-title">{ui.mobileMenuLabel}</p>
              </div>
            </div>

            <button type="button" class="mobile-menu-close" aria-label={ui.mobileMenuClose} onClick$={closeMobileMenu}>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div class="mobile-menu-language" aria-label={ui.languageControlTitle} title={ui.languageControlHint}>
            <span class="mobile-menu-language-label">{ui.languageControlShort}</span>
            <div class="mobile-menu-language-row">
              {LEARNING_LANGUAGE_OPTIONS.map((option) => (
                <Link
                  key={`mobile-lang-${option.code}`}
                  href={buildLanguageHref(location.url, option.code)}
                  class={languageChipClass(option.code === currentLanguage)}
                  aria-current={option.code === currentLanguage ? "page" : undefined}
                  onClick$={closeMobileMenu}
                >
                  <span class="language-chip-code">{option.code.toUpperCase()}</span>
                  <span>{option.nativeName}</span>
                </Link>
              ))}
            </div>
          </div>

          <div class="mobile-menu-language" aria-label={ui.uiLanguageControlTitle}>
            <span class="mobile-menu-language-label">{ui.uiLanguageControlShort}</span>
            <div class="mobile-menu-language-row">
              {UI_LANGUAGE_OPTIONS.map((option) => (
                <Link
                  key={`mobile-ui-lang-${option.code}`}
                  href={buildUiLanguageHref(location.url, option.code)}
                  class={languageChipClass(option.code === currentUiLanguage)}
                  aria-current={option.code === currentUiLanguage ? "page" : undefined}
                  onClick$={closeMobileMenu}
                >
                  <span class="language-chip-code">{option.code.toUpperCase()}</span>
                  <span>{option.nativeName}</span>
                </Link>
              ))}
            </div>
          </div>

          {sessionStore.isAuth && (
            <nav class="mobile-menu-list" aria-label="Main">
              <a href="/path" class={mobileMenuItemClass(homeActive)} aria-current={homeActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 0 1-1.5-1.5z" /></svg></span><span class={mobileMenuLabelClass(homeActive)}>{ui.navHome}</span></a>
              <a href="/feed" class={mobileMenuItemClass(feedActive)} aria-current={feedActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><rect x="4.5" y="4.5" width="15" height="15" rx="4" ry="4" /><circle cx="12" cy="12" r="2.25" /><path d="M16.875 7.125h.01" /></svg></span><span class={mobileMenuLabelClass(feedActive)}>{ui.navFeed}</span></a>
              <a href="/vocabulary/" class={mobileMenuItemClass(vocabularyActive)} aria-current={vocabularyActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25h9a2.25 2.25 0 0 1 2.25 2.25v11.25H7.5a2.25 2.25 0 0 0-2.25 2.25z" /><path d="M7.5 5.25v15.75" /><path d="M18.75 7.5v11.25H9.75" /></svg></span><span class={mobileMenuLabelClass(vocabularyActive)}>{ui.navVocabulary}</span></a>
              <a href="/language-map/" class={mobileMenuItemClass(mapActive)} aria-current={mapActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><circle cx="6.75" cy="6.75" r="2.1" /><circle cx="17.25" cy="6.75" r="2.1" /><circle cx="12" cy="17.25" r="2.1" /><path d="m8.7 7.8 2.55 7.65" /><path d="m15.3 7.8-2.55 7.65" /><path d="M8.7 6.75h6.6" /></svg></span><span class={mobileMenuLabelClass(mapActive)}>{ui.navMap}</span></a>
              <a href="/quests/" class={mobileMenuItemClass(questsActive)} aria-current={questsActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M7.5 4.5h9l3 3v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4.5 19.5v-12z" /><path d="M16.5 4.5v4.5h4.5" /><path d="m9 12 2.1 2.1L15 10.2" /></svg></span><span class={mobileMenuLabelClass(questsActive)}>{ui.navQuests}</span></a>
              <Link href="/profile" class={mobileMenuItemClass(profileActive)} aria-current={profileActive ? "page" : undefined} onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="8.25" r="3.15" /><path d="M5.25 19.5c1.65-3.3 4.2-4.95 6.75-4.95s5.1 1.65 6.75 4.95" /></svg></span><span class={mobileMenuLabelClass(profileActive)}>{ui.navProfile}</span></Link>
              <a href="/logout" class="mobile-menu-item" data-logout="true" onClick$={closeMobileMenu}><span class="mobile-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H9" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="mobile-menu-item-label">Logout</span></a>
            </nav>
          )}
        </aside>
      </div>

      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">
            <span class="brand-dot" aria-hidden="true" />
            <div>
              <p class="eyebrow">{ui.appName}</p>
              <h1 class="headline">{ui.appTagline}</h1>
            </div>
          </div>

          <div class="topbar-actions">
            <div class="lang-popup-wrap">
              <button
                type="button"
                class={langPopupOpen.value ? "lang-popup-btn open" : "lang-popup-btn"}
                aria-expanded={langPopupOpen.value ? "true" : "false"}
                aria-haspopup="dialog"
                aria-label={ui.languageControlTitle}
                onClick$={openLangPopup}
              >
                <span class="lang-popup-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <circle cx="12" cy="12" r="8.25" />
                    <path d="M12 3.75C10.5 6 9 9 9 12s1.5 6 3 8.25" />
                    <path d="M12 3.75C13.5 6 15 9 15 12s-1.5 6-3 8.25" />
                    <path d="M3.75 12h16.5" />
                    <path d="M4.88 8.25h14.24" />
                    <path d="M4.88 15.75h14.24" />
                  </svg>
                </span>
                <span class="lang-popup-btn-chips" aria-hidden="true">
                  <span class="lang-popup-btn-code">{currentLanguage.toUpperCase()}</span>
                  <span class="lang-popup-btn-sep">·</span>
                  <span class="lang-popup-btn-code">{currentUiLanguage.toUpperCase()}</span>
                </span>
              </button>

              {langPopupOpen.value && (
                <>
                  <div class="lang-popup-panel" role="dialog" aria-label={ui.languageControlTitle}>
                    <div class="lang-popup-section">
                      <span class="lang-popup-section-label">{ui.languageControlTitle}</span>
                      <div class="lang-popup-chips">
                        {LEARNING_LANGUAGE_OPTIONS.map((option) => (
                          <Link
                            key={`popup-lang-${option.code}`}
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

                    <div class="lang-popup-divider" aria-hidden="true" />

                    <div class="lang-popup-section">
                      <span class="lang-popup-section-label">{ui.uiLanguageControlTitle}</span>
                      <div class="lang-popup-chips">
                        {UI_LANGUAGE_OPTIONS.map((option) => (
                          <Link
                            key={`popup-ui-lang-${option.code}`}
                            href={buildUiLanguageHref(location.url, option.code)}
                            class={languageChipClass(option.code === currentUiLanguage)}
                            aria-current={option.code === currentUiLanguage ? "page" : undefined}
                          >
                            <span class="language-chip-code">{option.code.toUpperCase()}</span>
                            <span>{option.nativeName}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button type="button" class="mobile-menu-trigger" aria-label={ui.mobileMenuOpen} onClick$={openMobileMenu}>
              <span class="mobile-menu-trigger-text">{ui.mobileMenuLabel}</span>
              <span class="mobile-menu-trigger-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          {sessionStore.isAuth && (
            <nav class="nav nav-desktop" aria-label="Main">
              <a href="/path" class={navItemClass(homeActive)} aria-current={homeActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 0 1-1.5-1.5z" /></svg></span><span class={navItemLabelClass(homeActive)}>{ui.navHome}</span></a>
              <a href="/feed" class={navItemClass(feedActive)} aria-current={feedActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><rect x="4.5" y="4.5" width="15" height="15" rx="4" ry="4" /><circle cx="12" cy="12" r="2.25" /><path d="M16.875 7.125h.01" /></svg></span><span class={navItemLabelClass(feedActive)}>{ui.navFeed}</span></a>
              <a href="/vocabulary/" class={navItemClass(vocabularyActive)} aria-current={vocabularyActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25h9a2.25 2.25 0 0 1 2.25 2.25v11.25H7.5a2.25 2.25 0 0 0-2.25 2.25z" /><path d="M7.5 5.25v15.75" /><path d="M18.75 7.5v11.25H9.75" /></svg></span><span class={navItemLabelClass(vocabularyActive)}>{ui.navVocabulary}</span></a>
              <a href="/language-map/" class={navItemClass(mapActive)} aria-current={mapActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><circle cx="6.75" cy="6.75" r="2.1" /><circle cx="17.25" cy="6.75" r="2.1" /><circle cx="12" cy="17.25" r="2.1" /><path d="m8.7 7.8 2.55 7.65" /><path d="m15.3 7.8-2.55 7.65" /><path d="M8.7 6.75h6.6" /></svg></span><span class={navItemLabelClass(mapActive)}>{ui.navMap}</span></a>
              <a href="/quests/" class={navItemClass(questsActive)} aria-current={questsActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M7.5 4.5h9l3 3v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4.5 19.5v-12z" /><path d="M16.5 4.5v4.5h4.5" /><path d="m9 12 2.1 2.1L15 10.2" /></svg></span><span class={navItemLabelClass(questsActive)}>{ui.navQuests}</span></a>
              <Link href="/profile" class={navItemClass(profileActive)} aria-current={profileActive ? "page" : undefined}><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="8.25" r="3.15" /><path d="M5.25 19.5c1.65-3.3 4.2-4.95 6.75-4.95s5.1 1.65 6.75 4.95" /></svg></span><span class={navItemLabelClass(profileActive)}>{ui.navProfile}</span></Link>
              <a href="/logout" class="nav-link" data-logout="true"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H9" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="nav-label">Logout</span></a>
            </nav>
          )}
        </div>
      </header>

      <main>
        <Slot />
      </main>
    </div>
  );
});
