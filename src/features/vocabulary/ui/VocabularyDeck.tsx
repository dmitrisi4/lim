import { $, component$, type PropFunction, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import { VERB_TENSE_OPTIONS, getVerbInsight, type VerbTense } from "~/features/vocabulary/model/verb-insights";
import {
  VOCABULARY_WORD_PROGRESS_STORAGE_KEY,
  readVocabularyWordProgress,
  toggleVocabularyWordProgress
} from "~/features/vocabulary/model/word-progress";
import { getPrimaryWordSection, type VocabularyProgressFilter, type VocabularySection, type VocabularyWord, type VocabularyWordType } from "~/features/vocabulary/model/word-bank";
import type { LearningLanguage } from "~/shared/i18n/ui";
import styles from "~/features/vocabulary/ui/VocabularyDeck.css?inline";

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
  const verbFormsRailRef = useSignal<HTMLElement>();
  const activeVerbFormSlideIndex = useSignal(0);
  const cardContextMenu = useSignal<null | { wordId: string; x: number; y: number }>(null);
  const modalScrollState = useSignal({ canScroll: false, atBottom: false });
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
    track(() => verbFormsRailRef.value);

    const panelState = activeVerbPanel.value;
    if (!panelState || panelState.mode !== "forms") {
      activeVerbFormSlideIndex.value = 0;
      return;
    }

    const element = verbFormsRailRef.value;
    if (!element) {
      activeVerbFormSlideIndex.value = 0;
      return;
    }

    const syncActiveIndex = () => {
      const viewportWidth = Math.max(1, element.clientWidth);
      const raw = Math.round(element.scrollLeft / viewportWidth);
      const maxIndex = Math.max(0, element.children.length - 1);
      activeVerbFormSlideIndex.value = Math.min(Math.max(raw, 0), maxIndex);
    };

    const onScroll = () => {
      syncActiveIndex();
    };
    const onResize = () => {
      syncActiveIndex();
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    syncActiveIndex();

    cleanup(() => {
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

  const shiftVerbFormsSlide$ = $((direction: -1 | 1) => {
    const element = verbFormsRailRef.value;
    if (!element) {
      return;
    }

    const step = Math.max(element.clientWidth, 260);
    const maxLeft = Math.max(0, element.scrollWidth - element.clientWidth);
    const nextLeft = Math.min(Math.max(element.scrollLeft + step * direction, 0), maxLeft);
    element.scrollTo({ left: nextLeft, behavior: "smooth" });
  });

  const isVerbPanelOpen = activeVerbPanel.value !== null;

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
          const tenseSlides = insight
            ? VERB_TENSE_OPTIONS.map((tense) => ({
                tense,
                rows: insight.formsByTense[tense]
              })).filter((entry) => entry.rows.length > 0)
            : [];
          const tenseSlideCount = tenseSlides.length;

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
                            activeVerbPanel.value = { wordId: word.id, mode: "forms" };
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
                      wordProgress.value = toggleVocabularyWordProgress(word.id);
                      progressReady.value = true;
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
                              activeVerbPanel.value = { wordId: word.id, mode: "forms" };
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
                          wordProgress.value = toggleVocabularyWordProgress(word.id);
                          progressReady.value = true;
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
                      <section ref={verbModalRef} class="vocab-verb-modal" role="dialog" aria-modal="true" aria-label={panelTitle}>
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
                          <div class="vocab-verb-forms-shell">
                            <div key={`${word.id}-verb-forms`} ref={verbFormsRailRef} class="vocab-verb-forms-rail">
                              {tenseSlides.map(({ tense, rows }) => (
                                <section key={`${word.id}-tense-${tense}`} class="vocab-verb-form-slide">
                                  <section class="vocab-verb-tense-block">
                                    <h5 class="vocab-verb-tense-title">{props.verbTenseLabelMap[tense]}</h5>
                                    <p class="vocab-verb-tense-usage">{insight.tenseUsage[tense]}</p>

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
                                  </section>
                                </section>
                              ))}
                            </div>

                            {tenseSlideCount > 1 ? (
                              <footer class="vocab-verb-forms-pagination" aria-live="polite">
                                <div class="vocab-verb-forms-controls">
                                  <button
                                    type="button"
                                    class="vocab-verb-forms-nav"
                                    aria-label="Previous tense"
                                    disabled={activeVerbFormSlideIndex.value <= 0}
                                    onClick$={() => {
                                      shiftVerbFormsSlide$(-1);
                                    }}
                                  >
                                    ←
                                  </button>
                                  <span class="vocab-verb-forms-page">
                                    {Math.min(tenseSlideCount, activeVerbFormSlideIndex.value + 1)} / {tenseSlideCount}
                                  </span>
                                  <button
                                    type="button"
                                    class="vocab-verb-forms-nav"
                                    aria-label="Next tense"
                                    disabled={activeVerbFormSlideIndex.value >= tenseSlideCount - 1}
                                    onClick$={() => {
                                      shiftVerbFormsSlide$(1);
                                    }}
                                  >
                                    →
                                  </button>
                                </div>
                                <div class="vocab-verb-forms-dots" aria-hidden="true">
                                  {tenseSlides.map(({ tense }, index) => (
                                    <span
                                      key={`${word.id}-tense-dot-${tense}`}
                                      class={index === activeVerbFormSlideIndex.value ? "vocab-verb-forms-dot active" : "vocab-verb-forms-dot"}
                                    />
                                  ))}
                                </div>
                              </footer>
                            ) : null}
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
