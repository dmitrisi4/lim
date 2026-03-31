import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { isCardType } from "~/entities/card/model/guards";
import { markCardCompleted } from "~/entities/card/model/completed-progress";
import { getFeedPage } from "~/features/feed/model/get-feed";
import { FeedList } from "~/features/feed/ui/FeedList";
import type { CardCompletionInput, InteractionSubmissionInput } from "~/features/interactions/model/types";
import { submitInteraction } from "~/features/interactions/model/submit-interaction";
import { DEMO_USER_ID } from "~/shared/api/mock-db";
import { useI18n } from "~/shared/i18n/context";
import { LEARNING_LANGUAGE_COOKIE, detectLearningLanguage, isLearningLanguage } from "~/shared/i18n/ui";
import {
  FEED_ANSWER_OPTIONS,
  FEED_CATEGORY_OPTIONS,
  FEED_LEVEL_OPTIONS,
  buildFeedHref,
  type FeedAnswerFilter,
  parseFeedFiltersFromSearchParams
} from "~/shared/lib/feed-filters";
import type { SlideCategory } from "~/slides/core/types";
import styles from "~/routes/feed/index.css?inline";

const FEED_PAGE_LIMIT = 300;

export const useFeedLoader = routeLoader$(async ({ url, cookie }) => {
  const cursor = Number(url.searchParams.get("cursor") ?? "0");
  const filters = parseFeedFiltersFromSearchParams(url.searchParams);
  const language = detectLearningLanguage(url, cookie.get(LEARNING_LANGUAGE_COOKIE)?.value);

  return getFeedPage({
    userId: DEMO_USER_ID,
    cursor: Number.isFinite(cursor) ? cursor : 0,
    limit: FEED_PAGE_LIMIT,
    levels: filters.levels,
    categories: filters.categories,
    answers: filters.answers,
    language
  });
});

export const useSubmitInteractionAction = routeAction$(async (data, { cookie }) => {
  const rawCardType = typeof data.cardType === "string" ? data.cardType : "video";
  const rawLanguage = typeof data.language === "string" ? data.language : cookie.get(LEARNING_LANGUAGE_COOKIE)?.value;

  const payload: InteractionSubmissionInput = {
    userId: typeof data.userId === "string" ? data.userId : DEMO_USER_ID,
    cardId: typeof data.cardId === "string" ? data.cardId : "",
    cardType: isCardType(rawCardType) ? rawCardType : "video",
    answer: typeof data.answer === "string" ? data.answer : undefined,
    language: isLearningLanguage(rawLanguage) ? rawLanguage : "en"
  };

  return submitInteraction(payload);
});

export default component$(() => {
  useStylesScoped$(styles);
  const { ui, language } = useI18n();
  const feed = useFeedLoader();
  const submitAction = useSubmitInteractionAction();
  const categoryLabelMap: Record<SlideCategory, string> = {
    grammar: ui.categoryGrammar,
    vocabulary: ui.categoryVocabulary,
    speaking: ui.categorySpeaking,
    listening: ui.categoryListening,
    reading: ui.categoryReading
  };
  const answerLabelMap: Record<FeedAnswerFilter, string> = {
    correct: ui.feedAnswerCorrect,
    incorrect: ui.feedAnswerIncorrect,
    unanswered: ui.feedAnswerUnanswered
  };

  const onComplete$ = $(async (payload: CardCompletionInput) => {
    markCardCompleted(payload.cardId);

    await submitAction.submit({
      userId: DEMO_USER_ID,
      cardId: payload.cardId,
      cardType: payload.cardType,
      answer: payload.answer ?? "",
      language
    });
  });

  const progress = submitAction.value?.progress ?? {
    xp: feed.value.progress.xp,
    level: feed.value.progress.level,
    dailyGoal: feed.value.progress.dailyGoal,
    dailyCompleted: feed.value.progress.dailyCompleted,
    streakDays: feed.value.streak.days
  };

  const nextHref = buildFeedHref(feed.value.nextCursor, feed.value.filters, language);
  const emptyStateLabel = feed.value.filters.answers.length > 0 ? ui.feedNoAnswerMatches : ui.feedNoCards;

  return (
    <section class="feed-page">
      <aside class="feed-sidebar">
        <div class="feed-hud">
          <div class="feed-metrics">
            <span>XP {progress.xp}</span>
            <span>
              {ui.feedMetricLevel} {progress.level}
            </span>
            <span>
              {ui.feedMetricStreak} {progress.streakDays}
            </span>
          </div>
          <Link href={nextHref} class="feed-next-link">
            {ui.feedNewPack}
          </Link>
        </div>

        <details class="feed-filters-shell">
          <summary class="feed-filters-summary">
            <span class="feed-filters-summary-title">{ui.feedFiltersPanel}</span>
            <span class="feed-filters-summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </summary>

          <form method="get" class="feed-filters">
            <input type="hidden" name="cursor" value="0" />
            <input type="hidden" name="lang" value={language} />

            <div class="filter-group">
              <p class="filter-title">{ui.feedLevels}</p>
              <div class="filter-grid">
                {FEED_LEVEL_OPTIONS.map((level) => (
                  <label key={`level-${level}`} class="filter-chip">
                    <input type="checkbox" name="level" value={level} checked={feed.value.filters.levels.includes(level)} />
                    <span>{level.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-title">{ui.feedCategories}</p>
              <div class="filter-grid filter-grid-categories">
                {FEED_CATEGORY_OPTIONS.map((category) => (
                  <label key={`category-${category}`} class="filter-chip">
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      checked={feed.value.filters.categories.includes(category)}
                    />
                    <span>{categoryLabelMap[category]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-title">{ui.feedAnswers}</p>
              <div class="filter-grid">
                {FEED_ANSWER_OPTIONS.map((answerFilter) => (
                  <label key={`answer-${answerFilter}`} class="filter-chip">
                    <input
                      type="checkbox"
                      name="answer"
                      value={answerFilter}
                      checked={feed.value.filters.answers.includes(answerFilter)}
                    />
                    <span>{answerLabelMap[answerFilter]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-actions">
              <button type="submit" class="filter-apply">
                {ui.feedApplyFilters}
              </button>
              <Link href={`/feed?lang=${language}`} class="filter-reset">
                {ui.feedResetFilters}
              </Link>
            </div>
          </form>
        </details>

        {submitAction.value ? (
          <div class="feed-toast">
            <p class="feed-toast-title">{submitAction.value.message}</p>
            <p class="feed-toast-meta">
              +{submitAction.value.xpDelta} XP
              {submitAction.value.streakDelta !== 0
                ? ` · ${ui.feedMetricStreak} ${submitAction.value.streakDelta > 0 ? "+" : ""}${submitAction.value.streakDelta}`
                : ""}
            </p>
          </div>
        ) : null}
      </aside>

      <div class="feed-stage">
        <FeedList
          cards={feed.value.cards}
          startIndex={feed.value.startIndex}
          totalAvailable={feed.value.totalAvailable}
          answerFilters={feed.value.filters.answers}
          emptyStateLabel={emptyStateLabel}
          isSubmitting={submitAction.isRunning}
          onComplete$={onComplete$}
        />
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Feed"
};
