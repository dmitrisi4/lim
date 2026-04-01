import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { LanguageMapNode, LanguageMapNodeCategory } from "~/features/language-map/model/graph";
import type { LanguageMapNodeStatus, LanguageMapProgress } from "~/features/language-map/model/progress";
import { getLanguageMapNodeStatus, setLanguageMapNodeStatus } from "~/features/language-map/model/progress";
import type { RelatedCardsLink } from "~/features/language-map/ui/types";

type PropsType = {
	node: LanguageMapNode;
	nodeProgress: LanguageMapProgress;
	connectedNodes: LanguageMapNode[];
	relatedCardLinks: RelatedCardsLink[];
	relatedCardStats: { completed: number; total: number };
	chatPending: boolean;
	categoryLabelMap: Record<LanguageMapNodeCategory, string>;
	statusLabelMap: Record<LanguageMapNodeStatus, string>;
	discussButtonLabel: string;
	chatThinkingLabel: string;
	ui: {
		mapFormulaTitle: string;
		mapKeyVerbsTitle: string;
		mapIrregularTableTitle: string;
		mapRelatedNodesTitle: string;
		mapRelatedCardsTitle: string;
		mapNodeCardsProgressTitle: string;
		mapNodeCardsProgressSuffix: string;
		mapNodeCardsProgressEmpty: string;
		mapStatusTitle: string;
	};
	onStatusChange$: PropFunction<(nodeId: string, status: LanguageMapNodeStatus) => void>;
	onDiscuss$: PropFunction<() => void>;
	onRelatedNodeClick$: PropFunction<(nodeId: string) => void>;
};

export const LanguageMapNodeCard = component$<PropsType>((props) => {
	const { node, ui } = props;
	const selectedStatus = getLanguageMapNodeStatus(node.id, props.nodeProgress);

	return (
		<article class="node-card">
			<header class="node-card-head">
				<p class="node-card-category">{props.categoryLabelMap[node.category]}</p>
				<h3 class="node-card-title">{node.label}</h3>
				<p class="node-card-summary">{node.summary}</p>
			</header>

			<p class="node-card-details">{node.details}</p>

			{node.formula ? (
				<div class="node-card-block">
					<p class="node-card-block-title">{ui.mapFormulaTitle}</p>
					<p class="node-card-formula">{node.formula}</p>
				</div>
			) : null}

			<div class="node-card-block">
				<p class="node-card-block-title">{ui.mapKeyVerbsTitle}</p>
				<div class="node-card-chip-row">
					{node.keyVerbs.map((verb) => (
						<span key={`${node.id}-${verb}`} class="node-chip">
							{verb}
						</span>
					))}
				</div>
			</div>

			{node.irregularSamples && node.irregularSamples.length > 0 ? (
				<div class="node-card-block">
					<p class="node-card-block-title">{ui.mapIrregularTableTitle}</p>
					<div class="node-card-irregular-table" role="table" aria-label={ui.mapIrregularTableTitle}>
						<div class="irregular-row head" role="row">
							<span role="columnheader">V1</span>
							<span role="columnheader">V2</span>
							<span role="columnheader">V3</span>
						</div>
						{node.irregularSamples.map((sample) => (
							<div key={`${node.id}-${sample.base}`} class="irregular-row" role="row">
								<span role="cell">{sample.base}</span>
								<span role="cell">{sample.past}</span>
								<span role="cell">{sample.participle}</span>
							</div>
						))}
					</div>
				</div>
			) : null}

			{props.connectedNodes.length > 0 ? (
				<div class="node-card-block">
					<p class="node-card-block-title">{ui.mapRelatedNodesTitle}</p>
					<div class="node-card-related-grid">
						{props.connectedNodes.map((connNode) => (
							<button
								key={`rel-${connNode.id}`}
								type="button"
								class="related-node-button"
								onClick$={() => props.onRelatedNodeClick$(connNode.id)}
							>
								{connNode.label}
							</button>
						))}
					</div>
				</div>
			) : null}

			{props.relatedCardLinks.length > 0 ? (
				<div class="node-card-block">
					<p class="node-card-block-title">{ui.mapRelatedCardsTitle}</p>
					<div class="node-card-related-grid">
						{props.relatedCardLinks.map((link) => (
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
				{props.relatedCardStats.total > 0 ? (
					<p class="node-card-related-progress">
						<span class="node-card-related-progress-value">
							{props.relatedCardStats.completed} / {props.relatedCardStats.total}
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
							class={
								selectedStatus === status
									? `status-button status-${status} active`
									: `status-button status-${status}`
							}
							onClick$={() => props.onStatusChange$(node.id, status)}
						>
							{props.statusLabelMap[status]}
						</button>
					))}
				</div>
			</div>

			<button
				type="button"
				class="node-discuss-button"
				disabled={props.chatPending}
				onClick$={() => props.onDiscuss$()}
			>
				{props.chatPending ? props.chatThinkingLabel : props.discussButtonLabel}
			</button>
		</article>
	);
});
