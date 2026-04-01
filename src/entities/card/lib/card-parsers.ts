export type SlideTone = "neutral" | "masculine" | "feminine" | "plural" | "exception";

export interface HintTextParts {
	value: string;
	hint?: string;
}

export function normalizeAnswer(raw: string): string {
	const [withoutHint] = raw.split("||");
	return withoutHint.trim().toLowerCase();
}

export function parseHintText(raw: string): HintTextParts {
	const parts = raw.split("||");
	if (parts.length <= 1) return { value: raw };
	const value = parts[0].trim();
	const hint = parts.slice(1).join("||").trim();
	return hint ? { value, hint } : { value };
}

export function parseConjugationPattern(raw: string): { verb: string; forms: string[] } | null {
	const separatorIndex = raw.indexOf(":");
	if (separatorIndex <= 0) return null;

	const verb = raw.slice(0, separatorIndex).trim();
	const forms = raw
		.slice(separatorIndex + 1)
		.split(",")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);

	if (!verb || forms.length < 5 || forms.length > 6) return null;
	return { verb, forms };
}

export function resolveSlideTone(raw: string): SlideTone {
	const normalized = raw.toLowerCase();

	if (
		normalized.includes("excepc") ||
		normalized.includes("exception") ||
		normalized.includes("el dia") ||
		normalized.includes("el mapa") ||
		normalized.includes("la mano")
	) {
		return "exception";
	}

	if (
		normalized.includes("plural") ||
		/\blos\b/.test(normalized) ||
		/\blas\b/.test(normalized) ||
		/\bunos\b/.test(normalized) ||
		/\bunas\b/.test(normalized)
	) {
		return "plural";
	}

	if (normalized.includes("femenin") || /\bla\b/.test(normalized) || /\buna\b/.test(normalized)) {
		return "feminine";
	}

	if (normalized.includes("masculin") || /\bel\b/.test(normalized) || /\bun\b/.test(normalized)) {
		return "masculine";
	}

	return "neutral";
}

export function toneBadge(tone: SlideTone): string | null {
	const badges: Partial<Record<SlideTone, string>> = {
		masculine: "M",
		feminine: "F",
		plural: "PL",
		exception: "EX",
	};
	return badges[tone] ?? null;
}

export function toneLabel(tone: SlideTone): string | null {
	const labels: Partial<Record<SlideTone, string>> = {
		masculine: "Masculino",
		feminine: "Femenino",
		plural: "Plural",
		exception: "Excepcion",
	};
	return labels[tone] ?? null;
}
