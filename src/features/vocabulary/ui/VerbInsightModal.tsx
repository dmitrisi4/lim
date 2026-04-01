import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { VerbInsight, VerbTense } from "~/features/vocabulary/model/verb-insights";
import { VERB_TENSE_OPTIONS } from "~/features/vocabulary/model/verb-insights";

const EVERYDAY_TENSES = new Set<VerbTense>(["present_simple", "past_simple", "future_simple", "present_continuous"]);

type PropsType = {
	wordId: string;
	insight: VerbInsight;
	mode: "forms" | "examples";
	labels: {
		verbFormsTitleLabel: string;
		verbExamplesTitleLabel: string;
		verbCloseLabel: string;
		verbPersonLabel: string;
		verbFormLabel: string;
		verbUsageLabel: string;
	};
	verbTenseLabelMap: Record<VerbTense, string>;
	onClose$: PropFunction<() => void>;
};

export const VerbInsightModal = component$<PropsType>((props) => {
	const { wordId, insight, mode, labels } = props;

	const verbModalRef = useSignal<HTMLElement>();
	const verbFormsSliderRef = useSignal<HTMLElement>();
	const verbFormsScrollbarRef = useSignal<HTMLElement>();
	const openVerbTense = useSignal<null | { wordId: string; tense: VerbTense }>(null);
	const modalScrollState = useSignal({ canScroll: false, atBottom: false });
	const verbFormsSliderState = useSignal({ thumbWidth: 100, thumbLeft: 0 });
	const verbFormsScrollbarDragging = useSignal(false);

	const keyTenses: readonly VerbTense[] = ["present_simple", "past_simple", "future_simple"];
	const tenseSlides = [
		...keyTenses,
		...VERB_TENSE_OPTIONS.filter((tense) => !keyTenses.includes(tense)),
	]
		.map((tense) => ({ tense, rows: insight.formsByTense[tense] }))
		.filter((entry) => entry.rows && entry.rows.length > 0);
	const tenseSlidePages = Array.from(
		{ length: Math.ceil(tenseSlides.length / 3) },
		(_, pageIndex) => tenseSlides.slice(pageIndex * 3, pageIndex * 3 + 3),
	);

	const panelTitle = mode === "forms" ? labels.verbFormsTitleLabel : labels.verbExamplesTitleLabel;

	useVisibleTask$(({ track, cleanup }) => {
		track(() => wordId);
		track(() => mode);
		track(() => verbModalRef.value);

		const element = verbModalRef.value;
		if (!element) {
			modalScrollState.value = { canScroll: false, atBottom: false };
			return;
		}

		const updateScrollState = () => {
			const canScroll = element.scrollHeight - element.clientHeight > 8;
			const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 8;
			modalScrollState.value = { canScroll, atBottom };
		};

		updateScrollState();
		element.addEventListener("scroll", updateScrollState, { passive: true });
		window.addEventListener("resize", updateScrollState);
		cleanup(() => {
			element.removeEventListener("scroll", updateScrollState);
			window.removeEventListener("resize", updateScrollState);
		});
	});

	useVisibleTask$(({ track, cleanup }) => {
		track(() => wordId);
		track(() => mode);
		track(() => verbFormsSliderRef.value);

		if (mode !== "forms") {
			verbFormsSliderState.value = { thumbWidth: 100, thumbLeft: 0 };
			return;
		}

		const element = verbFormsSliderRef.value;
		if (!element) {
			verbFormsSliderState.value = { thumbWidth: 100, thumbLeft: 0 };
			return;
		}

		const updateSliderState = () => {
			const visibleWidth = Math.max(element.clientWidth, 1);
			const totalWidth = Math.max(element.scrollWidth, visibleWidth);
			const maxScrollLeft = Math.max(totalWidth - visibleWidth, 0);
			const rawThumbWidth = (visibleWidth / totalWidth) * 100;
			const thumbWidth = Math.min(100, Math.max(rawThumbWidth, 18));
			const thumbTravel = 100 - thumbWidth;
			const progress = maxScrollLeft > 0 ? element.scrollLeft / maxScrollLeft : 0;
			const thumbLeft = thumbTravel * progress;
			verbFormsSliderState.value = { thumbWidth, thumbLeft: Number.isFinite(thumbLeft) ? thumbLeft : 0 };
		};

		updateSliderState();
		element.addEventListener("scroll", updateSliderState, { passive: true });
		window.addEventListener("resize", updateSliderState);
		const rafId = window.requestAnimationFrame(() => updateSliderState());

		cleanup(() => {
			window.cancelAnimationFrame(rafId);
			element.removeEventListener("scroll", updateSliderState);
			window.removeEventListener("resize", updateSliderState);
		});
	});

	const onScrollbarPointerDown$ = $(async (event: PointerEvent) => {
		const slider = verbFormsSliderRef.value;
		const scrollbar = verbFormsScrollbarRef.value;
		if (!slider || !scrollbar) return;

		event.preventDefault();
		verbFormsScrollbarDragging.value = true;

		const scrollbarRect = scrollbar.getBoundingClientRect();
		const trackWidth = Math.max(scrollbarRect.width, 1);
		const maxScrollLeft = Math.max(slider.scrollWidth - slider.clientWidth, 0);
		const thumbWidthPx = (verbFormsSliderState.value.thumbWidth / 100) * trackWidth;
		const maxThumbLeftPx = Math.max(trackWidth - thumbWidthPx, 0);

		const syncScrollByClientX = (clientX: number) => {
			if (maxScrollLeft <= 0 || maxThumbLeftPx <= 0) {
				slider.scrollTo({ left: 0, behavior: "auto" });
				return;
			}
			const thumbLeftPx = Math.min(Math.max(clientX - scrollbarRect.left - thumbWidthPx * 0.5, 0), maxThumbLeftPx);
			slider.scrollTo({ left: (thumbLeftPx / maxThumbLeftPx) * maxScrollLeft, behavior: "auto" });
		};

		syncScrollByClientX(event.clientX);

		const onPointerMove = (moveEvent: PointerEvent) => {
			moveEvent.preventDefault();
			syncScrollByClientX(moveEvent.clientX);
		};

		const stopDragging = () => {
			verbFormsScrollbarDragging.value = false;
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", stopDragging);
			window.removeEventListener("pointercancel", stopDragging);
		};

		window.addEventListener("pointermove", onPointerMove, { passive: false });
		window.addEventListener("pointerup", stopDragging);
		window.addEventListener("pointercancel", stopDragging);
	});

	return (
		<div class="vocab-verb-modal-backdrop" onClick$={() => props.onClose$()}>
			<div class="vocab-verb-modal-shell" onClick$={(event) => event.stopPropagation()}>
				<section
					ref={verbModalRef}
					class={mode === "forms" ? "vocab-verb-modal vocab-verb-modal-forms" : "vocab-verb-modal"}
					role="dialog"
					aria-modal="true"
					aria-label={panelTitle}
				>
					<header class="vocab-verb-modal-head">
						<h4 class="vocab-verb-modal-title">{panelTitle}</h4>
						<button type="button" class="vocab-verb-close" onClick$={() => props.onClose$()}>
							{labels.verbCloseLabel}
						</button>
					</header>

					<p class="vocab-verb-note">{insight.note}</p>

					{mode === "forms" ? (
						<div class="vocab-verb-forms-layout">
							<div ref={verbFormsSliderRef} class="vocab-verb-forms-slider">
								{tenseSlidePages.map((page, pageIndex) => (
									<section key={`${wordId}-tense-page-${pageIndex}`} class="vocab-verb-forms-slide">
										<div class="vocab-verb-accordion">
											{page.map(({ tense, rows }) => {
												const isOpen =
													openVerbTense.value?.wordId === wordId &&
													openVerbTense.value.tense === tense;
												const isEverydayTense = EVERYDAY_TENSES.has(tense);
												const blockClass = [
													"vocab-verb-tense-block",
													isEverydayTense ? "vocab-verb-tense-block-common" : "",
													isOpen ? "vocab-verb-tense-block-open" : "",
												]
													.filter(Boolean)
													.join(" ");

												return (
													<section key={`${wordId}-tense-${tense}`} class={blockClass}>
														<button
															type="button"
															class="vocab-verb-tense-trigger"
															aria-expanded={isOpen ? "true" : "false"}
															onClick$={() => {
																openVerbTense.value = isOpen
																	? null
																	: { wordId, tense };
															}}
														>
															<span class="vocab-verb-tense-head">
																<span
																	class={
																		isEverydayTense
																			? "vocab-verb-tense-title vocab-verb-tense-title-common"
																			: "vocab-verb-tense-title"
																	}
																>
																	{props.verbTenseLabelMap[tense]}
																</span>
																<span class="vocab-verb-tense-usage">
																	{insight.tenseUsage[tense]}
																</span>
															</span>
															<span class="vocab-verb-tense-caret" aria-hidden="true">
																{isOpen ? "−" : "+"}
															</span>
														</button>

														{isOpen ? (
															<div class="vocab-verb-tense-content">
																<div class="vocab-verb-table-wrap">
																	<table class="vocab-verb-table">
																		<thead>
																			<tr>
																				<th>{labels.verbPersonLabel}</th>
																				<th>{labels.verbFormLabel}</th>
																				<th>{labels.verbUsageLabel}</th>
																			</tr>
																		</thead>
																		<tbody>
																			{rows.map((row) => (
																				<tr key={`${wordId}-${tense}-${row.person}`}>
																					<td>{row.person}</td>
																					<td class="vocab-verb-form">{row.form}</td>
																					<td>{row.usage}</td>
																				</tr>
																			))}
																		</tbody>
																	</table>
																</div>
															</div>
														) : null}
													</section>
												);
											})}
										</div>
									</section>
								))}
							</div>
							<div
								ref={verbFormsScrollbarRef}
								class={
									verbFormsScrollbarDragging.value
										? "vocab-verb-forms-scrollbar vocab-verb-forms-scrollbar-dragging"
										: "vocab-verb-forms-scrollbar"
								}
								aria-hidden="true"
								onPointerDown$={onScrollbarPointerDown$}
							>
								<span
									class="vocab-verb-forms-scrollbar-thumb"
									style={{
										width: `${verbFormsSliderState.value.thumbWidth}%`,
										left: `${verbFormsSliderState.value.thumbLeft}%`,
									}}
								/>
							</div>
						</div>
					) : (
						<ul class="vocab-verb-examples">
							{insight.examples.map((example, index) => (
								<li key={`${wordId}-example-${index}`} class="vocab-verb-example-row">
									<p class="vocab-verb-example-es">{example.spanish}</p>
									<p class="vocab-verb-example-usage">{example.usage}</p>
								</li>
							))}
						</ul>
					)}
				</section>

				{modalScrollState.value.canScroll ? (
					<button
						type="button"
						class="vocab-verb-scroll-btn"
						aria-label={modalScrollState.value.atBottom ? "Scroll to top" : "Scroll down"}
						onClick$={() => {
							const element = verbModalRef.value;
							if (!element) return;
							if (modalScrollState.value.atBottom) {
								element.scrollTo({ top: 0, behavior: "smooth" });
								return;
							}
							element.scrollTo({
								top: Math.min(
									element.scrollTop + Math.max(Math.round(element.clientHeight * 0.72), 220),
									element.scrollHeight,
								),
								behavior: "smooth",
							});
						}}
					>
						{modalScrollState.value.atBottom ? "↑" : "↓"}
					</button>
				) : null}
			</div>
		</div>
	);
});
