import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { clamp } from "~/shared/lib/numbers";
import styles from "~/features/gamification/ui/ProgressPill.css?inline";

interface ProgressPillProps {
  xp: number;
  level: number;
  dailyCompleted: number;
  dailyGoal: number;
}

export const ProgressPill = component$<ProgressPillProps>((props) => {
  useStylesScoped$(styles);

  const completionPercent = Math.round((clamp(props.dailyCompleted, 0, props.dailyGoal) / props.dailyGoal) * 100);

  return (
    <div class="pill">
      <p class="pill-label">Прогресс</p>
      <p class="pill-title">
        XP {props.xp} · Level {props.level}
      </p>
      <p class="pill-meta">
        Daily goal: {props.dailyCompleted}/{props.dailyGoal} ({completionPercent}%)
      </p>
    </div>
  );
});
