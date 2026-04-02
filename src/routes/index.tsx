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
        <div class="hero-copy">
          <h2 class="hero-title">{ui.homeTitle}</h2>
          <p class="hero-subtitle">{ui.homeSubtitle}</p>
        </div>

        <div class="hero-primary-action">
          <span class="hero-primary-kicker">Recommended first step</span>
          <h3 class="hero-primary-title">{ui.homeActionPlacementTitle}</h3>
          <p class="hero-primary-body">{ui.homeActionPlacementBody}</p>
          <Link href="/profile" class="hero-primary-link">
            {ui.homeActionPlacementTitle}
          </Link>
        </div>

        <div class="hero-secondary-actions">
          <Link href="/feed" class="hero-mini-action">
            <span class="hero-mini-title">{ui.homeActionContinueTitle}</span>
            <span class="hero-mini-body">{ui.homeActionContinueBody}</span>
          </Link>

          <Link href="/quests/" class="hero-mini-action">
            <span class="hero-mini-title">{ui.homeActionQuestTitle}</span>
            <span class="hero-mini-body">{ui.homeActionQuestBody}</span>
          </Link>

          <Link href="/language-map/" class="hero-mini-action">
            <span class="hero-mini-title">{ui.homeActionReviewTitle}</span>
            <span class="hero-mini-body">{ui.homeActionReviewBody}</span>
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
