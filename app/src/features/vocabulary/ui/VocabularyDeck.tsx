import { $, component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { writeCompletedCardProgress } from "~/entities/card/model/completed-progress";
import { VERB_TENSE_OPTIONS, getVerbInsight, type VerbTense } from "~/features/vocabulary/model/verb-insights";
import {
	VOCABULARY_WORD_PROGRESS_STORAGE_KEY,
	readVocabularyWordProgress,
	toggleVocabularyWordProgress,
} from "~/features/vocabulary/model/word-progress";
import type {
	VocabularyProgressFilter,
	VocabularySection,
	VocabularyWord,
	VocabularyWordType,
} from "~/features/vocabulary/model/word-bank";
import type { LearningLanguage } from "~/shared/i18n/ui";
import styles from "~/features/vocabulary/ui/VocabularyDeck.css?inline";
import { SwiperContainer, SwiperSlide } from "~/shared/ui/Swiper";
import { VocabularyCard } from "~/features/vocabulary/ui/VocabularyCard";
import { VerbInsightModal } from "~/features/vocabulary/ui/VerbInsightModal";

type PropsType = {
	language: LearningLanguage;
	words: VocabularyWord[];
	emptyLabel: string;
	photoPlaceholderLabel: string;
	photoHintLabel: string;
	exampleLabel: string;
	progressFilter: VocabularyProgressFilter;
	markLearnedLabel: string;
	learnedLabel: string;
	verbFormsButtonLabel: string;
	verbExamplesButtonLabel: string;
	verbFormsTitleLabel: string;
	verbTenseLabelMap: Record<VerbTense, string>;
	verbExamplesTitleLabel: string;
	verbCloseLabel: string;
	verbPersonLabel: string;
	verbFormLabel: string;
	verbUsageLabel: string;
	typeLabelMap: Record<VocabularyWordType, string>;
	sectionLabelMap: Record<VocabularySection, string>;
	explainButtonLabel: string;
	onExplainWord$?: PropFunction<(word: VocabularyWord) => void>;
	isStudyMode?: boolean;
};

export const VocabularyDeck = component$<PropsType>((props) => {
	useStyles$(styles);

	const activeIndex = useSignal(0);
	const swiperRef = useSignal<HTMLElement>();
	const activeVerbPanel = useSignal<null | { wordId: string; mode: "forms" | "examples" }>(null);
	const cardContextMenu = useSignal<null | { wordId: string; x: number; y: number }>(null);
	const wordProgress = useSignal<Record<string, boolean>>({});
	const progressReady = useSignal(false);

	const isVerbPanelOpen = activeVerbPanel.value !== null;

	const visibleWords =
		props.progressFilter === "all"
			? props.words
			: progressReady.value
				? props.words.filter((word) => {
						const learned = wordProgress.value[word.id] === true;
						return props.progressFilter === "learned" ? learned : !learned;
					})
				: [];

	const total = visibleWords.length;
	const swiperRenderKey = `progress:${props.progressFilter}|total:${total}`;

	useVisibleTask$(({ cleanup }) => {
		wordProgress.value = readVocabularyWordProgress();
		progressReady.value = true;

		const onStorage = (event: StorageEvent) => {
			if (event.key === null || event.key === VOCABULARY_WORD_PROGRESS_STORAGE_KEY) {
				wordProgress.value = readVocabularyWordProgress();
				progressReady.value = true;
			}
		};
		window.addEventListener("storage", onStorage);
		cleanup(() => window.removeEventListener("storage", onStorage));
	}, { strategy: "document-ready" });

	useVisibleTask$(({ track, cleanup }) => {
		track(() => props.words.length);
		track(() => props.progressFilter);
		track(() => progressReady.value);
		track(() => JSON.stringify(wordProgress.value));

		const element = swiperRef.value as (HTMLElement & { swiper?: { activeIndex?: number } }) | undefined;
		if (!element) {
			activeIndex.value = 0;
			return;
		}

		const syncActiveIndex = () => {
			const raw = element.swiper?.activeIndex;
			const normalized = typeof raw === "number" && raw >= 0 ? raw : 0;
			activeIndex.value = Math.min(normalized, Math.max(0, visibleWords.length - 1));
		};

		const onSlideChange = () => {
			syncActiveIndex();
			cardContextMenu.value = null;
		};

		element.addEventListener("swiperslidechange", onSlideChange);
		element.addEventListener("swiperinit", onSlideChange);
		syncActiveIndex();

		cleanup(() => {
			element.removeEventListener("swiperslidechange", onSlideChange);
			element.removeEventListener("swiperinit", onSlideChange);
		});
	});

	const openCardContextMenu$ = $((event: Event, wordId: string, withVerbActions: boolean) => {
		const target = event.target as Element | null;
		if (target?.closest("button, a, input, textarea, select, label, [role='button'], [data-menu-skip='true']")) {
			return;
		}
		const cardElement = event.currentTarget as HTMLElement | null;
		if (!cardElement) return;

		const mouseEvent = event as MouseEvent;
		const cardRect = cardElement.getBoundingClientRect();
		const menuWidth = 220;
		const menuHeight = withVerbActions ? 220 : 164;
		const localX = Number.isFinite(mouseEvent.clientX) ? mouseEvent.clientX - cardRect.left : cardRect.width * 0.5;
		const localY = Number.isFinite(mouseEvent.clientY) ? mouseEvent.clientY - cardRect.top : cardRect.height * 0.5;
		const maxX = Math.max(14, cardRect.width - menuWidth - 14);
		const maxY = Math.max(14, cardRect.height - menuHeight - 14);
		cardContextMenu.value = {
			wordId,
			x: Math.min(Math.max(localX, 14), maxX),
			y: Math.min(Math.max(localY, 14), maxY),
		};
	});

	const toggleLearnedState$ = $((wordId: string) => {
		const nextWordProgress = toggleVocabularyWordProgress(wordId);
		wordProgress.value = nextWordProgress;
		progressReady.value = true;
		writeCompletedCardProgress(wordId, nextWordProgress[wordId] === true);
	});

	return (
		<div class="vocab-swiper-wrap">
			<SwiperContainer
				key={swiperRenderKey}
				ref={swiperRef}
				class="vocab-swiper"
				direction="vertical"
				slides-per-view="1"
				space-between="0"
				mousewheel-enabled={isVerbPanelOpen ? "false" : "true"}
				mousewheel-force-to-axis="true"
				mousewheel-threshold-delta="34"
				mousewheel-threshold-time="420"
				mousewheel-sensitivity="0.55"
				mousewheel-release-on-edges="false"
				keyboard={isVerbPanelOpen ? "false" : "true"}
				allow-touch-move={isVerbPanelOpen ? "false" : "true"}
				speed="320"
				resistance-ratio="0.16"
				touch-start-prevent-default="false"
				touch-start-force-prevent-default="false"
			>
				{visibleWords.map((word) => {
					const insight = word.type === "verb" ? getVerbInsight(word.term, props.language) : null;
					const panelState = activeVerbPanel.value;
					const isPanelOpen = panelState?.wordId === word.id;
					const menuState = cardContextMenu.value;
					const isMenuOpen = menuState?.wordId === word.id;
					const isLearned = wordProgress.value[word.id] === true;

					return (
						<SwiperSlide key={word.id} class="vocab-slide">
							<VocabularyCard
								word={word}
								insight={insight}
								isLearned={isLearned}
								language={props.language}
								labels={{
									photoPlaceholderLabel: props.photoPlaceholderLabel,
									photoHintLabel: props.photoHintLabel,
									exampleLabel: props.exampleLabel,
									markLearnedLabel: props.markLearnedLabel,
									learnedLabel: props.learnedLabel,
									verbFormsButtonLabel: props.verbFormsButtonLabel,
									verbExamplesButtonLabel: props.verbExamplesButtonLabel,
									explainButtonLabel: props.explainButtonLabel,
								}}
								typeLabelMap={props.typeLabelMap}
								sectionLabelMap={props.sectionLabelMap}
								onCardClick$={(event) => openCardContextMenu$(event, word.id, insight !== null)}
								onContextMenu$={(event) => {
									event.preventDefault();
									openCardContextMenu$(event, word.id, insight !== null);
								}}
								onToggleLearned$={() => {
									toggleLearnedState$(word.id);
									cardContextMenu.value = null;
								}}
								onOpenVerbForms$={(firstTense) => {
									activeVerbPanel.value = { wordId: word.id, mode: "forms" };
									cardContextMenu.value = null;
									void firstTense;
								}}
								onOpenVerbExamples$={() => {
									activeVerbPanel.value = { wordId: word.id, mode: "examples" };
									cardContextMenu.value = null;
								}}
								onExplain$={() => {
									cardContextMenu.value = null;
									props.onExplainWord$?.(word);
								}}
								isMenuOpen={isMenuOpen}
								menuX={menuState?.x ?? 0}
								menuY={menuState?.y ?? 0}
								onCloseMenu$={() => {
									cardContextMenu.value = null;
								}}
								isStudyMode={props.isStudyMode}
							/>

							{isPanelOpen && insight && panelState ? (
								<VerbInsightModal
									wordId={word.id}
									insight={insight}
									mode={panelState.mode}
									labels={{
										verbFormsTitleLabel: props.verbFormsTitleLabel,
										verbExamplesTitleLabel: props.verbExamplesTitleLabel,
										verbCloseLabel: props.verbCloseLabel,
										verbPersonLabel: props.verbPersonLabel,
										verbFormLabel: props.verbFormLabel,
										verbUsageLabel: props.verbUsageLabel,
									}}
									verbTenseLabelMap={props.verbTenseLabelMap}
									onClose$={() => {
										activeVerbPanel.value = null;
									}}
								/>
							) : null}
						</SwiperSlide>
					);
				})}
			</SwiperContainer>

			{total === 0 ? <p class="vocab-empty">{props.emptyLabel}</p> : null}

			<aside class="vocab-side-pagination" aria-live="polite">
				<span class="vocab-side-current">{Math.min(total, activeIndex.value + 1)}</span>
				<span class="vocab-side-sep">/</span>
				<span class="vocab-side-total">{total}</span>
			</aside>
		</div>
	);
});
