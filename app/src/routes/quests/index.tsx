import { $, component$, useSignal, useStylesScoped$, useVisibleTask$, useResource$, Resource } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  COMPLETED_CARD_PROGRESS_STORAGE_KEY,
  readCompletedCardProgress,
  type CompletedCardProgress
} from "~/entities/card/model/completed-progress";
import {
  QUEST_ACHIEVEMENT_STORAGE_KEY,
  claimQuestAchievement,
  readQuestAchievementProgress,
  type QuestAchievementProgress
} from "~/features/gamification/model/quest-achievements";
import {
  buildQuestProgressSnapshot,
  getQuestCopy,
  getQuestRequirementProgress,
  getQuestStatus,
  type QuestRequirementProgress,
  type QuestStatus,
  type QuestDefinition
} from "~/features/gamification/model/quests";
import { fetchQuests } from "~/entities/quest/api/fetch-quests";
import { queryClient } from "~/shared/lib/query/client";
import { useI18n } from "~/shared/i18n/context";
import type { LearningLanguage } from "~/shared/i18n/ui";
import styles from "~/routes/quests/index.css?inline";
import type { SlideCategory } from "~/slides/core/types";

interface QuestPageCopy {
  title: string;
  subtitle: string;
  summaryTotalTests: string;
  summaryReady: string;
  summaryClaimed: string;
  summaryLevelA1: string;
  statusLocked: string;
  statusReady: string;
  statusClaimed: string;
  rewardLabel: string;
  requirementsLabel: string;
  claimButton: string;
  lockedHint: string;
  claimedFresh: string;
  claimedAlready: string;
  requirementTotalLabel: (target: number) => string;
  requirementLevelLabel: (level: string, target: number) => string;
  requirementCategoryLabel: (categoryLabel: string, target: number) => string;
}

const questPageCopyByLanguage: Record<string, QuestPageCopy> = {
  en: {
    title: "Quest Journal",
    subtitle: "Learning recommendations as campaign quests. Complete requirements, then claim your achievement.",
    summaryTotalTests: "Tests completed",
    summaryReady: "Ready to claim",
    summaryClaimed: "Claimed",
    summaryLevelA1: "A1 trials",
    statusLocked: "Locked",
    statusReady: "Ready",
    statusClaimed: "Claimed",
    rewardLabel: "Reward",
    requirementsLabel: "Requirements",
    claimButton: "Claim achievement",
    lockedHint: "Finish all requirements to unlock this quest.",
    claimedFresh: "Achievement claimed. This quest is now complete.",
    claimedAlready: "Achievement already claimed.",
    requirementTotalLabel: (target) => `Complete ${target} tests total`,
    requirementLevelLabel: (level, target) => `Complete ${target} tests on ${level.toUpperCase()}`,
    requirementCategoryLabel: (categoryLabel, target) => `Complete ${target} ${categoryLabel.toLowerCase()} tests`
  },
  es: {
    title: "Diario de misiones",
    subtitle: "Recomendaciones de aprendizaje en formato de misiones. Completa requisitos y reclama tu logro.",
    summaryTotalTests: "Pruebas completadas",
    summaryReady: "Listas para reclamar",
    summaryClaimed: "Reclamadas",
    summaryLevelA1: "Pruebas A1",
    statusLocked: "Bloqueada",
    statusReady: "Lista",
    statusClaimed: "Reclamada",
    rewardLabel: "Recompensa",
    requirementsLabel: "Requisitos",
    claimButton: "Reclamar logro",
    lockedHint: "Completa todos los requisitos para desbloquear esta mision.",
    claimedFresh: "Logro reclamado. Esta mision esta completada.",
    claimedAlready: "Logro ya reclamado.",
    requirementTotalLabel: (target) => `Completa ${target} pruebas en total`,
    requirementLevelLabel: (level, target) => `Completa ${target} pruebas de ${level.toUpperCase()}`,
    requirementCategoryLabel: (categoryLabel, target) => `Completa ${target} pruebas de ${categoryLabel.toLowerCase()}`
  },
  ru: {
    title: "Журнал квестов",
    subtitle: "Рекомендации по обучению в виде квестов. Выполняйте требования и забирайте достижения.",
    summaryTotalTests: "Тестов пройдено",
    summaryReady: "К получению",
    summaryClaimed: "Получено",
    summaryLevelA1: "Уровень A1",
    statusLocked: "Закрыто",
    statusReady: "Готов",
    statusClaimed: "Получено",
    rewardLabel: "Награда",
    requirementsLabel: "Требования",
    claimButton: "Забрать награду",
    lockedHint: "Выполните все требования, чтобы открыть этот квест.",
    claimedFresh: "Достижение получено. Квест завершен.",
    claimedAlready: "Достижение уже получено.",
    requirementTotalLabel: (target) => `Пройти всего тестов: ${target}`,
    requirementLevelLabel: (level, target) => `Пройти ${target} тестов уровня ${level.toUpperCase()}`,
    requirementCategoryLabel: (categoryLabel, target) => `Пройти ${target} тестов по теме "${categoryLabel.toLowerCase()}"`
  }
};

