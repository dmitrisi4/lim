import { $, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { VocabularyChatMessage, VocabularyChatMode, VocabularyChatResponse } from "~/features/vocabulary/model/chat";
import {
  VOCABULARY_PROGRESS_OPTIONS,
  VOCABULARY_TYPE_OPTIONS,
  buildVocabularyHref,
  filterVocabularyWords,
  getVocabularySectionOptions,
  resolveWordSections,
  parseVocabularyFiltersFromSearchParams,
  type VocabularyProgressFilter,
  type VocabularySection,
  type VocabularyWord,
  type VocabularyWordType
} from "~/features/vocabulary/model/word-bank";
import type { VerbTense } from "~/features/vocabulary/model/verb-insights";
import { VocabularyDeck } from "~/features/vocabulary/ui/VocabularyDeck";
import { httpPost } from "~/shared/api/client";
import { endpoints } from "~/shared/api/endpoints";
import { useI18n } from "~/shared/i18n/context";
import { LEARNING_LANGUAGE_COOKIE, detectLearningLanguage } from "~/shared/i18n/ui";
import styles from "~/routes/vocabulary/index.css?inline";

export const useVocabularyLoader = routeLoader$(({ url, cookie }) => {
  const filters = parseVocabularyFiltersFromSearchParams(url.searchParams);
  const language = detectLearningLanguage(url, cookie.get(LEARNING_LANGUAGE_COOKIE)?.value);
  const words = filterVocabularyWords(filters, language);

  return {
    filters,
    words,
    language
  };
});

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

function buildExplainPrompt(word: VocabularyWord, language: "en" | "es"): string {
  return language === "es"
    ? `Explica la palabra "${word.term}" y como usarla mientras estudio tarjetas.`
    : `Explain the word "${word.term}" and how to use it while I study flashcards.`;
}

function buildSelectCardMessage(language: "en" | "es"): string {
  return language === "es" ? "Primero abre una tarjeta y pulsa Explicar." : "Open a card and press Explain first.";
}

function buildProviderErrorMessage(language: "en" | "es"): string {
  return language === "es"
    ? "No pude obtener respuesta de Gemini. Revisa clave/API y vuelve a intentar."
    : "Could not get a Gemini response. Check key/API settings and try again.";
}

export default component$(() => {
  useStylesScoped$(styles);
  const { ui } = useI18n();
  const vocabulary = useVocabularyLoader();
  const chatMessages = useSignal<ChatMessage[]>([]);
  const activeWord = useSignal<VocabularyWord>();
  const chatInput = useSignal("");
  const messageCounter = useSignal(0);
  const chatPending = useSignal(false);
  const chatCollapsed = useSignal(false);
  const chatThreadRef = useSignal<HTMLElement>();

  const typeLabelMap: Record<VocabularyWordType, string> = {
    verb: ui.vocabTypeVerb,
    other: ui.vocabTypeOther
  };

  const sectionLabelMap: Record<VocabularySection, string> = {
    base_verbs: ui.vocabSectionBaseVerbs,
    daily_actions: ui.vocabSectionDailyActions,
    movement_life: ui.vocabSectionMovementLife,
    communication_thoughts: ui.vocabSectionCommunicationThoughts,
    modals_constructions: ui.vocabSectionModalsConstructions,
    additional_verbs: ui.vocabSectionAdditionalVerbs,
    state_verbs: ui.vocabSectionStateVerbs,
    action_verbs: ui.vocabSectionActionVerbs,
    movement_verbs: ui.vocabSectionMovementVerbs,
    communication_verbs: ui.vocabSectionCommunicationVerbs,
    thinking_decision_verbs: ui.vocabSectionThinkingDecisionVerbs,
    modal_auxiliary_verbs: ui.vocabSectionModalAuxiliaryVerbs,
    other_words: ui.vocabSectionOtherWords
  };
  const sectionOptions = getVocabularySectionOptions(vocabulary.value.language);

  const progressLabelMap: Record<VocabularyProgressFilter, string> = {
    all: ui.vocabProgressAll,
    learned: ui.vocabProgressLearned,
    unlearned: ui.vocabProgressUnlearned
  };

  const verbTenseLabelMap: Record<VerbTense, string> = {
    present_simple: ui.vocabVerbTensePresentSimple,
    past_simple: ui.vocabVerbTensePastSimple,
    future_simple: ui.vocabVerbTenseFutureSimple,
    present_continuous: ui.vocabVerbTensePresentContinuous,
    past_continuous: ui.vocabVerbTensePastContinuous,
    present_perfect: ui.vocabVerbTensePresentPerfect,
    past_perfect: ui.vocabVerbTensePastPerfect
  };

  const resetHref = buildVocabularyHref({ types: [], sections: [], progress: "all" }, vocabulary.value.language);
  const pageClass = chatCollapsed.value ? "vocabulary-page vocabulary-page-ai-collapsed" : "vocabulary-page";
  const aiPanelClass = chatCollapsed.value ? "vocabulary-ai collapsed" : "vocabulary-ai";

  useVisibleTask$(({ track }) => {
    track(() => chatMessages.value.length);
    track(() => chatPending.value);

    const thread = chatThreadRef.value;
    if (!thread) {
      return;
    }

    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  });

  return (
    <section class={pageClass}>
      <aside class="vocabulary-sidebar">
        <div class="vocabulary-intro">
          <h2 class="vocabulary-title">{ui.vocabTitle}</h2>
          <p class="vocabulary-subtitle">{ui.vocabSubtitle}</p>
          <p class="vocabulary-count">
            {ui.vocabTotalLabel}: {vocabulary.value.words.length}
          </p>
        </div>

        <details class="vocabulary-filters-shell" open>
          <summary class="vocabulary-filters-summary">
            <span class="vocabulary-filters-summary-title">{ui.vocabFiltersPanel}</span>
            <span class="vocabulary-filters-summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </summary>

          <form method="get" class="vocabulary-filters">
            <input type="hidden" name="lang" value={vocabulary.value.language} />

            <div class="filter-group">
              <p class="filter-title">{ui.vocabTypes}</p>
              <div class="filter-grid">
                {VOCABULARY_TYPE_OPTIONS.map((type) => (
                  <label key={`type-${type}`} class="filter-chip">
                    <input type="checkbox" name="type" value={type} checked={vocabulary.value.filters.types.includes(type)} />
                    <span>{typeLabelMap[type]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-title">{ui.vocabSections}</p>
              <div class="filter-grid filter-grid-sections">
                {sectionOptions.map((section) => (
                  <label key={`section-${section}`} class="filter-chip">
                    <input
                      type="checkbox"
                      name="section"
                      value={section}
                      checked={vocabulary.value.filters.sections.includes(section)}
                    />
                    <span>{sectionLabelMap[section]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-title">{ui.vocabProgressTitle}</p>
              <div class="filter-grid">
                {VOCABULARY_PROGRESS_OPTIONS.map((progressOption) => (
                  <label key={`progress-${progressOption}`} class="filter-chip">
                    <input
                      type="radio"
                      name="progress"
                      value={progressOption}
                      checked={vocabulary.value.filters.progress === progressOption}
                    />
                    <span>{progressLabelMap[progressOption]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div class="filter-actions">
              <button type="submit" class="filter-apply">
                {ui.vocabApplyFilters}
              </button>
              <Link href={resetHref} class="filter-reset">
                {ui.vocabResetFilters}
              </Link>
            </div>
          </form>
        </details>
      </aside>

      <div class="vocabulary-stage">
        <VocabularyDeck
          language={vocabulary.value.language}
          words={vocabulary.value.words}
          emptyLabel={ui.vocabNoCards}
          photoPlaceholderLabel={ui.vocabPhotoPlaceholder}
          photoHintLabel={ui.vocabPhotoHint}
          exampleLabel={ui.vocabExampleLabel}
          progressFilter={vocabulary.value.filters.progress}
          markLearnedLabel={ui.vocabMarkLearned}
          learnedLabel={ui.vocabLearned}
          verbFormsButtonLabel={ui.vocabVerbFormsButton}
          verbExamplesButtonLabel={ui.vocabVerbExamplesButton}
          verbFormsTitleLabel={ui.vocabVerbFormsTitle}
          verbTenseLabelMap={verbTenseLabelMap}
          verbExamplesTitleLabel={ui.vocabVerbExamplesTitle}
          verbCloseLabel={ui.vocabVerbClose}
          verbPersonLabel={ui.vocabVerbPerson}
          verbFormLabel={ui.vocabVerbForm}
          verbUsageLabel={ui.vocabVerbUsage}
          typeLabelMap={typeLabelMap}
          sectionLabelMap={sectionLabelMap}
          explainButtonLabel={ui.vocabExplainButton}
          onExplainWord$={$(async (word: VocabularyWord) => {
            if (chatPending.value) {
              return;
            }

            chatCollapsed.value = false;
            activeWord.value = word;
            const userText = buildExplainPrompt(word, vocabulary.value.language);
            const userId = messageCounter.value + 1;
            const userMessage: ChatMessage = { id: `chat-${userId}`, role: "user", text: userText };

            chatMessages.value = [...chatMessages.value, userMessage];
            messageCounter.value = userId;
            chatPending.value = true;

            const historyPayload: VocabularyChatMessage[] = [...chatMessages.value].slice(-10).map((message) => ({
              role: message.role,
              text: message.text
            }));

            try {
              const response = await httpPost<VocabularyChatResponse>(endpoints.vocabularyChat, {
                language: vocabulary.value.language,
                mode: "explain" satisfies VocabularyChatMode,
                message: userText,
                word: {
                  id: word.id,
                  term: word.term,
                  translation: word.translation,
                  type: word.type,
                  sections: resolveWordSections(word),
                  note: word.note,
                  example: word.example
                },
                history: historyPayload
              });

              const assistantId = messageCounter.value + 1;
              chatMessages.value = [
                ...chatMessages.value,
                {
                  id: `chat-${assistantId}`,
                  role: "assistant",
                  text: response.ok && response.answer ? response.answer : buildProviderErrorMessage(vocabulary.value.language)
                }
              ];
              messageCounter.value = assistantId;
            } catch (_error) {
              const assistantId = messageCounter.value + 1;
              chatMessages.value = [
                ...chatMessages.value,
                {
                  id: `chat-${assistantId}`,
                  role: "assistant",
                  text: buildProviderErrorMessage(vocabulary.value.language)
                }
              ];
              messageCounter.value = assistantId;
            } finally {
              chatPending.value = false;
            }
          })}
        />
      </div>

      <aside class={aiPanelClass} aria-label={ui.vocabAiTitle}>
        <button
          type="button"
          class="vocabulary-ai-toggle"
          aria-expanded={!chatCollapsed.value}
          aria-label={chatCollapsed.value ? ui.vocabAiExpand : ui.vocabAiCollapse}
          title={chatCollapsed.value ? ui.vocabAiExpand : ui.vocabAiCollapse}
          onClick$={() => {
            chatCollapsed.value = !chatCollapsed.value;
          }}
        >
          <span class="vocabulary-ai-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M8 6.5v11" />
              <path d="m11 8.5 5 3.5-5 3.5" />
            </svg>
          </span>
        </button>

        <div class="vocabulary-ai-content" aria-hidden={chatCollapsed.value ? "true" : "false"}>
          <header class="vocabulary-ai-head">
            <h3 class="vocabulary-ai-title">{ui.vocabAiTitle}</h3>
            <p class="vocabulary-ai-subtitle">{ui.vocabAiSubtitle}</p>
            <p class="vocabulary-ai-context">
              {activeWord.value ? `${activeWord.value.term} - ${activeWord.value.translation}` : ui.vocabAiEmptyState}
            </p>
          </header>

          <div ref={chatThreadRef} class="vocabulary-ai-thread" aria-live="polite">
            {chatMessages.value.length === 0 ? (
              <p class="vocabulary-ai-empty">{ui.vocabAiEmptyState}</p>
            ) : (
              chatMessages.value.map((message) => (
                <article
                  key={message.id}
                  class={message.role === "assistant" ? "vocabulary-ai-message assistant" : "vocabulary-ai-message user"}
                >
                  <p class="vocabulary-ai-role">{message.role === "assistant" ? ui.vocabAiAssistant : ui.vocabAiYou}</p>
                  <p class="vocabulary-ai-text">{message.text}</p>
                </article>
              ))
            )}

            {chatPending.value ? (
              <article class="vocabulary-ai-message assistant thinking" role="status" aria-live="polite">
                <p class="vocabulary-ai-role">{ui.vocabAiAssistant}</p>
                <div class="vocabulary-ai-thinking">
                  <span class="vocabulary-ai-thinking-label">{ui.vocabAiThinking}</span>
                  <span class="vocabulary-ai-thinking-dots" aria-hidden="true">
                    <span class="vocabulary-ai-thinking-dot" />
                    <span class="vocabulary-ai-thinking-dot" />
                    <span class="vocabulary-ai-thinking-dot" />
                  </span>
                </div>
              </article>
            ) : null}
          </div>

          <form
            class="vocabulary-ai-form"
            preventdefault:submit
            onSubmit$={$(async () => {
              const question = chatInput.value.trim();
              if (question.length === 0 || chatPending.value) {
                return;
              }

              const userId = messageCounter.value + 1;
              const userMessage: ChatMessage = { id: `chat-${userId}`, role: "user", text: question };
              chatMessages.value = [...chatMessages.value, userMessage];
              messageCounter.value = userId;
              chatInput.value = "";

              if (activeWord.value) {
                chatPending.value = true;
                const currentWord = activeWord.value;
                const historyPayload: VocabularyChatMessage[] = [...chatMessages.value].slice(-10).map((message) => ({
                  role: message.role,
                  text: message.text
                }));

                try {
                  const response = await httpPost<VocabularyChatResponse>(endpoints.vocabularyChat, {
                    language: vocabulary.value.language,
                    mode: "follow_up" satisfies VocabularyChatMode,
                    message: question,
                    word: {
                      id: currentWord.id,
                      term: currentWord.term,
                      translation: currentWord.translation,
                      type: currentWord.type,
                      sections: resolveWordSections(currentWord),
                      note: currentWord.note,
                      example: currentWord.example
                    },
                    history: historyPayload
                  });

                  const assistantId = messageCounter.value + 1;
                  chatMessages.value = [
                    ...chatMessages.value,
                    {
                      id: `chat-${assistantId}`,
                      role: "assistant",
                      text: response.ok && response.answer ? response.answer : buildProviderErrorMessage(vocabulary.value.language)
                    }
                  ];
                  messageCounter.value = assistantId;
                } catch (_error) {
                  const assistantId = messageCounter.value + 1;
                  chatMessages.value = [
                    ...chatMessages.value,
                    {
                      id: `chat-${assistantId}`,
                      role: "assistant",
                      text: buildProviderErrorMessage(vocabulary.value.language)
                    }
                  ];
                  messageCounter.value = assistantId;
                } finally {
                  chatPending.value = false;
                }
              } else {
                const assistantId = messageCounter.value + 1;
                chatMessages.value = [
                  ...chatMessages.value,
                  {
                    id: `chat-${assistantId}`,
                    role: "assistant",
                    text: buildSelectCardMessage(vocabulary.value.language)
                  }
                ];
                messageCounter.value = assistantId;
              }
            })}
          >
            <input
              type="text"
              class="vocabulary-ai-input"
              placeholder={ui.vocabAiInputPlaceholder}
              value={chatInput.value}
              onInput$={(event) => {
                chatInput.value = (event.target as HTMLInputElement).value;
              }}
              disabled={chatPending.value || chatCollapsed.value}
            />
            <button
              type="submit"
              class="vocabulary-ai-send"
              disabled={chatInput.value.trim().length === 0 || chatPending.value || chatCollapsed.value}
            >
              {chatPending.value ? "..." : ui.vocabAiSend}
            </button>
          </form>
        </div>
      </aside>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Vocabulary"
};
