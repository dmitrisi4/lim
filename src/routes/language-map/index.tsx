import { $, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  COMPLETED_CARD_PROGRESS_STORAGE_KEY,
  countCompletedCards,
  readCompletedCardProgress,
  type CompletedCardProgress
} from "~/entities/card/model/completed-progress";
import type {
  LanguageMapChatMessage,
  LanguageMapChatMode,
  LanguageMapChatNodeContext,
  LanguageMapChatResponse
} from "~/features/language-map/model/chat";
import {
  LANGUAGE_MAP_EDGES,
  LANGUAGE_MAP_NODE_BY_ID,
  LANGUAGE_MAP_NODES,
  LANGUAGE_MAP_VIEWBOX,
  type LanguageMapEdge,
  type LanguageMapNode,
  type LanguageMapNodeCategory
} from "~/features/language-map/model/graph";
import { getNodeRelatedCardIds } from "~/features/language-map/model/node-related-cards";
import {
  LANGUAGE_MAP_PROGRESS_STORAGE_KEY,
  getLanguageMapNodeStatus,
  readLanguageMapProgress,
  setLanguageMapNodeStatus,
  type LanguageMapNodeStatus,
  type LanguageMapProgress
} from "~/features/language-map/model/progress";
import { httpPost } from "~/shared/api/client";
import { endpoints } from "~/shared/api/endpoints";
import { useI18n } from "~/shared/i18n/context";
import type { LearningLanguage, UiCopy } from "~/shared/i18n/ui";
import styles from "~/routes/language-map/index.css?inline";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

interface RelatedCardsLink {
  id: string;
  href: string;
  label: string;
  primary?: boolean;
}

function buildNodeOverviewPrompt(node: LanguageMapNode, language: "en" | "es"): string {
  return language === "es"
    ? `Explora la seccion \"${node.label}\" del mapa y explicamela con pasos claros.`
    : `Walk me through the \"${node.label}\" node from the language map with clear steps.`;
}

function buildSelectNodeMessage(language: "en" | "es"): string {
  return language === "es"
    ? "Primero abre una seccion del grafo y pulsa Discuss in chat."
    : "Open a graph node first, then press Discuss in chat.";
}

function buildProviderErrorMessage(language: "en" | "es"): string {
  return language === "es"
    ? "No pude obtener respuesta del AI provider. Revisa la configuracion y vuelve a intentar."
    : "Could not get a response from the AI provider. Check configuration and try again.";
}

function toChatNodeContext(node: LanguageMapNode): LanguageMapChatNodeContext {
  return {
    id: node.id,
    label: node.label,
    category: node.category,
    summary: node.summary,
    details: node.details,
    formula: node.formula,
    keyVerbs: node.keyVerbs,
    irregularSamples: node.irregularSamples
  };
}

function getNodeLines(label: string): string[] {
  return label.split("\n");
}

function collectConnectedNodes(nodeId: string): LanguageMapNode[] {
  const relatedIds = new Set<string>();

  for (const edge of LANGUAGE_MAP_EDGES) {
    if (edge.from === nodeId) {
      relatedIds.add(edge.to);
    }

    if (edge.to === nodeId) {
      relatedIds.add(edge.from);
    }
  }

  return [...relatedIds].map((relatedId) => LANGUAGE_MAP_NODE_BY_ID[relatedId]).filter((node): node is LanguageMapNode => node !== undefined);
}

function getNodeById(nodeId: string | undefined): LanguageMapNode | null {
  if (!nodeId) {
    return null;
  }

  return LANGUAGE_MAP_NODE_BY_ID[nodeId] ?? null;
}

function getEdgeSign(edgeId: string): number {
  let sum = 0;
  for (const char of edgeId) {
    sum += char.charCodeAt(0);
  }

  return sum % 2 === 0 ? 1 : -1;
}

