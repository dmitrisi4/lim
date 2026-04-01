import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { parseHintText, parseConjugationPattern } from "~/entities/card/lib/card-parsers";

type PropsType = {
	raw: string;
	hintId: string;
	showHintInline?: boolean;
	hintsEnabled: boolean;
	isOpenedHint: boolean;
	onToggleHint$: PropFunction<(hintId: string) => void>;
};

export const HintText = component$<PropsType>((props) => {
	const parsed = parseHintText(props.raw);
	const expanded = props.isOpenedHint;
	const showHintInline = props.showHintInline ?? false;
	const conjugation = showHintInline ? parseConjugationPattern(parsed.value) : null;
	const conjugationLabels =
		conjugation?.forms.length === 6
			? ["yo", "tu", "el/ella/usted", "nosotros", "vosotros", "ellos/ellas/ustedes"]
			: ["yo", "tu", "el/ella/usted", "nosotros", "ellos/ellas/ustedes"];

	return (
		<span class="hint-wrap">
			{conjugation ? (
				<span class="conjugation-card">
					<span class="conjugation-verb">{conjugation.verb}</span>
					<span class="conjugation-grid">
						{conjugation.forms.map((form, index) => (
							<span key={`${props.hintId}-conj-${index}`} class="conjugation-row">
								<span class="conjugation-label">{conjugationLabels[index] ?? `forma ${index + 1}`}</span>
								<span class="conjugation-form">{form}</span>
							</span>
						))}
					</span>
				</span>
			) : (
				<span class="hint-value">{parsed.value}</span>
			)}

			{parsed.hint && showHintInline ? (
				<span class="hint-inline-note">{parsed.hint}</span>
			) : null}

			{parsed.hint && !showHintInline && props.hintsEnabled ? (
				<span class="hint-anchor">
					<button
						type="button"
						class="hint-badge"
						aria-expanded={expanded}
						aria-controls={props.hintId}
						onClick$={() => props.onToggleHint$(props.hintId)}
					>
						RU
					</button>
					{expanded ? (
						<span id={props.hintId} class="hint-popover" role="note">
							{parsed.hint}
						</span>
					) : null}
				</span>
			) : null}
		</span>
	);
});
