import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { VOCABULARY_PROGRESS_OPTIONS, VOCABULARY_TYPE_OPTIONS } from "~/features/vocabulary/model/word-bank";
import type { VocabularyProgressFilter, VocabularySection, VocabularyWordType } from "~/features/vocabulary/model/word-bank";
import type { LearningLanguage } from "~/shared/i18n/ui";

type PropsType = {
	language: LearningLanguage;
	filters: {
		types: VocabularyWordType[];
		sections: VocabularySection[];
		progress: VocabularyProgressFilter;
	};
	totalWords: number;
	sectionOptions: readonly VocabularySection[];
	typeLabelMap: Record<VocabularyWordType, string>;
	sectionLabelMap: Record<VocabularySection, string>;
	progressLabelMap: Record<VocabularyProgressFilter, string>;
	resetHref: string;
	isStudyMode: boolean;
	onToggleStudyMode$: PropFunction<() => void>;
	ui: {
		vocabTitle: string;
		vocabSubtitle: string;
		vocabTotalLabel: string;
		vocabFiltersPanel: string;
		vocabTypes: string;
		vocabSections: string;
		vocabProgressTitle: string;
		vocabApplyFilters: string;
		vocabResetFilters: string;
	};
};

export const VocabularyFilters = component$<PropsType>((props) => {
	const { ui, filters, sectionOptions, typeLabelMap, sectionLabelMap, progressLabelMap } = props;

	return (
		<aside class="vocabulary-sidebar">
			<div class="vocabulary-intro">
				<h2 class="vocabulary-title">{ui.vocabTitle}</h2>
				<p class="vocabulary-subtitle">{ui.vocabSubtitle}</p>
				<p class="vocabulary-count">
					{ui.vocabTotalLabel}: {props.totalWords}
				</p>
			</div>

			<div class="view-mode-selector">
				<button
					type="button"
					class={["view-mode-btn", props.isStudyMode ? "active" : ""]}
					onClick$={props.onToggleStudyMode$}
				>
					<span class="view-mode-icon">🎴</span>
					<span>Flashcards Mode</span>
				</button>
			</div>

			<details class="vocabulary-filters-shell" open>
				<summary class="vocabulary-filters-summary">
					<span class="vocabulary-filters-summary-title">{ui.vocabFiltersPanel}</span>
					<span class="vocabulary-filters-summary-icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" role="presentation">
							<path d="m6 9 6 6 6-6" />
						</svg>
					</span>
				</summary>

				<form method="get" class="vocabulary-filters">
					<input type="hidden" name="lang" value={props.language} />

					<div class="filter-group">
						<p class="filter-title">{ui.vocabTypes}</p>
						<div class="filter-grid">
							{VOCABULARY_TYPE_OPTIONS.map((type) => (
								<label key={`type-${type}`} class="filter-chip">
									<input
										type="checkbox"
										name="type"
										value={type}
										checked={filters.types.includes(type)}
									/>
									<span>{typeLabelMap[type]}</span>
								</label>
							))}
						</div>
					</div>

					<div class="filter-group">
						<p class="filter-title">{ui.vocabSections}</p>
						<div class="filter-grid filter-grid-sections">
							{sectionOptions.map((section) => (
								<label key={`section-${section}`} class="filter-chip">
									<input
										type="checkbox"
										name="section"
										value={section}
										checked={filters.sections.includes(section)}
									/>
									<span>{sectionLabelMap[section]}</span>
								</label>
							))}
						</div>
					</div>

					<div class="filter-group">
						<p class="filter-title">{ui.vocabProgressTitle}</p>
						<div class="filter-grid">
							{VOCABULARY_PROGRESS_OPTIONS.map((progressOption) => (
								<label key={`progress-${progressOption}`} class="filter-chip">
									<input
										type="radio"
										name="progress"
										value={progressOption}
										checked={filters.progress === progressOption}
									/>
									<span>{progressLabelMap[progressOption]}</span>
								</label>
							))}
						</div>
					</div>

					<div class="filter-actions">
						<button type="submit" class="filter-apply">
							{ui.vocabApplyFilters}
						</button>
						<Link href={props.resetHref} class="filter-reset">
							{ui.vocabResetFilters}
						</Link>
					</div>
				</form>
			</details>
		</aside>
	);
});