function getCurvedEdgeGeometry(edge: LanguageMapEdge, fromNode: LanguageMapNode, toNode: LanguageMapNode) {
  const x1 = fromNode.position.x;
  const y1 = fromNode.position.y;
  const x2 = toNode.position.x;
  const y2 = toNode.position.y;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.max(Math.hypot(dx, dy), 1);
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const sign = getEdgeSign(edge.id);
  const baseCurvature = Math.max(20, Math.min(88, distance * 0.15));
  const curvatureMultiplier = edge.kind === "cross" ? 1.4 : 0.9;
  const curvature = baseCurvature * curvatureMultiplier * sign;
  const controlX = (x1 + x2) / 2 + normalX * curvature;
  const controlY = (y1 + y2) / 2 + normalY * curvature;
  const path = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

  const t = 0.5;
  const oneMinusT = 1 - t;
  const pointX = oneMinusT * oneMinusT * x1 + 2 * oneMinusT * t * controlX + t * t * x2;
  const pointY = oneMinusT * oneMinusT * y1 + 2 * oneMinusT * t * controlY + t * t * y2;
  const labelOffset = distance < 170 ? 42 : 26;
  const labelX = pointX + normalX * labelOffset * sign;
  const labelY = pointY + normalY * labelOffset * sign;

  return {
    path,
    labelX,
    labelY
  };
}

function buildFeedCardsHref(language: LearningLanguage, category: "grammar" | "vocabulary"): string {
  const params = new URLSearchParams();
  params.set("cursor", "0");
  params.append("level", "a1");
  params.append("category", category);
  params.set("lang", language);
  return `/feed?${params.toString()}`;
}

function buildVocabularyCardsHref(language: LearningLanguage, sections: string[] = [], progress?: "all" | "unlearned"): string {
  const params = new URLSearchParams();
  params.append("type", "verb");
  sections.forEach((section) => params.append("section", section));
  if (progress === "unlearned") {
    params.set("progress", "unlearned");
  }
  params.set("lang", language);
  return `/vocabulary/?${params.toString()}`;
}

function buildNodeRelatedCardLinks(node: LanguageMapNode, language: LearningLanguage, ui: UiCopy): RelatedCardsLink[] {
  const grammarHref = buildFeedCardsHref(language, "grammar");
  const vocabularyFeedHref = buildFeedCardsHref(language, "vocabulary");
  const verbDeckHref = buildVocabularyCardsHref(language);

  if (node.id === "irregular-verbs") {
    const irregularSections =
      language === "es" ? ["additional_verbs", "base_verbs"] : ["action_verbs", "movement_verbs", "communication_verbs"];
    return [
      {
        id: "cards-irregular",
        href: buildVocabularyCardsHref(language, irregularSections, "unlearned"),
        label: ui.mapRelatedCardsOpenIrregular,
        primary: true
      },
      {
        id: "cards-vocabulary-feed",
        href: vocabularyFeedHref,
        label: ui.mapRelatedCardsOpenVocabulary
      }
    ];
  }

  if (node.id === "auxiliary-verbs") {
    const auxiliarySections = language === "es" ? ["modals_constructions"] : ["modal_auxiliary_verbs"];
    return [
      {
        id: "cards-auxiliary",
        href: buildVocabularyCardsHref(language, auxiliarySections, "unlearned"),
        label: ui.mapRelatedCardsOpenAuxiliary,
        primary: true
      },
      {
        id: "cards-grammar-feed",
        href: grammarHref,
        label: ui.mapRelatedCardsOpenGrammar
      }
    ];
  }

  if (node.id === "core-verbs") {
    const coreSections =
      language === "es"
        ? ["base_verbs", "communication_thoughts"]
        : ["action_verbs", "state_verbs", "communication_verbs", "thinking_decision_verbs"];
    return [
      {
        id: "cards-core-verbs",
        href: buildVocabularyCardsHref(language, coreSections),
        label: ui.mapRelatedCardsOpenVerbDeck,
        primary: true
      },
      {
        id: "cards-vocabulary-feed",
        href: vocabularyFeedHref,
        label: ui.mapRelatedCardsOpenVocabulary
      }
    ];
  }

  if (node.category === "tense" || node.category === "timeline" || node.id === "language-core") {
    return [
      {
        id: "cards-grammar-feed",
        href: grammarHref,
        label: ui.mapRelatedCardsOpenGrammar,
        primary: true
      },
      {
        id: "cards-verb-deck",
        href: verbDeckHref,
        label: ui.mapRelatedCardsOpenVerbDeck
      }
    ];
  }

  return [
    {
      id: "cards-vocabulary-feed",
      href: vocabularyFeedHref,
      label: ui.mapRelatedCardsOpenVocabulary,
      primary: true
    },
    {
      id: "cards-grammar-feed",
      href: grammarHref,
      label: ui.mapRelatedCardsOpenGrammar
    }
  ];
}

