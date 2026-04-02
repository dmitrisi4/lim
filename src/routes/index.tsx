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

        <div class="hero-actions-grid">
          <Link href="/profile" class="hero-action-card hero-action-card-primary">
            <span class="hero-action-kicker">Placement</span>
            <span class="hero-action-title">{ui.homeActionPlacementTitle}</span>
            <span class="hero-action-body">{ui.homeActionPlacementBody}</span>
          </Link>

          <Link href="/feed" class="hero-action-card">
            <span class="hero-action-kicker">Next step</span>
            <span class="hero-action-title">{ui.homeActionContinueTitle}</span>
            <span class="hero-action-body">{ui.homeActionContinueBody}</span>
          </Link>

          <Link href="/quests/" class="hero-action-card">
            <span class="hero-action-kicker">Progress</span>
            <span class="hero-action-title">{ui.homeActionQuestTitle}</span>
            <span class="hero-action-body">{ui.homeActionQuestBody}</span>
          </Link>

          <Link href="/language-map/" class="hero-action-card">
            <span class="hero-action-kicker">Focus</span>
            <span class="hero-action-title">{ui.homeActionReviewTitle}</span>
            <span class="hero-action-body">{ui.homeActionReviewBody}</span>
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
