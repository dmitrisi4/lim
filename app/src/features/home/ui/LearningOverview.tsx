import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { LearningOverviewSnapshot } from "~/shared/api/mock-db";
import { useI18n } from "~/shared/i18n/context";
import type { SlideCategory } from "~/slides/core/types";
import styles from "~/features/home/ui/LearningOverview.css?inline";

interface LearningOverviewProps {
  overview: LearningOverviewSnapshot;
}

function qualityClass(quality: number | null): string {
  if (quality === null) {
    return "overview-quality";
  }
  if (quality >= 80) {
    return "overview-quality overview-quality-good";
  }
  if (quality >= 60) {
    return "overview-quality overview-quality-mid";
  }
  return "overview-quality overview-quality-low";
}

export const LearningOverview = component$<LearningOverviewProps>((props) => {
  useStylesScoped$(styles);
  const { ui } = useI18n();

  const categoryLabelMap: Record<SlideCategory, string> = {
    grammar: ui.categoryGrammar,
    vocabulary: ui.categoryVocabulary,
    speaking: ui.categorySpeaking,
    listening: ui.categoryListening,
    reading: ui.categoryReading
  };

  return (
    <section class="overview">
      <div class="overview-head">
        <h3 class="overview-title">{ui.homeOverviewTitle}</h3>
        <p class="overview-subtitle">{ui.homeOverviewSubtitle}</p>
      </div>

      <div class="overview-grid">
        <article class="overview-panel">
          <p class="overview-panel-title">{ui.homeOverviewLevels}</p>
          <ul class="overview-list">
            {props.overview.levels.map((level) => (
              <li key={`overview-level-${level.level}`} class="overview-row">
                <div>
                  <p class="overview-main">{level.level.toUpperCase()}</p>
                  <p class="overview-meta">
                    {level.moduleCount} {ui.homeOverviewModules} · {level.cardCount} {ui.homeOverviewCards}
                  </p>
                </div>
                <p class={qualityClass(level.quality)}>
                  {ui.homeOverviewQuality}: {level.quality === null ? ui.homeOverviewNoQuality : `${level.quality}%`}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article class="overview-panel">
          <p class="overview-panel-title">{ui.homeOverviewCategories}</p>
          <ul class="overview-list">
            {props.overview.categories.map((category) => (
              <li key={`overview-category-${category.category}`} class="overview-row">
                <div>
                  <p class="overview-main">{categoryLabelMap[category.category]}</p>
                  <p class="overview-meta">
                    {category.moduleCount} {ui.homeOverviewModules} · {category.cardCount} {ui.homeOverviewCards}
                  </p>
                </div>
                <p class={qualityClass(category.quality)}>
                  {ui.homeOverviewQuality}: {category.quality === null ? ui.homeOverviewNoQuality : `${category.quality}%`}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
});
