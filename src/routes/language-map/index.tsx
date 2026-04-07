import { $, component$, useSignal, useStyles$, useVisibleTask$, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
	COMPLETED_CARD_PROGRESS_STORAGE_KEY,
	countCompletedCards,
	readCompletedCardProgress,
	type CompletedCardProgress,
} from "~/entities/card/model/completed-progress";
import {
	getLanguageMapEdgesForLang,
	getLanguageMapNodeByIdForLang,
	getLanguageMapNodesForLang,
	type LanguageMapNode,
	type LanguageMapNodeCategory,
} from "~/features/language-map/model/graph";
import { getNodeRelatedCardIds } from "~/features/language-map/model/node-related-cards";
import {
	getLanguageMapProgressStorageKey,
	getLanguageMapNodeStatus,
	readLanguageMapProgress,
	setLanguageMapNodeStatus,
	type LanguageMapNodeStatus,
	type LanguageMapProgress,
} from "~/features/language-map/model/progress";
import { buildNodeRelatedCardLinks } from "~/features/language-map/lib/node-links";
import { collectConnectedNodes } from "~/features/language-map/lib/graph-geometry";
import {
	toChatNodeContext,
	buildNodeOverviewPrompt,
	buildProviderErrorMessage,
} from "~/features/language-map/lib/chat-utils";
import { LanguageMapGraph } from "~/features/language-map/ui/LanguageMapGraph";
import { LanguageMapNodeCard } from "~/features/language-map/ui/LanguageMapNodeCard";
import { LanguageMapChat } from "~/features/language-map/ui/LanguageMapChat";
import { httpPost } from "~/shared/api/client";
import { endpoints } from "~/shared/api/endpoints";
import { useI18n } from "~/shared/i18n/context";
import styles from "~/routes/language-map/index.css?inline";
import type {
	LanguageMapChatMessage,
	LanguageMapChatMode,
	LanguageMapChatResponse,
} from "~/features/language-map/model/chat";

