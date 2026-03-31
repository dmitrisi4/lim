import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { LearningOverview } from "~/features/home/ui/LearningOverview";
import { DEMO_USER_ID, getMockLearningOverview } from "~/shared/api/mock-db";
import { useI18n } from "~/shared/i18n/context";
import { LEARNING_LANGUAGE_COOKIE, detectLearningLanguage } from "~/shared/i18n/ui";
import styles from "~/routes/index.css?inline";

export const useHomeOverviewLoader = routeLoader$(({ url, cookie }) => {
  const language = detectLearningLanguage(url, cookie.get(LEARNING_LANGUAGE_COOKIE)?.value);
  return getMockLearningOverview(DEMO_USER_ID, language);
});

export default component$(() => {
  useStylesScoped$(styles);
  const { ui } = useI18n();
  const overview = useHomeOverviewLoader();

  return (
    <>
      <section class="hero">
        <h2 class="hero-title">{ui.homeTitle}</h2>
        <p class="hero-subtitle">{ui.homeSubtitle}</p>

        <div class="hero-actions">
          <Link href="/feed" class="hero-link hero-link-primary">
            {ui.homeOpenFeed}
          </Link>
          <Link href="/vocabulary/" class="hero-link hero-link-secondary">
            {ui.homeOpenVocabulary}
          </Link>
          <a href="/language-map/" class="hero-link hero-link-secondary">
            {ui.homeOpenLanguageMap}
          </a>
          <a href="/quests/" class="hero-link hero-link-secondary">
            {ui.homeOpenQuests}
          </a>
          <Link href="/profile" class="hero-link hero-link-secondary">
            {ui.homeOpenProfile}
          </Link>
        </div>
      </section>

      <LearningOverview overview={overview.value} />
    </>
  );
});

export const head: DocumentHead = {
  title: "Lim | Home",
  meta: [
    {
      name: "description",
      content: "Useful scroll with interactive cards"
    }
  ]
};
