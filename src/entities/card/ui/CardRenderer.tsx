import { $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Card } from "~/entities/card/model/types";
import { isRecapCard } from "~/entities/card/model/guards";
import type { CardCompletionInput } from "~/features/interactions/model/types";
import { useI18n } from "~/shared/i18n/context";
import { Button } from "~/shared/ui/Button";
import { CardShell } from "~/shared/ui/CardShell";
import styles from "~/entities/card/ui/CardRenderer.css?inline";

interface CardRendererProps {
  card: Card;
  isSubmitting?: boolean;
  variant?: "default" | "immersive";
  cardPosition?: number;
  totalCards?: number;
  onComplete$: PropFunction<(payload: CardCompletionInput) => void | Promise<void>>;
}

interface HintTextParts {
  value: string;
  hint?: string;
}

interface RenderHintTextOptions {
  showHintInline?: boolean;
}

type SlideTone = "neutral" | "masculine" | "feminine" | "plural" | "exception";

function normalizeAnswer(raw: string): string {
  const [withoutHint] = raw.split("||");
  return withoutHint.trim().toLowerCase();
}

function parseHintText(raw: string): HintTextParts {
  const parts = raw.split("||");

  if (parts.length <= 1) {
    return { value: raw };
  }

  const value = parts[0].trim();
  const hint = parts.slice(1).join("||").trim();

  return hint ? { value, hint } : { value };
}

function parseConjugationPattern(raw: string): { verb: string; forms: string[] } | null {
  const separatorIndex = raw.indexOf(":");
  if (separatorIndex <= 0) {
    return null;
  }

  const verb = raw.slice(0, separatorIndex).trim();
  const forms = raw
    .slice(separatorIndex + 1)
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (!verb || forms.length < 5 || forms.length > 6) {
    return null;
  }

  return { verb, forms };
}

