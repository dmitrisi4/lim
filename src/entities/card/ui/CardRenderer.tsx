import { $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Card } from "~/entities/card/model/types";
import { isRecapCard } from "~/entities/card/model/guards";
import type { CardCompletionInput } from "~/features/interactions/model/types";
import { useI18n } from "~/shared/i18n/context";
import { Button } from "~/shared/ui/Button";
import { CardShell } from "~/shared/ui/CardShell";
import { HintText } from "~/entities/card/ui/HintText";
import { CardDetailsOverlay } from "~/entities/card/ui/CardDetailsOverlay";
import { normalizeAnswer, resolveSlideTone, toneBadge, toneLabel } from "~/entities/card/lib/card-parsers";
import styles from "~/entities/card/ui/CardRenderer.css?inline";

type PropsType = {
	card: Card;
	isSubmitting?: boolean;
	variant?: "default" | "immersive";
	cardPosition?: number;
	totalCards?: number;
	onComplete$: PropFunction<(payload: CardCompletionInput) => void | Promise<void>>;
};

export const CardRenderer = component$<PropsType>((props) => {
	useStylesScoped$(styles);
	const { ui } = useI18n();
	const selectedAnswer = useSignal("");
	const openedHintId = useSignal<string | null>(null);
	const hintsEnabled = useSignal(false);
	const contentMode = useSignal<"rule" | "examples">("rule");
	const detailsOpen = useSignal(false);

	const complete$ = $(async (answer?: string) => {
		const expected = props.card.interaction?.correctAnswer;
		const correct =
			typeof expected === "string" && expected.length > 0
				? answer
					? normalizeAnswer(answer) === normalizeAnswer(expected)
					: false
				: null;

		await props.onComplete$({
			cardId: props.card.id,
			cardType: props.card.type,
			answer,
			correct,
		});
	});

	const toggleHint$ = $((hintId: string) => {
		openedHintId.value = openedHintId.value === hintId ? null : hintId;
	});

	const interactionOptions = props.card.interaction?.options ?? [];
	const hasInlineInteraction = interactionOptions.length > 0;
	const shouldRequireAnswer = hasInlineInteraction;

	const interactiveLabel = hasInlineInteraction
		? ui.cardCheck
		: props.card.type === "match"
			? ui.cardSubmitMatch
			: props.card.type === "mini_game"
				? ui.cardFinishMiniGame
				: props.card.type === "quiz"
					? ui.cardCheck
					: ui.cardMarkDone;

	const rawSlides = props.card.payload?.slides ?? [];
	const hasExamples = rawSlides.length > 1;
	const isRuleExamplesMode =
		props.card.type === "carousel" &&
		props.card.payload?.focusMode === "rule_examples" &&
		hasExamples;
	const maxRuleSlides = Math.max(1, rawSlides.length - 1);
	const requestedRuleSlides = props.card.payload?.ruleSlidesCount ?? 1;
	const ruleSlidesCount = isRuleExamplesMode
		? Math.max(1, Math.min(requestedRuleSlides, maxRuleSlides))
		: rawSlides.length;

	const textVolume =
		props.card.title.length +
		props.card.description.length +
		rawSlides.reduce((sum, slide) => sum + slide.length, 0) +
		(props.card.interaction?.prompt?.length ?? 0) +
		interactionOptions.reduce((sum, option) => sum + option.length, 0);

	const isCompact =
		props.variant === "immersive" &&
		(rawSlides.length >= 6 || textVolume > 780 || interactionOptions.length >= 4);
	const canOpenDetails = rawSlides.length > 0 || props.card.description.length > 180;

	const visibleSlides = isRuleExamplesMode
		? contentMode.value === "rule"
			? rawSlides.slice(0, ruleSlidesCount)
			: rawSlides.slice(ruleSlidesCount)
		: rawSlides;
	const examplesCount = isRuleExamplesMode ? rawSlides.length - ruleSlidesCount : 0;

	const totalCards = props.totalCards ?? 0;
	const cardPosition = props.cardPosition ?? 0;
	const progressPercent =
		totalCards > 0 ? Math.max(0, Math.min(100, Math.round((cardPosition / totalCards) * 100))) : 0;

	return (
		<CardShell cardType={props.card.type} variant={props.variant}>
			<div class={isCompact ? "card-body card-body-compact" : "card-body"}>
				{totalCards > 0 && cardPosition > 0 ? (
					<div class="card-progress-row">
						<div class="card-progress-track" aria-hidden="true">
							<span class="card-progress-fill" style={{ width: `${progressPercent}%` }} />
						</div>
						<p class="card-progress-text">
							{cardPosition} / {totalCards}
						</p>
					</div>
				) : null}

				<div class="card-toolbar">
					<div class="card-toolbar-left">
						{isRuleExamplesMode ? (
							<div class="mode-toggle" role="tablist" aria-label={ui.cardMiniChallenge}>
								<button
									type="button"
									class={contentMode.value === "rule" ? "mode-toggle-btn is-active" : "mode-toggle-btn"}
									onClick$={() => {
										contentMode.value = "rule";
									}}
								>
									{ui.cardShowRule}
								</button>
								<button
									type="button"
									class={
										contentMode.value === "examples" ? "mode-toggle-btn is-active" : "mode-toggle-btn"
									}
									onClick$={() => {
										contentMode.value = "examples";
									}}
								>
									{ui.cardShowExamples}
								</button>
							</div>
						) : null}

						{canOpenDetails ? (
							<button
								type="button"
								class="details-toggle"
								onClick$={() => {
									detailsOpen.value = true;
								}}
							>
								{ui.cardOpenDetails}
							</button>
						) : null}
					</div>

					<div class="card-toolbar-right">
						<button
							type="button"
							class={hintsEnabled.value ? "hint-switch hint-switch-on" : "hint-switch"}
							onClick$={() => {
								hintsEnabled.value = !hintsEnabled.value;
								if (!hintsEnabled.value) openedHintId.value = null;
							}}
						>
							{hintsEnabled.value ? ui.cardHintsHide : ui.cardHintsShow}
						</button>
					</div>
				</div>

				{isRuleExamplesMode ? (
					<p class="mode-meta">
						{ui.cardShowRule}: {ruleSlidesCount} · {ui.cardShowExamples}: {examplesCount}
					</p>
				) : null}

				<h3 class={props.variant === "immersive" ? "card-title card-title-immersive" : "card-title"}>
					{props.card.title}
				</h3>
				<p class={props.variant === "immersive" ? "card-description card-description-immersive" : "card-description"}>
					{props.card.description}
				</p>

				{visibleSlides.length > 0 ? (
					<ul class={props.variant === "immersive" ? "slides-list slides-list-immersive" : "slides-list"}>
						{visibleSlides.map((slide, localIndex) => {
							const originalIndex =
								isRuleExamplesMode && contentMode.value === "examples"
									? localIndex + ruleSlidesCount
									: localIndex;
							const tone = resolveSlideTone(slide);
							const badge = toneBadge(tone);
							const badgeLabel = toneLabel(tone);

							return (
								<li
									key={`${props.card.id}-slide-${originalIndex}`}
									class={`slides-item slides-item-${tone}`}
								>
									{badge ? (
										<span
											class={`slides-tone slides-tone-${tone}`}
											data-label={badgeLabel ?? undefined}
											aria-label={badgeLabel ?? undefined}
											tabIndex={0}
										>
											{badge}
										</span>
									) : null}
									<span class="slides-item-text">
										<HintText
											raw={slide}
											hintId={`${props.card.id}-slide-${originalIndex}`}
											showHintInline={isRuleExamplesMode && contentMode.value === "rule"}
											hintsEnabled={hintsEnabled.value}
											isOpenedHint={openedHintId.value === `${props.card.id}-slide-${originalIndex}-hint`}
											onToggleHint$={toggleHint$}
										/>
									</span>
								</li>
							);
						})}
					</ul>
				) : null}

				{hasInlineInteraction ? <p class="micro-title">{ui.cardMiniChallenge}</p> : null}

				{props.card.interaction?.prompt ? (
					<p
						class={
							props.variant === "immersive"
								? "interaction-prompt interaction-prompt-immersive"
								: "interaction-prompt"
						}
					>
						<HintText
							raw={props.card.interaction.prompt}
							hintId={`${props.card.id}-prompt`}
							hintsEnabled={hintsEnabled.value}
							isOpenedHint={openedHintId.value === `${props.card.id}-prompt-hint`}
							onToggleHint$={toggleHint$}
						/>
					</p>
				) : null}

				{hasInlineInteraction ? (
					<div class={props.variant === "immersive" ? "options-wrap options-wrap-immersive" : "options-wrap"}>
						{interactionOptions.map((option, optionIndex) => (
							<label
								key={`${props.card.id}-${option}`}
								class={props.variant === "immersive" ? "option-row option-row-immersive" : "option-row"}
							>
								<input
									type="radio"
									name={`option-${props.card.id}`}
									value={option}
									checked={selectedAnswer.value === option}
									onChange$={(event) => {
										selectedAnswer.value = (event.target as HTMLInputElement).value;
									}}
								/>
								<HintText
									raw={option}
									hintId={`${props.card.id}-option-${optionIndex}`}
									hintsEnabled={hintsEnabled.value}
									isOpenedHint={openedHintId.value === `${props.card.id}-option-${optionIndex}-hint`}
									onToggleHint$={toggleHint$}
								/>
							</label>
						))}
					</div>
				) : null}

				{isRecapCard(props.card) ? <div class="recap-note">{ui.cardRecapNote}</div> : null}

				<div class={props.variant === "immersive" ? "footer-row footer-row-immersive" : "footer-row"}>
					<p class="reward-text">
						{ui.cardRewardPrefix}: +{props.card.reward?.xp ?? 5} XP
					</p>
					<Button
						disabled={props.isSubmitting || (shouldRequireAnswer && !selectedAnswer.value)}
						onClick$={() => complete$(selectedAnswer.value || undefined)}
					>
						{interactiveLabel}
					</Button>
				</div>
			</div>

			{detailsOpen.value ? (
				<CardDetailsOverlay
					card={props.card}
					title={props.card.title}
					closeLabel={ui.cardCloseDetails}
					slides={rawSlides}
					onClose$={() => {
						detailsOpen.value = false;
					}}
				/>
			) : null}
		</CardShell>
	);
});
