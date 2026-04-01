import type { LanguageMapEdge, LanguageMapNode } from "~/features/language-map/model/graph";

export function getEdgeSign(edgeId: string): number {
	let sum = 0;
	for (const char of edgeId) {
		sum += char.charCodeAt(0);
	}
	return sum % 2 === 0 ? 1 : -1;
}

export function getCurvedEdgeGeometry(
	edge: LanguageMapEdge,
	fromNode: LanguageMapNode,
	toNode: LanguageMapNode,
) {
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

	return { path, labelX, labelY };
}

export function getNodeLines(label: string): string[] {
	return label.split("\n");
}

export function collectConnectedNodes(
	nodeId: string,
	edges: readonly LanguageMapEdge[],
	nodeById: Record<string, LanguageMapNode>,
): LanguageMapNode[] {
	const relatedIds = new Set<string>();

	for (const edge of edges) {
		if (edge.from === nodeId) relatedIds.add(edge.to);
		if (edge.to === nodeId) relatedIds.add(edge.from);
	}

	return [...relatedIds]
		.map((id) => nodeById[id])
		.filter((node): node is LanguageMapNode => node !== undefined);
}
