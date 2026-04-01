import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import {
	LANGUAGE_MAP_NODE_BY_ID,
	LANGUAGE_MAP_VIEWBOX,
	type LanguageMapEdge,
	type LanguageMapNode,
} from "~/features/language-map/model/graph";
import type { LanguageMapProgress } from "~/features/language-map/model/progress";
import { getLanguageMapNodeStatus } from "~/features/language-map/model/progress";
import { getCurvedEdgeGeometry, getNodeLines } from "~/features/language-map/lib/graph-geometry";

type PropsType = {
	visibleNodes: readonly LanguageMapNode[];
	visibleEdges: readonly LanguageMapEdge[];
	selectedNodeId: string;
	nodeProgress: LanguageMapProgress;
	graphAriaLabel: string;
	onNodeClick$: PropFunction<(nodeId: string) => void>;
};

export const LanguageMapGraph = component$<PropsType>((props) => {
	return (
		<div class="language-map-graph-shell">
			<svg
				class="language-map-graph"
				viewBox={`0 0 ${LANGUAGE_MAP_VIEWBOX.width} ${LANGUAGE_MAP_VIEWBOX.height}`}
				role="img"
				aria-label={props.graphAriaLabel}
			>
				<defs>
					<linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stop-color="rgba(49, 196, 255, 0.85)" />
						<stop offset="100%" stop-color="rgba(255, 47, 109, 0.78)" />
					</linearGradient>
				</defs>

				{props.visibleEdges.map((edge) => {
					const fromNode = LANGUAGE_MAP_NODE_BY_ID[edge.from];
					const toNode = LANGUAGE_MAP_NODE_BY_ID[edge.to];
					if (!fromNode || !toNode) return null;

					const isSelectedEdge =
						props.selectedNodeId === edge.from || props.selectedNodeId === edge.to;
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

				{props.visibleNodes.map((node) => {
					const nodeStatus = getLanguageMapNodeStatus(node.id, props.nodeProgress);
					const selected = props.selectedNodeId === node.id;
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
							onClick$={() => props.onNodeClick$(node.id)}
						>
							<circle cx={node.position.x} cy={node.position.y} r={nodeRadius} />
							<text
								class="language-map-node-label"
								x={node.position.x}
								y={node.position.y - (lines.length - 1) * 10}
							>
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
	);
});
