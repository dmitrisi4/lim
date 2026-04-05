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

type FeedSwiperInstance = {
  activeIndex?: number;
  allowTouchMove?: boolean;
  mousewheel?: {
    enable?: () => void;
    disable?: () => void;
  };
  keyboard?: {
    enable?: () => void;
    disable?: () => void;
  };
  update?: () => void;
};

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
	const clientReady = useSignal(false);
	const swiperReady = useSignal(false);
  const detailsOverlayOpen = useSignal(false);
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
  const showLoader =
    !clientReady.value || (hasAnswerFilters && !outcomesReady.value) || (renderedTotal > 0 && !swiperReady.value);

  useVisibleTask$(({ cleanup }) => {
    clientReady.value = true;

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
  }, { strategy: "document-ready" });

  const handleComplete$ = $(async (payload: CardCompletionInput) => {
    if (typeof payload.correct === "boolean") {
      answerOutcomes.value = writeCardAnswerOutcome(payload.cardId, payload.correct);
      outcomesReady.value = true;
    }

    await props.onComplete$(payload);
  });

  useVisibleTask$(({ track }) => {
    track(() => swiperRenderKey);
    detailsOverlayOpen.value = false;
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => clientReady.value);
    track(() => swiperRenderKey);

    const element = swiperRef.value as (HTMLElement & { swiper?: FeedSwiperInstance }) | undefined;
    swiperReady.value = false;

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

    const markSwiperReady = () => {
      swiperReady.value = true;
      syncActiveIndex();
    };

    element.addEventListener("swiperslidechange", onSlideChange);
    element.addEventListener("swiperinit", markSwiperReady);

    if (typeof element.swiper?.activeIndex === "number") {
      markSwiperReady();
    }

    cleanup(() => {
      element.removeEventListener("swiperslidechange", onSlideChange);
      element.removeEventListener("swiperinit", markSwiperReady);
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => clientReady.value);
    track(() => swiperReady.value);
    track(() => swiperRenderKey);
    track(() => detailsOverlayOpen.value);

    const element = swiperRef.value as (HTMLElement & { swiper?: FeedSwiperInstance }) | undefined;
    const swiper = element?.swiper;

    if (!clientReady.value || !swiperReady.value || !swiper) {
      return;
    }

    const locked = detailsOverlayOpen.value;

    swiper.allowTouchMove = !locked;

    if (locked) {
      swiper.mousewheel?.disable?.();
      swiper.keyboard?.disable?.();
    } else {
      swiper.mousewheel?.enable?.();
      swiper.keyboard?.enable?.();
    }

    swiper.update?.();

    cleanup(() => {
      const currentSwiper = (swiperRef.value as (HTMLElement & { swiper?: FeedSwiperInstance }) | undefined)?.swiper;
      if (!currentSwiper) return;

      currentSwiper.allowTouchMove = true;
      currentSwiper.mousewheel?.enable?.();
      currentSwiper.keyboard?.enable?.();
      currentSwiper.update?.();
    });
  });

  return (
    <div class="feed-swiper-wrap">
      {clientReady.value ? (
        <SwiperContainer
          key={swiperRenderKey}
          ref={swiperRef}
          class={swiperReady.value ? "feed-swiper feed-swiper-ready" : "feed-swiper feed-swiper-pending"}
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
                  onDetailsOpenChange$={$((open: boolean) => {
                    detailsOverlayOpen.value = open;
                  })}
                  onComplete$={handleComplete$}
                />
              </div>
            </SwiperSlide>
          ))}
        </SwiperContainer>
      ) : (
        <div class="feed-swiper feed-swiper-pending" aria-hidden="true" />
      )}

      {showLoader ? (
        <div class="feed-swiper-loader" role="status" aria-live="polite" aria-label="Loading feed slider">
          <span class="feed-swiper-loader-ring" aria-hidden="true" />
          <span class="feed-swiper-loader-text">Loading cards...</span>
        </div>
      ) : null}

      {renderedTotal === 0 ? <p class="feed-empty">{props.emptyStateLabel ?? "No cards found."}</p> : null}

      {renderedTotal > 0 && !showLoader ? (
        <aside class="feed-side-pagination" aria-live="polite">
          <span class="feed-side-current">{Math.min(renderedTotal, activeIndex.value + 1)}</span>
          <span class="feed-side-sep">/</span>
          <span class="feed-side-total">{renderedTotal}</span>
        </aside>
      ) : null}
    </div>
  );
});