export default component$(() => {
  useStylesScoped$(styles);
  const { ui, language } = useI18n();

  const selectedNodeId = useSignal(LANGUAGE_MAP_NODES[0]?.id ?? "");
  const nodeProgress = useSignal<LanguageMapProgress>({});
  const completedCardProgress = useSignal<CompletedCardProgress>({});
  const showUnlearnedOnly = useSignal(false);

  const chatMessages = useSignal<ChatMessage[]>([]);
  const chatInput = useSignal("");
  const chatPending = useSignal(false);
  const chatNodeId = useSignal<string>();
  const chatMessageCounter = useSignal(0);
  const chatThreadRef = useSignal<HTMLElement>();

  useVisibleTask$(({ cleanup }) => {
    const syncFromStorage = () => {
      nodeProgress.value = readLanguageMapProgress();
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === LANGUAGE_MAP_PROGRESS_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    cleanup(() => {
      window.removeEventListener("storage", onStorage);
    });
  });

  useVisibleTask$(({ cleanup }) => {
    const syncFromStorage = () => {
      completedCardProgress.value = readCompletedCardProgress();
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === COMPLETED_CARD_PROGRESS_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    cleanup(() => {
      window.removeEventListener("storage", onStorage);
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => showUnlearnedOnly.value);
    track(() => JSON.stringify(nodeProgress.value));
    track(() => selectedNodeId.value);

    const visibleNodes = showUnlearnedOnly.value
      ? LANGUAGE_MAP_NODES.filter((node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) !== "learned")
      : LANGUAGE_MAP_NODES;

    if (visibleNodes.length === 0) {
      return;
    }

    if (!visibleNodes.some((node) => node.id === selectedNodeId.value)) {
      selectedNodeId.value = visibleNodes[0].id;
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => chatMessages.value.length);
    track(() => chatPending.value);

    const thread = chatThreadRef.value;
    if (!thread) {
      return;
    }

    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  });

  const categoryLabelMap: Record<LanguageMapNodeCategory, string> = {
    core: ui.mapCategoryCore,
    timeline: ui.mapCategoryTimeline,
    tense: ui.mapCategoryTense,
    verb_system: ui.mapCategoryVerbSystem,
    irregular: ui.mapCategoryIrregular
  };

  const statusLabelMap: Record<LanguageMapNodeStatus, string> = {
    new: ui.mapStatusNew,
    learning: ui.mapStatusLearning,
    learned: ui.mapStatusLearned
  };

  const visibleNodes = showUnlearnedOnly.value
    ? LANGUAGE_MAP_NODES.filter((node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) !== "learned")
    : LANGUAGE_MAP_NODES;

  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));

  const visibleEdges = LANGUAGE_MAP_EDGES.filter((edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)).filter(
    (edge) => edge.kind !== "cross" || edge.from === selectedNodeId.value || edge.to === selectedNodeId.value
  );

  const selectedNode =
    visibleNodes.find((node) => node.id === selectedNodeId.value) ??
    LANGUAGE_MAP_NODES.find((node) => node.id === selectedNodeId.value) ??
    visibleNodes[0] ??
    LANGUAGE_MAP_NODES[0] ??
    null;

  const selectedStatus = selectedNode ? getLanguageMapNodeStatus(selectedNode.id, nodeProgress.value) : "new";

  const learnedCount = LANGUAGE_MAP_NODES.filter(
    (node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) === "learned"
  ).length;
  const learningCount = LANGUAGE_MAP_NODES.filter(
    (node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) === "learning"
  ).length;
  const newCount = LANGUAGE_MAP_NODES.length - learnedCount - learningCount;

  const chatNode = getNodeById(chatNodeId.value);
  const connectedNodes = selectedNode ? collectConnectedNodes(selectedNode.id) : [];
  const relatedCardLinks = selectedNode ? buildNodeRelatedCardLinks(selectedNode, language, ui) : [];
  const relatedCardIds = selectedNode ? getNodeRelatedCardIds(selectedNode.id, language) : [];
  const relatedCardStats = countCompletedCards(relatedCardIds, completedCardProgress.value);

  return (
    <section class="language-map-page">
      <div class="language-map-stage">
        <header class="language-map-intro">
          <div>
            <h2 class="language-map-title">{ui.mapTitle}</h2>
            <p class="language-map-subtitle">{ui.mapSubtitle}</p>
          </div>

          <div class="language-map-progress-card" aria-live="polite">
            <p class="language-map-progress-title">{ui.mapProgressTitle}</p>
            <p class="language-map-progress-value">
              {learnedCount} / {LANGUAGE_MAP_NODES.length} {ui.mapProgressLearnedSuffix}
            </p>
            <div class="language-map-progress-breakdown">
              <span class="progress-chip status-new">
                {statusLabelMap.new}: {newCount}
              </span>
              <span class="progress-chip status-learning">
                {statusLabelMap.learning}: {learningCount}
              </span>
              <span class="progress-chip status-learned">
                {statusLabelMap.learned}: {learnedCount}
              </span>
            </div>
          </div>
        </header>

        <div class="language-map-toolbar">
          <label class="language-map-filter-toggle">
            <input
              type="checkbox"
              checked={showUnlearnedOnly.value}
              onChange$={(event) => {
                showUnlearnedOnly.value = (event.target as HTMLInputElement).checked;
              }}
            />
            <span>{ui.mapFilterUnlearnedOnly}</span>
          </label>

          <div class="language-map-legend" aria-label={ui.mapLegendTitle}>
            <span class="legend-chip category-core">{ui.mapCategoryCore}</span>
            <span class="legend-chip category-timeline">{ui.mapCategoryTimeline}</span>
            <span class="legend-chip category-tense">{ui.mapCategoryTense}</span>
            <span class="legend-chip category-verbs">{ui.mapCategoryVerbSystem}</span>
            <span class="legend-chip category-irregular">{ui.mapCategoryIrregular}</span>
          </div>
        </div>

        {visibleNodes.length > 0 ? (
          <div class="language-map-graph-shell">
            <svg
              class="language-map-graph"
              viewBox={`0 0 ${LANGUAGE_MAP_VIEWBOX.width} ${LANGUAGE_MAP_VIEWBOX.height}`}
              role="img"
              aria-label={ui.mapGraphAriaLabel}
            >
              <defs>
                <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="rgba(49, 196, 255, 0.85)" />
                  <stop offset="100%" stop-color="rgba(255, 47, 109, 0.78)" />
                </linearGradient>
              </defs>

              {visibleEdges.map((edge) => {
                const fromNode = LANGUAGE_MAP_NODE_BY_ID[edge.from];
                const toNode = LANGUAGE_MAP_NODE_BY_ID[edge.to];
                if (!fromNode || !toNode) {
                  return null;
                }

                const isSelectedEdge = selectedNodeId.value === edge.from || selectedNodeId.value === edge.to;
                const geometry = getCurvedEdgeGeometry(edge, fromNode, toNode);
                const edgeLabel = edge.label ?? "";
                const labelWidth = Math.max(66, edgeLabel.length * 8 + 22);
                const labelHeight = 24;
                const edgeClass = `language-map-edge${isSelectedEdge ? " selected" : ""}${edge.kind === "cross" ? " cross" : ""}`;

                return (
                  <g key={edge.id} class={edgeClass}>
                    <path d={geometry.path} class="language-map-edge-path" />
                    {edge.label && isSelectedEdge ? (
                      <g class="language-map-edge-label-group">
                        <rect
                          x={geometry.labelX - labelWidth / 2}
                          y={geometry.labelY - labelHeight / 2}
                          width={labelWidth}
                          height={labelHeight}
                          rx={12}
                          ry={12}
                          class="language-map-edge-label-bg"
                        />
                        <text x={geometry.labelX} y={geometry.labelY + 4} class="language-map-edge-label">
                          {edge.label}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })}

              {visibleNodes.map((node) => {
                const nodeStatus = getLanguageMapNodeStatus(node.id, nodeProgress.value);
                const selected = selectedNodeId.value === node.id;
                const nodeClass = `language-map-node category-${node.category} status-${nodeStatus}${selected ? " selected" : ""}`;
                const lines = getNodeLines(node.graphLabel);
                const maxLineLength = Math.max(...lines.map((line) => line.length));
                const baseRadius = Math.max(42, Math.min(58, 30 + maxLineLength * 2 + lines.length * 5));
                const nodeRadius = selected ? baseRadius + 6 : baseRadius;

                return (
                  <g
                    key={node.id}
                    class={nodeClass}
                    style={{ transformOrigin: `${node.position.x}px ${node.position.y}px` }}
                    onClick$={() => {
                      selectedNodeId.value = node.id;
                    }}
                  >
                    <circle cx={node.position.x} cy={node.position.y} r={nodeRadius} />
                    <text class="language-map-node-label" x={node.position.x} y={node.position.y - (lines.length - 1) * 10}>
                      {lines.map((line, index) => (
                        <tspan key={`${node.id}-line-${index}`} x={node.position.x} dy={index === 0 ? 0 : 20}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div class="language-map-empty">
            <p>{ui.mapNoVisibleNodes}</p>
            <button
              type="button"
              class="language-map-reset-filter"
              onClick$={() => {
                showUnlearnedOnly.value = false;
              }}
            >
              {ui.mapShowAllNodes}
            </button>
          </div>
        )}
      </div>

      <aside class="language-map-sidebar">
        {selectedNode ? (
          <article class="node-card">
            <header class="node-card-head">
              <p class="node-card-category">{categoryLabelMap[selectedNode.category]}</p>
              <h3 class="node-card-title">{selectedNode.label}</h3>
              <p class="node-card-summary">{selectedNode.summary}</p>
            </header>

            <p class="node-card-details">{selectedNode.details}</p>

            {selectedNode.formula ? (
              <div class="node-card-block">
                <p class="node-card-block-title">{ui.mapFormulaTitle}</p>
                <p class="node-card-formula">{selectedNode.formula}</p>
              </div>
            ) : null}

            <div class="node-card-block">
              <p class="node-card-block-title">{ui.mapKeyVerbsTitle}</p>
              <div class="node-card-chip-row">
                {selectedNode.keyVerbs.map((verb) => (
                  <span key={`${selectedNode.id}-${verb}`} class="node-chip">
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            {selectedNode.irregularSamples && selectedNode.irregularSamples.length > 0 ? (
              <div class="node-card-block">
                <p class="node-card-block-title">{ui.mapIrregularTableTitle}</p>
                <div class="node-card-irregular-table" role="table" aria-label={ui.mapIrregularTableTitle}>
                  <div class="irregular-row head" role="row">
                    <span role="columnheader">V1</span>
                    <span role="columnheader">V2</span>
                    <span role="columnheader">V3</span>
                  </div>
                  {selectedNode.irregularSamples.map((sample) => (
                    <div key={`${selectedNode.id}-${sample.base}`} class="irregular-row" role="row">
                      <span role="cell">{sample.base}</span>
                      <span role="cell">{sample.past}</span>
                      <span role="cell">{sample.participle}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {connectedNodes.length > 0 ? (
              <div class="node-card-block">
                <p class="node-card-block-title">{ui.mapRelatedNodesTitle}</p>
                <div class="node-card-related-grid">
                  {connectedNodes.map((node) => (
                    <button
                      key={`rel-${node.id}`}
                      type="button"
                      class="related-node-button"
                      onClick$={() => {
                        selectedNodeId.value = node.id;
                      }}
                    >
                      {node.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {relatedCardLinks.length > 0 ? (
              <div class="node-card-block">
                <p class="node-card-block-title">{ui.mapRelatedCardsTitle}</p>
                <div class="node-card-related-grid">
                  {relatedCardLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      class={link.primary ? "related-card-link related-card-link-primary" : "related-card-link"}
                    >
                      <span>{link.label}</span>
                      <span class="related-card-link-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div class="node-card-block">
              <p class="node-card-block-title">{ui.mapNodeCardsProgressTitle}</p>
              {relatedCardStats.total > 0 ? (
                <p class="node-card-related-progress">
                  <span class="node-card-related-progress-value">
                    {relatedCardStats.completed} / {relatedCardStats.total}
                  </span>{" "}
                  <span>{ui.mapNodeCardsProgressSuffix}</span>
                </p>
              ) : (
                <p class="node-card-related-progress-empty">{ui.mapNodeCardsProgressEmpty}</p>
              )}
            </div>

            <div class="node-status-block">
              <p class="node-card-block-title">{ui.mapStatusTitle}</p>
              <div class="node-status-grid">
                {(["new", "learning", "learned"] as const).map((status) => (
                  <button
                    key={`status-${status}`}
                    type="button"
                    class={selectedStatus === status ? `status-button status-${status} active` : `status-button status-${status}`}
                    onClick$={() => {
                      nodeProgress.value = setLanguageMapNodeStatus(selectedNode.id, status);
                    }}
                  >
                    {statusLabelMap[status]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              class="node-discuss-button"
              disabled={chatPending.value}
              onClick$={$(async () => {
                if (chatPending.value) {
                  return;
                }

                const currentNode = getNodeById(selectedNodeId.value);
                if (!currentNode) {
                  return;
                }

                chatNodeId.value = currentNode.id;
                const userText = buildNodeOverviewPrompt(currentNode, language);

                const userId = chatMessageCounter.value + 1;
                const userMessage: ChatMessage = {
                  id: `map-chat-${userId}`,
                  role: "user",
                  text: userText
                };

                chatMessages.value = [...chatMessages.value, userMessage];
                chatMessageCounter.value = userId;
                chatPending.value = true;

                const historyPayload: LanguageMapChatMessage[] = [...chatMessages.value].slice(-10).map((message) => ({
                  role: message.role,
                  text: message.text
                }));

                try {
                  const response = await httpPost<LanguageMapChatResponse>(endpoints.languageMapChat, {
                    language,
                    mode: "node_overview" satisfies LanguageMapChatMode,
                    message: userText,
                    node: toChatNodeContext(currentNode),
                    history: historyPayload
                  });

                  const assistantId = chatMessageCounter.value + 1;
                  chatMessages.value = [
                    ...chatMessages.value,
                    {
                      id: `map-chat-${assistantId}`,
                      role: "assistant",
                      text: response.ok && response.answer ? response.answer : buildProviderErrorMessage(language)
                    }
                  ];
                  chatMessageCounter.value = assistantId;
                } catch (_error) {
                  const assistantId = chatMessageCounter.value + 1;
                  chatMessages.value = [
                    ...chatMessages.value,
                    {
                      id: `map-chat-${assistantId}`,
                      role: "assistant",
                      text: buildProviderErrorMessage(language)
                    }
                  ];
                  chatMessageCounter.value = assistantId;
                } finally {
                  chatPending.value = false;
                }
              })}
            >
              {chatPending.value ? ui.mapChatThinking : ui.mapDiscussButton}
            </button>
          </article>
        ) : null}

        <section class="node-chat" aria-label={ui.mapChatTitle}>
          <header class="node-chat-head">
            <h3 class="node-chat-title">{ui.mapChatTitle}</h3>
            <p class="node-chat-subtitle">{ui.mapChatSubtitle}</p>
            <p class="node-chat-context">{chatNode ? `${ui.mapChatContext}: ${chatNode.label}` : ui.mapChatNoContext}</p>
          </header>

          <div ref={chatThreadRef} class="node-chat-thread" aria-live="polite">
            {chatMessages.value.length === 0 ? (
              <p class="node-chat-empty">{ui.mapChatEmptyState}</p>
            ) : (
              chatMessages.value.map((message) => (
                <article
                  key={message.id}
                  class={message.role === "assistant" ? "node-chat-message assistant" : "node-chat-message user"}
                >
                  <p class="node-chat-role">{message.role === "assistant" ? ui.mapChatAssistant : ui.mapChatYou}</p>
                  <p class="node-chat-text">{message.text}</p>
                </article>
              ))
            )}

            {chatPending.value ? (
              <article class="node-chat-message assistant thinking" role="status" aria-live="polite">
                <p class="node-chat-role">{ui.mapChatAssistant}</p>
                <p class="node-chat-text">{ui.mapChatThinking}</p>
              </article>
            ) : null}
          </div>

          <form
            class="node-chat-form"
            preventdefault:submit
            onSubmit$={$(async () => {
              const question = chatInput.value.trim();
              if (question.length === 0 || chatPending.value) {
                return;
              }

              const userId = chatMessageCounter.value + 1;
              const userMessage: ChatMessage = {
                id: `map-chat-${userId}`,
                role: "user",
                text: question
              };

              chatMessages.value = [...chatMessages.value, userMessage];
              chatMessageCounter.value = userId;
              chatInput.value = "";

              const currentNode = getNodeById(chatNodeId.value);
              if (!currentNode) {
                const assistantId = chatMessageCounter.value + 1;
                chatMessages.value = [
                  ...chatMessages.value,
                  {
                    id: `map-chat-${assistantId}`,
                    role: "assistant",
                    text: buildSelectNodeMessage(language)
                  }
                ];
                chatMessageCounter.value = assistantId;
                return;
              }

              chatPending.value = true;
              const historyPayload: LanguageMapChatMessage[] = [...chatMessages.value].slice(-10).map((message) => ({
                role: message.role,
                text: message.text
              }));

              try {
                const response = await httpPost<LanguageMapChatResponse>(endpoints.languageMapChat, {
                  language,
                  mode: "follow_up" satisfies LanguageMapChatMode,
                  message: question,
                  node: toChatNodeContext(currentNode),
                  history: historyPayload
                });

                const assistantId = chatMessageCounter.value + 1;
                chatMessages.value = [
                  ...chatMessages.value,
                  {
                    id: `map-chat-${assistantId}`,
                    role: "assistant",
                    text: response.ok && response.answer ? response.answer : buildProviderErrorMessage(language)
                  }
                ];
                chatMessageCounter.value = assistantId;
              } catch (_error) {
                const assistantId = chatMessageCounter.value + 1;
                chatMessages.value = [
                  ...chatMessages.value,
                  {
                    id: `map-chat-${assistantId}`,
                    role: "assistant",
                    text: buildProviderErrorMessage(language)
                  }
                ];
                chatMessageCounter.value = assistantId;
              } finally {
                chatPending.value = false;
              }
            })}
          >
            <input
              type="text"
              class="node-chat-input"
              value={chatInput.value}
              placeholder={ui.mapChatInputPlaceholder}
              onInput$={(event) => {
                chatInput.value = (event.target as HTMLInputElement).value;
              }}
              disabled={chatPending.value}
            />
            <button type="submit" class="node-chat-send" disabled={chatInput.value.trim().length === 0 || chatPending.value}>
              {ui.mapChatSend}
            </button>
          </form>
        </section>
      </aside>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Language Map"
};