function resolveSlideTone(raw: string): SlideTone {
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

function toneBadge(tone: SlideTone): string | null {
  if (tone === "masculine") {
    return "M";
  }

  if (tone === "feminine") {
    return "F";
  }

  if (tone === "plural") {
    return "PL";
  }

  if (tone === "exception") {
    return "EX";
  }

  return null;
}

function toneLabel(tone: SlideTone): string | null {
  if (tone === "masculine") {
    return "Masculino";
  }

  if (tone === "feminine") {
    return "Femenino";
  }

  if (tone === "plural") {
    return "Plural";
  }

  if (tone === "exception") {
    return "Excepcion";
  }

  return null;
}

export const CardRenderer = component$<CardRendererProps>((props) => {
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
      correct
    });
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

  const toggleHint$ = $((event: Event, hintId: string) => {
    event.preventDefault();
    event.stopPropagation();
    openedHintId.value = openedHintId.value === hintId ? null : hintId;
  });

  const toggleHintsMode$ = $(() => {
    hintsEnabled.value = !hintsEnabled.value;
    if (!hintsEnabled.value) {
      openedHintId.value = null;
    }
  });

  const rawSlides = props.card.payload?.slides ?? [];
  const hasExamples = rawSlides.length > 1;
  const isRuleExamplesMode = props.card.type === "carousel" && props.card.payload?.focusMode === "rule_examples" && hasExamples;
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
  const isCompact = props.variant === "immersive" && (rawSlides.length >= 6 || textVolume > 780 || interactionOptions.length >= 4);
  const canOpenDetails = rawSlides.length > 0 || props.card.description.length > 180;

  const visibleSlides = isRuleExamplesMode
    ? contentMode.value === "rule"
      ? rawSlides.slice(0, ruleSlidesCount)
      : rawSlides.slice(ruleSlidesCount)
    : rawSlides;
  const examplesCount = isRuleExamplesMode ? rawSlides.length - ruleSlidesCount : 0;

  const totalCards = props.totalCards ?? 0;
  const cardPosition = props.cardPosition ?? 0;
  const progressPercent = totalCards > 0 ? Math.max(0, Math.min(100, Math.round((cardPosition / totalCards) * 100))) : 0;

  const renderHintText = (raw: string, hintIdPrefix: string, options?: RenderHintTextOptions) => {
    const parsed = parseHintText(raw);
    const hintId = `${hintIdPrefix}-hint`;
    const expanded = openedHintId.value === hintId;
    const showHintInline = options?.showHintInline ?? false;
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
                <span key={`${hintIdPrefix}-conj-${index}`} class="conjugation-row">
                  <span class="conjugation-label">{conjugationLabels[index] ?? `forma ${index + 1}`}</span>
                  <span class="conjugation-form">{form}</span>
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span class="hint-value">{parsed.value}</span>
        )}
        {parsed.hint && showHintInline ? <span class="hint-inline-note">{parsed.hint}</span> : null}
        {parsed.hint && !showHintInline && hintsEnabled.value ? (
          <span class="hint-anchor">
            <button
              type="button"
              class="hint-badge"
              aria-expanded={expanded}
              aria-controls={hintId}
              onClick$={(event) => toggleHint$(event, hintId)}
            >
              RU
            </button>
            {expanded ? (
              <span id={hintId} class="hint-popover" role="note">
                {parsed.hint}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    );
  };

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
                class={contentMode.value === "examples" ? "mode-toggle-btn is-active" : "mode-toggle-btn"}
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
            onClick$={toggleHintsMode$}
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

      <h3 class={props.variant === "immersive" ? "card-title card-title-immersive" : "card-title"}>{props.card.title}</h3>
      <p class={props.variant === "immersive" ? "card-description card-description-immersive" : "card-description"}>
        {props.card.description}
      </p>

      {visibleSlides.length > 0 ? (
        <ul class={props.variant === "immersive" ? "slides-list slides-list-immersive" : "slides-list"}>
          {visibleSlides.map((slide, localIndex) => {
            const originalIndex = isRuleExamplesMode && contentMode.value === "examples" ? localIndex + ruleSlidesCount : localIndex;
            const tone = resolveSlideTone(parseHintText(slide).value);
            const badge = toneBadge(tone);
            const badgeLabel = toneLabel(tone);

            return (
              <li key={`${props.card.id}-slide-${originalIndex}`} class={`slides-item slides-item-${tone}`}>
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
                  {renderHintText(slide, `${props.card.id}-slide-${originalIndex}`, {
                    showHintInline: isRuleExamplesMode && contentMode.value === "rule"
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {hasInlineInteraction ? <p class="micro-title">{ui.cardMiniChallenge}</p> : null}

      {props.card.interaction?.prompt ? (
        <p class={props.variant === "immersive" ? "interaction-prompt interaction-prompt-immersive" : "interaction-prompt"}>
          {renderHintText(props.card.interaction.prompt, `${props.card.id}-prompt`)}
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
              {renderHintText(option, `${props.card.id}-option-${optionIndex}`)}
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
        <div
          class="card-details-overlay"
          onClick$={() => {
            detailsOpen.value = false;
          }}
        >
          <div
            class="card-details-panel"
            onClick$={(event) => {
              event.stopPropagation();
            }}
          >
            <div class="card-details-head">
              <h4 class="card-details-title">{props.card.title}</h4>
              <button
                type="button"
                class="card-details-close"
                onClick$={() => {
                  detailsOpen.value = false;
                }}
              >
                {ui.cardCloseDetails}
              </button>
            </div>
            <p class="card-details-description">{props.card.description}</p>

            {rawSlides.length > 0 ? (
              <ul class="card-details-list">
                {rawSlides.map((slide, index) => (
                  <li key={`${props.card.id}-details-${index}`} class="card-details-item">
                    {renderHintText(slide, `${props.card.id}-details-slide-${index}`)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </CardShell>
  );
});
