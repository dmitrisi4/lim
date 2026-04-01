import { $, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { CardRenderer } from "~/entities/card/ui/CardRenderer";
import type { Card } from "~/entities/card/model/types";
import {
	CARD_ANSWER_OUTCOMES_STORAGE_KEY,
	readCardAnswerOutcomes,
	writeCardAnswerOutcome
} from "~/features/feed/model/card-answer-outcomes";
import type { CardCompletionInput } from "~/features/interactions/model/types";
import type { FeedAnswerFilter } from "~/shared/lib/feed-filters";
import styles from "~/features/feed/ui/FeedList.css?inline";
import { SwiperContainer, SwiperSlide } from "~/shared/ui/Swiper";

interface FeedListProps {
  cards: Card[];
  isSubmitting?: boolean;
  startIndex?: number;
  totalAvailable?: number;
  answerFilters?: FeedAnswerFilter[];
  emptyStateLabel?: string;
  onComplete$: PropFunction<(payload: CardCompletionInput) => void | Promise<void>>;
}

export const FeedList = component$<FeedListProps>((props) => {
	useStylesScoped$(styles);

	const activeIndex = useSignal(0);
	const swiperRef = useSignal<HTMLElement>();
  const answerOutcomes = useSignal<Record<string, FeedAnswerFilter>>({});
  const outcomesReady = useSignal(false);

  const answerFilterKey = (props.answerFilters ?? []).join("|");
  const hasAnswerFilters = answerFilterKey.length > 0;
  const shouldApplyAnswerFilters = hasAnswerFilters && outcomesReady.value;
  const visibleCards = shouldApplyAnswerFilters
    ? props.cards.filter((card) => {
        const outcome = answerOutcomes.value[card.id];
        if (!outcome) {
          return (props.answerFilters ?? []).includes("unanswered");
        }

        return (props.answerFilters ?? []).includes(outcome);
      })
    : props.cards;
  const renderedTotal = visibleCards.length;
  const swiperRenderKey = `answers:${answerFilterKey}|total:${renderedTotal}`;

  useVisibleTask$(({ cleanup }) => {
    const syncFromStorage = () => {
      answerOutcomes.value = readCardAnswerOutcomes();
      outcomesReady.value = true;
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CARD_ANSWER_OUTCOMES_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    cleanup(() => {
      window.removeEventListener("storage", onStorage);
    });
  });

  const handleComplete$ = $(async (payload: CardCompletionInput) => {
    if (typeof payload.correct === "boolean") {
      answerOutcomes.value = writeCardAnswerOutcome(payload.cardId, payload.correct);
      outcomesReady.value = true;
    }

    await props.onComplete$(payload);
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => props.cards.length);
    track(() => (props.answerFilters ?? []).join("|"));
    track(() => outcomesReady.value);
    track(() => JSON.stringify(answerOutcomes.value));

    const element = swiperRef.value as (HTMLElement & { swiper?: { activeIndex?: number } }) | undefined;
    if (!element) {
      activeIndex.value = 0;
      return;
    }

    const syncActiveIndex = () => {
      const raw = element.swiper?.activeIndex;
      const normalized = typeof raw === "number" && raw >= 0 ? raw : 0;
      const maxIndex = Math.max(0, visibleCards.length - 1);
      activeIndex.value = Math.min(normalized, maxIndex);
    };

    const onSlideChange = () => {
      syncActiveIndex();
    };

    element.addEventListener("swiperslidechange", onSlideChange);
    element.addEventListener("swiperinit", onSlideChange);
    syncActiveIndex();

    cleanup(() => {
      element.removeEventListener("swiperslidechange", onSlideChange);
      element.removeEventListener("swiperinit", onSlideChange);
    });
  });

  return (
    <div class="feed-swiper-wrap">
      <SwiperContainer
        key={swiperRenderKey}
        ref={swiperRef}
        class="feed-swiper"
        direction="vertical"
        slides-per-view="1"
        space-between="0"
        mousewheel-enabled="true"
        mousewheel-force-to-axis="true"
        mousewheel-threshold-delta="34"
        mousewheel-threshold-time="420"
        mousewheel-sensitivity="0.55"
        mousewheel-release-on-edges="false"
        keyboard="true"
        speed="360"
        resistance-ratio="0.15"
        touch-start-prevent-default="false"
        touch-start-force-prevent-default="false"
      >
        {visibleCards.map((card, index) => (
          <SwiperSlide key={`${card.id}|${renderedTotal}`} class="feed-slide">
            <div class="slide-inner">
              <CardRenderer
                card={card}
                variant="immersive"
                cardPosition={index + 1}
                totalCards={renderedTotal}
                isSubmitting={props.isSubmitting}
                onComplete$={handleComplete$}
              />
            </div>
          </SwiperSlide>
        ))}
      </SwiperContainer>
      {renderedTotal === 0 ? <p class="feed-empty">{props.emptyStateLabel ?? "No cards found."}</p> : null}

      <aside class="feed-side-pagination" aria-live="polite">
        <span class="feed-side-current">{Math.min(renderedTotal, activeIndex.value + 1)}</span>
        <span class="feed-side-sep">/</span>
        <span class="feed-side-total">{renderedTotal}</span>
      </aside>
    </div>
  );
});