function getQuestPageCopy(uiLanguage: string): QuestPageCopy {
  return questPageCopyByLanguage[uiLanguage] ?? questPageCopyByLanguage.en;
}

function getQuestStatusLabel(status: QuestStatus, copy: QuestPageCopy): string {
  if (status === "ready") {
    return copy.statusReady;
  }

  if (status === "claimed") {
    return copy.statusClaimed;
  }

  return copy.statusLocked;
}

function formatRequirementLabel(
  requirement: QuestRequirementProgress,
  copy: QuestPageCopy,
  categoryLabelMap: Record<SlideCategory, string>
): string {
  if (requirement.kind === "total") {
    return copy.requirementTotalLabel(requirement.target);
  }

  if (requirement.kind === "level" && requirement.level) {
    return copy.requirementLevelLabel(requirement.level, requirement.target);
  }

  if (requirement.kind === "category" && requirement.category) {
    return copy.requirementCategoryLabel(categoryLabelMap[requirement.category], requirement.target);
  }

  return "";
}

export default component$(() => {
  useStylesScoped$(styles);
  const { language, uiLanguage, ui } = useI18n();
  const copy = getQuestPageCopy(uiLanguage);

  const completedCardProgress = useSignal<CompletedCardProgress>({});
  const achievementProgress = useSignal<QuestAchievementProgress>({});
  const lastClaimedQuestId = useSignal("");

  useVisibleTask$(({ cleanup }) => {
    const syncFromStorage = () => {
      completedCardProgress.value = readCompletedCardProgress();
      achievementProgress.value = readQuestAchievementProgress();
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === COMPLETED_CARD_PROGRESS_STORAGE_KEY ||
        event.key === QUEST_ACHIEVEMENT_STORAGE_KEY
      ) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    cleanup(() => {
      window.removeEventListener("storage", onStorage);
    });
  });

  const claimAchievement$ = $((questId: string) => {
    achievementProgress.value = claimQuestAchievement(questId);
    lastClaimedQuestId.value = questId;
  });

  const categoryLabelMap: Record<SlideCategory, string> = {
    grammar: ui.categoryGrammar,
    vocabulary: ui.categoryVocabulary,
    speaking: ui.categorySpeaking,
    listening: ui.categoryListening,
    reading: ui.categoryReading
  };

  const snapshot = buildQuestProgressSnapshot(completedCardProgress.value);

  const questsResource = useResource$(async () => {
    return queryClient.fetchQuery({
      queryKey: ["quests"],
      queryFn: fetchQuests,
    });
  });
  return (
    <section class="quests-page">
      <header class="quests-hero">
        <p class="quests-eyebrow">{ui.questsEyebrow}</p>
        <h2 class="quests-title">{copy.title}</h2>
        <p class="quests-subtitle">{copy.subtitle}</p>
      </header>

      <Resource
        value={questsResource}
        onPending={() => <div class="quests-loading">Loading Quests...</div>}
        onResolved={(questDefinitions) => {
          const quests = questDefinitions.map((quest) => {
            const requirements = getQuestRequirementProgress(quest.requirements, snapshot);
            const completedRequirements = requirements.filter((item) => item.done).length;

            return {
              quest,
              requirements,
              completedRequirements,
              totalRequirements: requirements.length,
              status: getQuestStatus(quest, snapshot, achievementProgress.value)
            };
          });

          const readyCount = quests.filter((quest) => quest.status === "ready").length;
          const claimedCount = quests.filter((quest) => quest.status === "claimed").length;

          return (
            <>
              <div class="quests-summary-grid">
                <div class="summary-card">
                  <p class="summary-label">{copy.summaryTotalTests}</p>
                  <p class="summary-value">{snapshot.totalCompleted}</p>
                </div>
                <div class="summary-card">
                  <p class="summary-label">{copy.summaryReady}</p>
                  <p class="summary-value">{readyCount}</p>
                </div>
                <div class="summary-card">
                  <p class="summary-label">{copy.summaryClaimed}</p>
                  <p class="summary-value">{claimedCount}</p>
                </div>
                <div class="summary-card">
                  <p class="summary-label">{copy.summaryLevelA1}</p>
                  <p class="summary-value">{snapshot.byLevel.a1}</p>
                </div>
              </div>

              <div class="quests-grid">
                {quests.map((entry) => (
                  <article key={entry.quest.id} class={`quest-card status-${entry.status}`}>
                    <div class="quest-card-header">
                      <span class="quest-id">{entry.quest.id}</span>
                      <span class={`quest-status status-${entry.status}`}>{getQuestStatusLabel(entry.status, copy)}</span>
                    </div>

                    <h3 class="quest-name">{getQuestCopy(entry.quest.title, uiLanguage)}</h3>
                    <p class="quest-description">{getQuestCopy(entry.quest.description, uiLanguage)}</p>

                    <div class="quest-reward">
                      <p class="quest-reward-label">{copy.rewardLabel}</p>
                      <p class="quest-reward-value">{getQuestCopy(entry.quest.reward, uiLanguage)}</p>
                    </div>

                    <div class="quest-requirements-block">
                      <div class="quest-requirements-head">
                        <p class="quest-requirements-title">{copy.requirementsLabel}</p>
                        <p class="quest-requirements-count">
                          {entry.completedRequirements}/{entry.totalRequirements}
                        </p>
                      </div>

                      <ul class="quest-requirements">
                        {entry.requirements.map((requirement) => {
                          const progressPercent =
                            requirement.target > 0 ? Math.min(100, Math.round((requirement.current / requirement.target) * 100)) : 0;

                          return (
                            <li
                              key={`${entry.quest.id}-${requirement.id}`}
                              class={requirement.done ? "requirement done" : "requirement"}
                            >
                              <div class="requirement-label-row">
                                <span>{formatRequirementLabel(requirement, copy, categoryLabelMap)}</span>
                                <span>
                                  {requirement.current}/{requirement.target}
                                </span>
                              </div>
                              <div class="requirement-track" aria-hidden="true">
                                <span style={{ width: `${progressPercent}%` }} />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div class="quest-footer">
                      {entry.status === "ready" ? (
                        <button class="claim-button" type="button" onClick$={() => claimAchievement$(entry.quest.id)}>
                          {copy.claimButton}
                        </button>
                      ) : entry.status === "claimed" ? (
                        <p class="quest-note quest-note-claimed">
                          {lastClaimedQuestId.value === entry.quest.id ? copy.claimedFresh : copy.claimedAlready}
                        </p>
                      ) : (
                        <p class="quest-note quest-note-locked">{copy.lockedHint}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          );
        }}
      />
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Quests"
};
