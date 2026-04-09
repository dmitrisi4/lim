import { $, component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { VocabularyChatMessage, VocabularyChatMode, VocabularyChatResponse } from "~/features/vocabulary/model/chat";
import {
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
import { VocabularyFilters } from "~/features/vocabulary/ui/VocabularyFilters";
import { VocabularyChat } from "~/features/vocabulary/ui/VocabularyChat";
import { buildExplainPrompt, buildProviderErrorMessage, buildSelectCardMessage } from "~/features/vocabulary/lib/chat-utils";
import { dataProvider } from "~/shared/providers";
import { endpoints } from "~/shared/api/endpoints";
import { useI18n } from "~/shared/i18n/context";
import { LEARNING_LANGUAGE_COOKIE, detectLearningLanguage } from "~/shared/i18n/ui";
import {
  VOCABULARY_WORD_PROGRESS_STORAGE_KEY,
  readVocabularyWordProgress
} from "~/features/vocabulary/model/word-progress";
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

export default component$(() => {
  useStyles$(styles);
  const { ui } = useI18n();
  const vocabulary = useVocabularyLoader();
  const chatMessages = useSignal<ChatMessage[]>([]);
  const activeWord = useSignal<VocabularyWord>();
  const messageCounter = useSignal(0);
  const chatPending = useSignal(false);
  const chatCollapsed = useSignal(false);
  const wordProgress = useSignal<Record<string, boolean>>({});

  useVisibleTask$(({ cleanup }) => {
    wordProgress.value = readVocabularyWordProgress();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === VOCABULARY_WORD_PROGRESS_STORAGE_KEY) {
        wordProgress.value = readVocabularyWordProgress();
      }
    };
    window.addEventListener("storage", onStorage);
    cleanup(() => window.removeEventListener("storage", onStorage));
  });

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

  const handleSendMessage$ = $(async (question: string) => {
    if (question.length === 0 || chatPending.value) {
      return;
    }

    const userId = messageCounter.value + 1;
    const userMessage: ChatMessage = { id: `chat-${userId}`, role: "user", text: question };
    chatMessages.value = [...chatMessages.value, userMessage];
    messageCounter.value = userId;

    if (activeWord.value) {
      chatPending.value = true;
      const currentWord = activeWord.value;
      const historyPayload: VocabularyChatMessage[] = [...chatMessages.value].slice(-10).map((message) => ({
        role: message.role,
        text: message.text
      }));

      try {
        const response = await dataProvider.post<VocabularyChatResponse>(endpoints.vocabularyChat, {
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
      } catch (error) {
        console.error("[vocab chat]", error);
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
  });

  const isCategorySelectionView = vocabulary.value.filters.sections.length === 0 && vocabulary.value.filters.types.length === 0;

  if (isCategorySelectionView) {
    const sectionIcons: Record<string, string> = {
      base_verbs: "🌱",
      daily_actions: "☕",
      movement_life: "🚶",
      communication_thoughts: "💬",
      modals_constructions: "🏗️",
      additional_verbs: "➕",
      state_verbs: "🧘",
      action_verbs: "🏃",
      movement_verbs: "✈️",
      communication_verbs: "🗣️",
      thinking_decision_verbs: "🧠",
      modal_auxiliary_verbs: "⚙️",
      other_words: "📦"
    };

    return (
      <section class="vocabulary-categories-page">
        <header class="vocabulary-categories-header">
           <h1 class="vocabulary-categories-title">{ui.vocabTitle}</h1>
           <p class="vocabulary-categories-subtitle">{ui.vocabSubtitle}</p>
        </header>

        <div class="vocabulary-categories-grid">
           {sectionOptions.map((section) => {
              const href = buildVocabularyHref({ types: [], sections: [section], progress: "all" }, vocabulary.value.language);
              const icon = sectionIcons[section] || "📁";
              const wordsInSection = vocabulary.value.words.filter(w => resolveWordSections(w).includes(section));
              const total = wordsInSection.length;
              const learnedCount = wordsInSection.filter(w => wordProgress.value[w.id]).length;
              const unlearnedCount = total - learnedCount;

              return (
                 <Link key={section} href={href} class="vocabulary-category-card">
                    <div class="vocabulary-category-card-main">
                      <span class="vocabulary-category-icon">{icon}</span>
                      <h3 class="vocabulary-category-name">{sectionLabelMap[section]}</h3>
                    </div>
                    <div class="vocabulary-category-stats">
                        <div class="vocab-stat-item total" title={ui.vocabTotalLabel || "Total"}>
                           <span class="vocab-stat-val">{total}</span>
                        </div>
                        <div class="vocab-stat-item learned" title={ui.vocabProgressLearned || "Learned"}>
                           <span class="vocab-stat-indicator learned-indicator"></span>
                           <span class="vocab-stat-val">{learnedCount}</span>
                        </div>
                        <div class="vocab-stat-item unlearned" title={ui.vocabProgressUnlearned || "Unlearned"}>
                           <span class="vocab-stat-indicator unlearned-indicator"></span>
                           <span class="vocab-stat-val">{unlearnedCount}</span>
                        </div>
                    </div>
                 </Link>
              );
           })}
        </div>
      </section>
    );
  }

  return (
    <section class={pageClass}>
      <VocabularyFilters
        language={vocabulary.value.language}
        filters={vocabulary.value.filters}
        totalWords={vocabulary.value.words.length}
        sectionOptions={sectionOptions}
        typeLabelMap={typeLabelMap}
        sectionLabelMap={sectionLabelMap}
        progressLabelMap={progressLabelMap}
        resetHref={resetHref}
        ui={{
          vocabTitle: ui.vocabTitle,
          vocabSubtitle: ui.vocabSubtitle,
          vocabTotalLabel: ui.vocabTotalLabel,
          vocabFiltersPanel: ui.vocabFiltersPanel,
          vocabTypes: ui.vocabTypes,
          vocabSections: ui.vocabSections,
          vocabProgressTitle: ui.vocabProgressTitle,
          vocabApplyFilters: ui.vocabApplyFilters,
          vocabResetFilters: ui.vocabResetFilters
        }}
      />

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
              const response = await dataProvider.post<VocabularyChatResponse>(endpoints.vocabularyChat, {
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
            } catch (error) {
              console.error("[vocab explain]", error);
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

      <VocabularyChat
        language={vocabulary.value.language}
        activeWord={activeWord}
        chatMessages={chatMessages}
        chatPending={chatPending}
        chatCollapsed={chatCollapsed.value}
        onToggleCollapse$={() => { chatCollapsed.value = !chatCollapsed.value; }}
        onSendMessage$={handleSendMessage$}
        ui={{
          vocabAiTitle: ui.vocabAiTitle,
          vocabAiSubtitle: ui.vocabAiSubtitle,
          vocabAiEmptyState: ui.vocabAiEmptyState,
          vocabAiAssistant: ui.vocabAiAssistant,
          vocabAiYou: ui.vocabAiYou,
          vocabAiThinking: ui.vocabAiThinking,
          vocabAiInputPlaceholder: ui.vocabAiInputPlaceholder,
          vocabAiSend: ui.vocabAiSend,
          vocabAiExpand: ui.vocabAiExpand,
          vocabAiCollapse: ui.vocabAiCollapse
        }}
      />
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Vocabulary"
};
