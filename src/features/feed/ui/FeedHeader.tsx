import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { InteractionSubmitResult, ProgressSnapshot } from "~/features/interactions/model/types";
import { ProgressPill } from "~/features/gamification/ui/ProgressPill";
import { StreakBadge } from "~/features/gamification/ui/StreakBadge";
import { useI18n } from "~/shared/i18n/context";
import styles from "~/features/feed/ui/FeedHeader.css?inline";

interface FeedHeaderProps {
  progress: ProgressSnapshot;
  lastSubmit?: InteractionSubmitResult;
}

export const FeedHeader = component$<FeedHeaderProps>((props) => {
  useStylesScoped$(styles);
  const { ui } = useI18n();

  return (
    <div class="panel">
      <div>
        <h2 class="title">{ui.feedTitle}</h2>
        <p class="subtitle">{ui.feedSubtitle}</p>
      </div>

      <div class="stats-grid">
        <ProgressPill
          xp={props.progress.xp}
          level={props.progress.level}
          dailyCompleted={props.progress.dailyCompleted}
          dailyGoal={props.progress.dailyGoal}
        />
        <StreakBadge days={props.progress.streakDays} />
      </div>

      {props.lastSubmit ? (
        <div class="submit-note">
          <p class="submit-title">{props.lastSubmit.message}</p>
          <p class="submit-meta">
            +{props.lastSubmit.xpDelta} XP{props.lastSubmit.streakDelta !== 0 ? ` · streak ${props.lastSubmit.streakDelta > 0 ? "+" : ""}${props.lastSubmit.streakDelta}` : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
});
