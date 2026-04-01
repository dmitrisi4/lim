import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { VocabularyWord, VocabularyWordType, VocabularySection } from "~/features/vocabulary/model/word-bank";
import { getPrimaryWordSection } from "~/features/vocabulary/model/word-bank";
import type { VerbInsight, VerbTense } from "~/features/vocabulary/model/verb-insights";
import type { LearningLanguage } from "~/shared/i18n/ui";

type PropsType = {
	word: VocabularyWord;
	insight: VerbInsight | null;
	isLearned: boolean;
	language: LearningLanguage;
	labels: {
		photoPlaceholderLabel: string;
		photoHintLabel: string;
		exampleLabel: string;
		markLearnedLabel: string;
		learnedLabel: string;
		verbFormsButtonLabel: string;
		verbExamplesButtonLabel: string;
		explainButtonLabel: string;
	};
	typeLabelMap: Record<VocabularyWordType, string>;
	sectionLabelMap: Record<VocabularySection, string>;
	onCardClick$: PropFunction<(event: Event) => void>;
	onContextMenu$: PropFunction<(event: Event) => void>;
	onToggleLearned$: PropFunction<() => void>;
	onOpenVerbForms$: PropFunction<(firstTense: VerbTense | null) => void>;
	onOpenVerbExamples$: PropFunction<() => void>;
	onExplain$: PropFunction<() => void>;
	isMenuOpen: boolean;
	menuX: number;
	menuY: number;
	onCloseMenu$: PropFunction<() => void>;
};

export const VocabularyCard = component$<PropsType>((props) => {
	const { word, insight, isLearned, labels } = props;
	const primarySection = getPrimaryWordSection(word);

	return (
		<article
			class="vocab-card"
			onClick$={props.onCardClick$}
			onContextMenu$={props.onContextMenu$}
		>
			<header class="vocab-card-head">
				<span class="vocab-chip vocab-chip-type">{props.typeLabelMap[word.type]}</span>
				<span class="vocab-chip vocab-chip-section">{props.sectionLabelMap[primarySection]}</span>
			</header>

			<div class="vocab-photo-slot">
				{word.imageUrl ? (
					<img class="vocab-photo" src={word.imageUrl} alt={word.imageAlt ?? word.term} loading="lazy" />
				) : (
					<div class="vocab-photo-placeholder" aria-label={labels.photoPlaceholderLabel}>
						<p class="vocab-photo-title">{labels.photoPlaceholderLabel}</p>
						<p class="vocab-photo-hint">{labels.photoHintLabel}</p>
					</div>
				)}
			</div>

			<h3 class="vocab-term">{word.term}</h3>
			<p class="vocab-translation">{word.translation}</p>

			<div class="vocab-actions-row">
				<div class="vocab-support-actions">
					{insight ? (
						<div class="vocab-verb-actions">
							<button
								type="button"
								class="vocab-verb-action"
								onClick$={() => {
									const firstTense =
										(Object.keys(insight.formsByTense) as VerbTense[]).find(
											(t) => (insight.formsByTense[t]?.length ?? 0) > 0,
										) ?? null;
									props.onOpenVerbForms$(firstTense);
								}}
							>
								{labels.verbFormsButtonLabel}
							</button>
							<button
								type="button"
								class="vocab-verb-action"
								onClick$={() => props.onOpenVerbExamples$()}
							>
								{labels.verbExamplesButtonLabel}
							</button>
						</div>
					) : null}
					<button
						type="button"
						class="vocab-explain-action"
						onClick$={() => props.onExplain$()}
					>
						{labels.explainButtonLabel}
					</button>
				</div>

				<button
					type="button"
					class={isLearned ? "vocab-learn-toggle active" : "vocab-learn-toggle"}
					onClick$={() => props.onToggleLearned$()}
				>
					{isLearned ? labels.learnedLabel : labels.markLearnedLabel}
				</button>
			</div>

			{props.isMenuOpen ? (
				<>
					<button
						type="button"
						class="vocab-card-context-backdrop"
						data-menu-skip="true"
						aria-label="Close context menu"
						onClick$={(event) => {
							event.stopPropagation();
							props.onCloseMenu$();
						}}
					/>
					<div
						class="vocab-card-context-menu"
						data-menu-skip="true"
						style={{ left: `${props.menuX}px`, top: `${props.menuY}px` }}
						onClick$={(event) => {
							event.stopPropagation();
						}}
					>
						<p class="vocab-card-context-title">Card actions</p>
						{insight ? (
							<>
								<button
									type="button"
									class="vocab-card-context-action"
									onClick$={() => {
										const firstTense =
											(Object.keys(insight.formsByTense) as VerbTense[]).find(
												(t) => (insight.formsByTense[t]?.length ?? 0) > 0,
											) ?? null;
										props.onOpenVerbForms$(firstTense);
									}}
								>
									{labels.verbFormsButtonLabel}
								</button>
								<button
									type="button"
									class="vocab-card-context-action"
									onClick$={() => props.onOpenVerbExamples$()}
								>
									{labels.verbExamplesButtonLabel}
								</button>
							</>
						) : null}
						<button
							type="button"
							class="vocab-card-context-action vocab-card-context-action-explain"
							onClick$={() => props.onExplain$()}
						>
							{labels.explainButtonLabel}
						</button>
						<button
							type="button"
							class="vocab-card-context-action vocab-card-context-action-learn"
							onClick$={() => props.onToggleLearned$()}
						>
							{isLearned ? labels.learnedLabel : labels.markLearnedLabel}
						</button>
					</div>
				</>
			) : null}

			{word.note ? <p class="vocab-note">{word.note}</p> : null}
			{word.example ? (
				<p class="vocab-example">
					<span class="vocab-example-label">{labels.exampleLabel}:</span> {word.example}
				</p>
			) : null}
		</article>
	);
});
