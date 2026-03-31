import { $, component$, type PropFunction, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import { writeCompletedCardProgress } from "~/entities/card/model/completed-progress";
import { VERB_TENSE_OPTIONS, getVerbInsight, type VerbTense } from "~/features/vocabulary/model/verb-insights";
import {
  VOCABULARY_WORD_PROGRESS_STORAGE_KEY,
  readVocabularyWordProgress,
  toggleVocabularyWordProgress
} from "~/features/vocabulary/model/word-progress";
import { getPrimaryWordSection, type VocabularyProgressFilter, type VocabularySection, type VocabularyWord, type VocabularyWordType } from "~/features/vocabulary/model/word-bank";
import type { LearningLanguage } from "~/shared/i18n/ui";
import styles from "~/features/vocabulary/ui/VocabularyDeck.css?inline";

const EVERYDAY_TENSES = new Set<VerbTense>(["present_simple", "past_simple", "future_simple", "present_continuous"]);

interface VocabularyDeckProps {
  language: LearningLanguage;
  words: VocabularyWord[];
  emptyLabel: string;
  photoPlaceholderLabel: string;
  photoHintLabel: string;
  exampleLabel: string;
  progressFilter: VocabularyProgressFilter;
  markLearnedLabel: string;
  learnedLabel: string;
  verbFormsButtonLabel: string;
  verbExamplesButtonLabel: string;
  verbFormsTitleLabel: string;
  verbTenseLabelMap: Record<VerbTense, string>;
  verbExamplesTitleLabel: string;
  verbCloseLabel: string;
  verbPersonLabel: string;
  verbFormLabel: string;
  verbUsageLabel: string;
  typeLabelMap: Record<VocabularyWordType, string>;
  sectionLabelMap: Record<VocabularySection, string>;
  explainButtonLabel: string;
  onExplainWord$?: PropFunction<(word: VocabularyWord) => void>;
}

export const VocabularyDeck = component$<VocabularyDeckProps>((props) => {
  useStylesScoped$(styles);

  const SwiperContainer = "swiper-container" as unknown as any;
  const SwiperSlide = "swiper-slide" as unknown as any;
  const activeIndex = useSignal(0);
  const swiperRef = useSignal<HTMLElement>();
  const verbModalRef = useSignal<HTMLElement>();
  const verbFormsSliderRef = useSignal<HTMLElement>();
  const verbFormsScrollbarRef = useSignal<HTMLElement>();
  const openVerbTense = useSignal<null | { wordId: string; tense: VerbTense }>(null);
  const cardContextMenu = useSignal<null | { wordId: string; x: number; y: number }>(null);
  const modalScrollState = useSignal({ canScroll: false, atBottom: false });
  const verbFormsSliderState = useSignal({ thumbWidth: 100, thumbLeft: 0 });
  const verbFormsScrollbarDragging = useSignal(false);
  const activeVerbPanel = useSignal<null | { wordId: string; mode: "forms" | "examples" }>(null);
  const wordProgress = useSignal<Record<string, boolean>>({});
  const progressReady = useSignal(false);
  const visibleWords =
    props.progressFilter === "all"
      ? props.words
      : progressReady.value
      ? props.words.filter((word) => {
        const learned = wordProgress.value[word.id] === true;
        return props.progressFilter === "learned" ? learned : !learned;
      })
      : [];
  const total = visibleWords.length;
  const swiperRenderKey = `progress:${props.progressFilter}|total:${total}`;

  useVisibleTask$(({ cleanup }) => {
    const syncFromStorage = () => {
      wordProgress.value = readVocabularyWordProgress();
      progressReady.value = true;
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === VOCABULARY_WORD_PROGRESS_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    cleanup(() => {
      window.removeEventListener("storage", onStorage);
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => props.words.length);
    track(() => props.progressFilter);
    track(() => progressReady.value);
    track(() => JSON.stringify(wordProgress.value));

    const element = swiperRef.value as (HTMLElement & { swiper?: { activeIndex?: number } }) | undefined;
    if (!element) {
      activeIndex.value = 0;
      return;
    }

    const syncActiveIndex = () => {
      const raw = element.swiper?.activeIndex;
      const normalized = typeof raw === "number" && raw >= 0 ? raw : 0;
      const maxIndex = Math.max(0, visibleWords.length - 1);
      activeIndex.value = Math.min(normalized, maxIndex);
    };

    const onSlideChange = () => {
      syncActiveIndex();
      cardContextMenu.value = null;
    };

    element.addEventListener("swiperslidechange", onSlideChange);
    element.addEventListener("swiperinit", onSlideChange);
    syncActiveIndex();

    cleanup(() => {
      element.removeEventListener("swiperslidechange", onSlideChange);
      element.removeEventListener("swiperinit", onSlideChange);
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => activeVerbPanel.value?.wordId ?? "");
    track(() => activeVerbPanel.value?.mode ?? "");
    track(() => verbModalRef.value);

    const element = verbModalRef.value;
    if (!element) {
      modalScrollState.value = { canScroll: false, atBottom: false };
      return;
    }

    const updateScrollState = () => {
      const canScroll = element.scrollHeight - element.clientHeight > 8;
      const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 8;
      modalScrollState.value = { canScroll, atBottom };
    };

    const onScroll = () => {
      updateScrollState();
    };

    const onResize = () => {
      updateScrollState();
    };

    updateScrollState();
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    cleanup(() => {
      element.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => activeVerbPanel.value?.wordId ?? "");
    track(() => activeVerbPanel.value?.mode ?? "");
    track(() => verbFormsSliderRef.value);

    if (activeVerbPanel.value?.mode !== "forms") {
      verbFormsSliderState.value = { thumbWidth: 100, thumbLeft: 0 };
      return;
    }

    const element = verbFormsSliderRef.value;
    if (!element) {
      verbFormsSliderState.value = { thumbWidth: 100, thumbLeft: 0 };
      return;
    }

    const updateSliderState = () => {
      const visibleWidth = Math.max(element.clientWidth, 1);
      const totalWidth = Math.max(element.scrollWidth, visibleWidth);
      const maxScrollLeft = Math.max(totalWidth - visibleWidth, 0);
      const rawThumbWidth = (visibleWidth / totalWidth) * 100;
      const thumbWidth = Math.min(100, Math.max(rawThumbWidth, 18));
      const thumbTravel = 100 - thumbWidth;
      const progress = maxScrollLeft > 0 ? element.scrollLeft / maxScrollLeft : 0;
      const thumbLeft = thumbTravel * progress;
      verbFormsSliderState.value = { thumbWidth, thumbLeft: Number.isFinite(thumbLeft) ? thumbLeft : 0 };
    };

    const onScroll = () => {
      updateSliderState();
    };

    const onResize = () => {
      updateSliderState();
    };

    updateSliderState();
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const rafId = window.requestAnimationFrame(() => {
      updateSliderState();
    });

    cleanup(() => {
      window.cancelAnimationFrame(rafId);
      element.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    });
  });

  const openCardContextMenu$ = $((event: Event, wordId: string, withVerbActions: boolean) => {
    const target = event.target as Element | null;
    if (target?.closest("button, a, input, textarea, select, label, [role='button'], [data-menu-skip='true']")) {
      return;
    }

    const cardElement = event.currentTarget as HTMLElement | null;
    if (!cardElement) {
      return;
    }

    const mouseEvent = event as MouseEvent;
    const cardRect = cardElement.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = withVerbActions ? 220 : 164;
    const localX = Number.isFinite(mouseEvent.clientX) ? mouseEvent.clientX - cardRect.left : cardRect.width * 0.5;
    const localY = Number.isFinite(mouseEvent.clientY) ? mouseEvent.clientY - cardRect.top : cardRect.height * 0.5;
    const maxX = Math.max(14, cardRect.width - menuWidth - 14);
    const maxY = Math.max(14, cardRect.height - menuHeight - 14);
    const x = Math.min(Math.max(localX, 14), maxX);
    const y = Math.min(Math.max(localY, 14), maxY);

    cardContextMenu.value = { wordId, x, y };
  });

  const onVerbFormsScrollbarPointerDown$ = $((event: PointerEvent) => {
    const slider = verbFormsSliderRef.value;
    const scrollbar = verbFormsScrollbarRef.value;
    if (!slider || !scrollbar) {
      return;
    }

    event.preventDefault();
    verbFormsScrollbarDragging.value = true;

    const scrollbarRect = scrollbar.getBoundingClientRect();
    const trackWidth = Math.max(scrollbarRect.width, 1);
    const maxScrollLeft = Math.max(slider.scrollWidth - slider.clientWidth, 0);
    const thumbWidthPx = (verbFormsSliderState.value.thumbWidth / 100) * trackWidth;
    const maxThumbLeftPx = Math.max(trackWidth - thumbWidthPx, 0);

    const syncScrollByClientX = (clientX: number) => {
      if (maxScrollLeft <= 0 || maxThumbLeftPx <= 0) {
        slider.scrollTo({ left: 0, behavior: "auto" });
        return;
      }

      const thumbLeftPx = Math.min(Math.max(clientX - scrollbarRect.left - thumbWidthPx * 0.5, 0), maxThumbLeftPx);
      const progress = thumbLeftPx / maxThumbLeftPx;
      slider.scrollTo({ left: progress * maxScrollLeft, behavior: "auto" });
    };

    syncScrollByClientX(event.clientX);

    const onPointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      syncScrollByClientX(moveEvent.clientX);
    };

    const stopDragging = () => {
      verbFormsScrollbarDragging.value = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  });

  const isVerbPanelOpen = activeVerbPanel.value !== null;

  const toggleLearnedState$ = $((wordId: string) => {
    const nextWordProgress = toggleVocabularyWordProgress(wordId);
    wordProgress.value = nextWordProgress;
    progressReady.value = true;
    writeCompletedCardProgress(wordId, nextWordProgress[wordId] === true);
  });

  return (
    <div class="vocab-swiper-wrap">
      <SwiperContainer
        key={swiperRenderKey}
        ref={swiperRef}
        class="vocab-swiper"
        direction="vertical"
        slides-per-view="1"
        space-between="0"
        mousewheel-enabled={isVerbPanelOpen ? "false" : "true"}
        mousewheel-force-to-axis="true"
        mousewheel-threshold-delta="34"
        mousewheel-threshold-time="420"
        mousewheel-sensitivity="0.55"
        mousewheel-release-on-edges="false"
        keyboard={isVerbPanelOpen ? "false" : "true"}
        allow-touch-move={isVerbPanelOpen ? "false" : "true"}
        speed="320"
        resistance-ratio="0.16"
        touch-start-prevent-default="false"
        touch-start-force-prevent-default="false"
      >
        {visibleWords.map((word) => {
          const insight = word.type === "verb" ? getVerbInsight(word.term, props.language) : null;
          const primarySection = getPrimaryWordSection(word);
          const panelState = activeVerbPanel.value;
          const isPanelOpen = panelState?.wordId === word.id;
          const menuState = cardContextMenu.value;
          const isMenuOpen = menuState?.wordId === word.id;
          const isLearned = wordProgress.value[word.id] === true;
          const panelTitle =
            panelState?.mode === "forms" ? props.verbFormsTitleLabel : panelState?.mode === "examples" ? props.verbExamplesTitleLabel : "";
          const keyTenses: readonly VerbTense[] = ["present_simple", "past_simple", "future_simple"];
          const tenseSlides = insight
            ? [...keyTenses, ...VERB_TENSE_OPTIONS.filter((tense) => !keyTenses.includes(tense))]
                .map((tense) => ({
                  tense,
                  rows: insight.formsByTense[tense]
                }))
                .filter((entry) => entry.rows.length > 0)
            : [];
          const tenseSlidePages = Array.from(
            { length: Math.ceil(tenseSlides.length / 3) },
            (_, pageIndex) => tenseSlides.slice(pageIndex * 3, pageIndex * 3 + 3)
          );

          return (
            <SwiperSlide key={word.id} class="vocab-slide">
              <article
                class="vocab-card"
                onClick$={(event) => {
                  openCardContextMenu$(event, word.id, insight !== null);
                }}
                onContextMenu$={(event) => {
                  event.preventDefault();
                  openCardContextMenu$(event, word.id, insight !== null);
                }}
              >
                <header class="vocab-card-head">
                  <span class="vocab-chip vocab-chip-type">{props.typeLabelMap[word.type]}</span>
                  <span class="vocab-chip vocab-chip-section">{props.sectionLabelMap[primarySection]}</span>
                </header>

                <div class="vocab-photo-slot">
                  {word.imageUrl ? (
                    <img class="vocab-photo" src={word.imageUrl} alt={word.imageAlt ?? word.term} loading="lazy" />
                  ) : (
                    <div class="vocab-photo-placeholder" aria-label={props.photoPlaceholderLabel}>
                      <p class="vocab-photo-title">{props.photoPlaceholderLabel}</p>
                      <p class="vocab-photo-hint">{props.photoHintLabel}</p>
                    </div>
                  )}
                </div>

                <h3 class="vocab-term">{word.term}</h3>
                <p class="vocab-translation">{word.translation}</p>

                <div class="vocab-actions-row">
                  <div class="vocab-support-actions">
                    {insight ? (
                      <div class="vocab-verb-actions">
                        <button
                          type="button"
                          class="vocab-verb-action"
                          onClick$={() => {
                            const firstTense = VERB_TENSE_OPTIONS.find((tense) => (insight.formsByTense[tense]?.length ?? 0) > 0) ?? null;
                            activeVerbPanel.value = { wordId: word.id, mode: "forms" };
                            openVerbTense.value = firstTense ? { wordId: word.id, tense: firstTense } : null;
                            cardContextMenu.value = null;
                          }}
                        >
                          {props.verbFormsButtonLabel}
                        </button>
                        <button
                          type="button"
                          class="vocab-verb-action"
                          onClick$={() => {
                            activeVerbPanel.value = { wordId: word.id, mode: "examples" };
                            cardContextMenu.value = null;
                          }}
                        >
                          {props.verbExamplesButtonLabel}
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      class="vocab-explain-action"
                      onClick$={() => {
                        cardContextMenu.value = null;
                        props.onExplainWord$?.(word);
                      }}
                    >
                      {props.explainButtonLabel}
                    </button>
                  </div>

                  <button
                    type="button"
                    class={isLearned ? "vocab-learn-toggle active" : "vocab-learn-toggle"}
                    onClick$={() => {
                      toggleLearnedState$(word.id);
                      cardContextMenu.value = null;
                    }}
                  >
                    {isLearned ? props.learnedLabel : props.markLearnedLabel}
                  </button>
                </div>

                {isMenuOpen ? (
                  <>
                    <button
                      type="button"
                      class="vocab-card-context-backdrop"
                      data-menu-skip="true"
                      aria-label="Close context menu"
                      onClick$={(event) => {
                        event.stopPropagation();
                        cardContextMenu.value = null;
                      }}
                    />
                    <div
                      class="vocab-card-context-menu"
                      data-menu-skip="true"
                      style={{
                        left: `${menuState?.x ?? 0}px`,
                        top: `${menuState?.y ?? 0}px`
                      }}
                      onClick$={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <p class="vocab-card-context-title">Card actions</p>
                      {insight ? (
                        <>
                          <button
                            type="button"
                            class="vocab-card-context-action"
                            onClick$={() => {
                              const firstTense = VERB_TENSE_OPTIONS.find((tense) => (insight.formsByTense[tense]?.length ?? 0) > 0) ?? null;
                              activeVerbPanel.value = { wordId: word.id, mode: "forms" };
                              openVerbTense.value = firstTense ? { wordId: word.id, tense: firstTense } : null;
                              cardContextMenu.value = null;
                            }}
                          >
                            {props.verbFormsButtonLabel}
                          </button>
                          <button
                            type="button"
                            class="vocab-card-context-action"
                            onClick$={() => {
                              activeVerbPanel.value = { wordId: word.id, mode: "examples" };
                              cardContextMenu.value = null;
                            }}
                          >
                            {props.verbExamplesButtonLabel}
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        class="vocab-card-context-action vocab-card-context-action-explain"
                        onClick$={() => {
                          cardContextMenu.value = null;
                          props.onExplainWord$?.(word);
                        }}
                      >
                        {props.explainButtonLabel}
                      </button>
                      <button
                        type="button"
                        class="vocab-card-context-action vocab-card-context-action-learn"
                        onClick$={() => {
                          toggleLearnedState$(word.id);
                          cardContextMenu.value = null;
                        }}
                      >
                        {isLearned ? props.learnedLabel : props.markLearnedLabel}
                      </button>
                    </div>
                  </>
                ) : null}

                {word.note ? <p class="vocab-note">{word.note}</p> : null}
                {word.example ? (
                  <p class="vocab-example">
                    <span class="vocab-example-label">{props.exampleLabel}:</span> {word.example}
                  </p>
                ) : null}

                {isPanelOpen && insight ? (
                  <div
                    class="vocab-verb-modal-backdrop"
                    onClick$={() => {
                      activeVerbPanel.value = null;
                    }}
                  >
                    <div
                      class="vocab-verb-modal-shell"
                      onClick$={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <section
                        ref={verbModalRef}
                        class={panelState?.mode === "forms" ? "vocab-verb-modal vocab-verb-modal-forms" : "vocab-verb-modal"}
                        role="dialog"
                        aria-modal="true"
                        aria-label={panelTitle}
                      >
                        <header class="vocab-verb-modal-head">
                          <h4 class="vocab-verb-modal-title">{panelTitle}</h4>
                          <button
                            type="button"
                            class="vocab-verb-close"
                            onClick$={() => {
                              activeVerbPanel.value = null;
                            }}
                          >
                            {props.verbCloseLabel}
                          </button>
                        </header>

                        <p class="vocab-verb-note">{insight.note}</p>

                        {panelState?.mode === "forms" ? (
                          <div class="vocab-verb-forms-layout">
                            <div ref={verbFormsSliderRef} class="vocab-verb-forms-slider">
                              {tenseSlidePages.map((page, pageIndex) => (
                                <section key={`${word.id}-tense-page-${pageIndex}`} class="vocab-verb-forms-slide">
                                  <div class="vocab-verb-accordion">
                                    {page.map(({ tense, rows }) => {
                                      const isOpen = openVerbTense.value?.wordId === word.id && openVerbTense.value.tense === tense;
                                      const isEverydayTense = EVERYDAY_TENSES.has(tense);
                                      return (
                                        <section
                                          key={`${word.id}-tense-${tense}`}
                                          class={
                                            isEverydayTense
                                              ? isOpen
                                                ? "vocab-verb-tense-block vocab-verb-tense-block-common vocab-verb-tense-block-open"
                                                : "vocab-verb-tense-block vocab-verb-tense-block-common"
                                              : isOpen
                                              ? "vocab-verb-tense-block vocab-verb-tense-block-open"
                                              : "vocab-verb-tense-block"
                                          }
                                        >
                                          <button
                                            type="button"
                                            class="vocab-verb-tense-trigger"
                                            aria-expanded={isOpen ? "true" : "false"}
                                            onClick$={() => {
                                              openVerbTense.value = isOpen ? null : { wordId: word.id, tense };
                                            }}
                                          >
                                            <span class="vocab-verb-tense-head">
                                              <span class={isEverydayTense ? "vocab-verb-tense-title vocab-verb-tense-title-common" : "vocab-verb-tense-title"}>
                                                {props.verbTenseLabelMap[tense]}
                                              </span>
                                              <span class="vocab-verb-tense-usage">{insight.tenseUsage[tense]}</span>
                                            </span>
                                            <span class="vocab-verb-tense-caret" aria-hidden="true">
                                              {isOpen ? "−" : "+"}
                                            </span>
                                          </button>

                                          {isOpen ? (
                                            <div class="vocab-verb-tense-content">
                                              <div class="vocab-verb-table-wrap">
                                                <table class="vocab-verb-table">
                                                  <thead>
                                                    <tr>
                                                      <th>{props.verbPersonLabel}</th>
                                                      <th>{props.verbFormLabel}</th>
                                                      <th>{props.verbUsageLabel}</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {rows.map((row) => (
                                                      <tr key={`${word.id}-${tense}-${row.person}`}>
                                                        <td>{row.person}</td>
                                                        <td class="vocab-verb-form">{row.form}</td>
                                                        <td>{row.usage}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          ) : null}
                                        </section>
                                      );
                                    })}
                                  </div>
                                </section>
                              ))}
                            </div>
                            <div
                              ref={verbFormsScrollbarRef}
                              class={
                                verbFormsScrollbarDragging.value
                                  ? "vocab-verb-forms-scrollbar vocab-verb-forms-scrollbar-dragging"
                                  : "vocab-verb-forms-scrollbar"
                              }
                              aria-hidden="true"
                              onPointerDown$={onVerbFormsScrollbarPointerDown$}
                            >
                              <span
                                class="vocab-verb-forms-scrollbar-thumb"
                                style={{
                                  width: `${verbFormsSliderState.value.thumbWidth}%`,
                                  left: `${verbFormsSliderState.value.thumbLeft}%`
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <ul class="vocab-verb-examples">
                            {insight.examples.map((example, index) => (
                              <li key={`${word.id}-example-${index}`} class="vocab-verb-example-row">
                                <p class="vocab-verb-example-es">{example.spanish}</p>
                                <p class="vocab-verb-example-usage">{example.usage}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>

                      {modalScrollState.value.canScroll ? (
                        <button
                          type="button"
                          class="vocab-verb-scroll-btn"
                          aria-label={modalScrollState.value.atBottom ? "Scroll to top" : "Scroll down"}
                          onClick$={() => {
                            const element = verbModalRef.value;
                            if (!element) {
                              return;
                            }

                            if (modalScrollState.value.atBottom) {
                              element.scrollTo({ top: 0, behavior: "smooth" });
                              return;
                            }

                            const nextTop = Math.min(
                              element.scrollTop + Math.max(Math.round(element.clientHeight * 0.72), 220),
                              element.scrollHeight
                            );
                            element.scrollTo({ top: nextTop, behavior: "smooth" });
                          }}
                        >
                          {modalScrollState.value.atBottom ? "↑" : "↓"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            </SwiperSlide>
          );
        })}
      </SwiperContainer>

      {total === 0 ? <p class="vocab-empty">{props.emptyLabel}</p> : null}

      <aside class="vocab-side-pagination" aria-live="polite">
        <span class="vocab-side-current">{Math.min(total, activeIndex.value + 1)}</span>
        <span class="vocab-side-sep">/</span>
        <span class="vocab-side-total">{total}</span>
      </aside>
    </div>
  );
});
