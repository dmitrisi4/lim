import { createContextId, useContext } from "@builder.io/qwik";
import type { LearningLanguage, UiCopy, UiLanguage } from "~/shared/i18n/ui";

export interface I18nContextValue {
  language: LearningLanguage;
  uiLanguage: UiLanguage;
  ui: UiCopy;
}

export const I18N_CONTEXT = createContextId<I18nContextValue>("lim.i18n.context");

export function useI18n(): I18nContextValue {
  return useContext(I18N_CONTEXT);
}