export default component$(() => {
	useStyles$(styles);
	const i18n = useI18n();
	const { ui, language } = i18n;

	const allNodes = getLanguageMapNodesForLang(language);
	const selectedNodeId = useSignal(allNodes[0]?.id ?? "");
	const nodeProgress = useSignal<LanguageMapProgress>({});
	const completedCardProgress = useSignal<CompletedCardProgress>({});
	const showUnlearnedOnly = useSignal(false);
	const chatNodeId = useSignal<string>();
	const activeChatNode = useComputed$(() =>
		getLanguageMapNodeByIdForLang(chatNodeId.value ?? "", i18n.language) ?? undefined
	);
	const chatPending = useSignal(false);

	// Reload progress and reset selection whenever the learning language changes
	useVisibleTask$(({ track, cleanup }) => {
		const lang = track(() => i18n.language);
		const storageKey = getLanguageMapProgressStorageKey(lang);

		nodeProgress.value = readLanguageMapProgress(undefined, lang);
		const nodes = getLanguageMapNodesForLang(lang);
		if (!nodes.some((n) => n.id === selectedNodeId.value)) {
			selectedNodeId.value = nodes[0]?.id ?? "";
		}

		const onStorage = (event: StorageEvent) => {
			if (event.key === null || event.key === storageKey) {
				nodeProgress.value = readLanguageMapProgress();
			}
		};
		window.addEventListener("storage", onStorage);
		cleanup(() => window.removeEventListener("storage", onStorage));
	}, { strategy: "document-ready" });

	useVisibleTask$(({ cleanup }) => {
		completedCardProgress.value = readCompletedCardProgress();

		const onStorage = (event: StorageEvent) => {
			if (event.key === null || event.key === COMPLETED_CARD_PROGRESS_STORAGE_KEY) {
				completedCardProgress.value = readCompletedCardProgress();
			}
		};
		window.addEventListener("storage", onStorage);
		cleanup(() => window.removeEventListener("storage", onStorage));
	}, { strategy: "document-ready" });

	useVisibleTask$(({ track }) => {
		track(() => showUnlearnedOnly.value);
		track(() => JSON.stringify(nodeProgress.value));
		track(() => selectedNodeId.value);
		const lang = track(() => i18n.language);

		const nodes = getLanguageMapNodesForLang(lang);
		const visibleNodes = showUnlearnedOnly.value
			? nodes.filter((node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) !== "learned")
			: nodes;

		if (visibleNodes.length === 0) return;
		if (!visibleNodes.some((node) => node.id === selectedNodeId.value)) {
			selectedNodeId.value = visibleNodes[0].id;
		}
	});

	const categoryLabelMap: Record<LanguageMapNodeCategory, string> = {
		core: ui.mapCategoryCore,
		timeline: ui.mapCategoryTimeline,
		tense: ui.mapCategoryTense,
		verb_system: ui.mapCategoryVerbSystem,
		irregular: ui.mapCategoryIrregular,
	};

	const statusLabelMap: Record<LanguageMapNodeStatus, string> = {
		new: ui.mapStatusNew,
		learning: ui.mapStatusLearning,
		learned: ui.mapStatusLearned,
	};

	const nodes = getLanguageMapNodesForLang(language);
	const edges = getLanguageMapEdgesForLang(language);

	const visibleNodes = showUnlearnedOnly.value
		? nodes.filter((node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) !== "learned")
		: nodes;

	const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));

	const visibleEdges = edges.filter(
		(edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to),
	).filter(
		(edge) =>
			edge.kind !== "cross" ||
			edge.from === selectedNodeId.value ||
			edge.to === selectedNodeId.value,
	);

	const selectedNode =
		visibleNodes.find((node) => node.id === selectedNodeId.value) ??
		nodes.find((node) => node.id === selectedNodeId.value) ??
		visibleNodes[0] ??
		nodes[0] ??
		null;

	const learnedCount = nodes.filter(
		(node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) === "learned",
	).length;
	const learningCount = nodes.filter(
		(node) => getLanguageMapNodeStatus(node.id, nodeProgress.value) === "learning",
	).length;
	const newCount = nodes.length - learnedCount - learningCount;

	const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, LanguageMapNode>;
	const connectedNodes = selectedNode
		? collectConnectedNodes(selectedNode.id, edges, nodeById)
		: [];
	const relatedCardLinks = selectedNode ? buildNodeRelatedCardLinks(selectedNode, language, ui) : [];
	const relatedCardIds = selectedNode ? getNodeRelatedCardIds(selectedNode.id, language) : [];
	const relatedCardStats = countCompletedCards(relatedCardIds, completedCardProgress.value);

	const handleDiscuss$ = $(async () => {
		if (chatPending.value) return;

		const currentNode = getLanguageMapNodeByIdForLang(selectedNodeId.value, i18n.language);
		if (!currentNode) return;

		chatNodeId.value = currentNode.id;
		const userText = buildNodeOverviewPrompt(currentNode, language);
		chatPending.value = true;

		const historyPayload: LanguageMapChatMessage[] = [];

		try {
			const response = await httpPost<LanguageMapChatResponse>(endpoints.languageMapChat, {
				language,
				mode: "node_overview" satisfies LanguageMapChatMode,
				message: userText,
				node: toChatNodeContext(currentNode),
				history: historyPayload,
			});

			return response;
		} catch (error) {
			console.error("[language-map chat]", error);
			return null;
		} finally {
			chatPending.value = false;
		}
	});

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
							{learnedCount} / {nodes.length} {ui.mapProgressLearnedSuffix}
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
					<LanguageMapGraph
						visibleNodes={visibleNodes}
						visibleEdges={visibleEdges}
						nodeById={nodeById}
						selectedNodeId={selectedNodeId.value}
						nodeProgress={nodeProgress.value}
						graphAriaLabel={ui.mapGraphAriaLabel}
						onNodeClick$={(nodeId) => {
							selectedNodeId.value = nodeId;
						}}
					/>
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
					<LanguageMapNodeCard
						node={selectedNode}
						nodeProgress={nodeProgress.value}
						connectedNodes={connectedNodes}
						relatedCardLinks={relatedCardLinks}
						relatedCardStats={relatedCardStats}
						chatPending={chatPending.value}
						categoryLabelMap={categoryLabelMap}
						statusLabelMap={statusLabelMap}
						discussButtonLabel={ui.mapDiscussButton}
						chatThinkingLabel={ui.mapChatThinking}
						ui={{
							mapFormulaTitle: ui.mapFormulaTitle,
							mapKeyVerbsTitle: ui.mapKeyVerbsTitle,
							mapIrregularTableTitle: ui.mapIrregularTableTitle,
							mapRelatedNodesTitle: ui.mapRelatedNodesTitle,
							mapRelatedCardsTitle: ui.mapRelatedCardsTitle,
							mapNodeCardsProgressTitle: ui.mapNodeCardsProgressTitle,
							mapNodeCardsProgressSuffix: ui.mapNodeCardsProgressSuffix,
							mapNodeCardsProgressEmpty: ui.mapNodeCardsProgressEmpty,
							mapStatusTitle: ui.mapStatusTitle,
						}}
						onStatusChange$={(nodeId, status) => {
							nodeProgress.value = setLanguageMapNodeStatus(nodeId, status, undefined, i18n.language);
						}}
						onDiscuss$={handleDiscuss$}
						onRelatedNodeClick$={(nodeId) => {
							selectedNodeId.value = nodeId;
						}}
					/>
				) : null}

				<LanguageMapChat
					language={language}
					activeNode={activeChatNode}
					ui={{
						mapChatTitle: ui.mapChatTitle,
						mapChatSubtitle: ui.mapChatSubtitle,
						mapChatContext: ui.mapChatContext,
						mapChatNoContext: ui.mapChatNoContext,
						mapChatEmptyState: ui.mapChatEmptyState,
						mapChatAssistant: ui.mapChatAssistant,
						mapChatYou: ui.mapChatYou,
						mapChatThinking: ui.mapChatThinking,
						mapChatInputPlaceholder: ui.mapChatInputPlaceholder,
						mapChatSend: ui.mapChatSend,
					}}
					onChatPendingChange$={(pending) => {
						chatPending.value = pending;
					}}
				/>
			</aside>
		</section>
	);
});

export const head: DocumentHead = {
	title: "Lim | Language Map",
};
