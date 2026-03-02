import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "~/features/gamification/ui/StreakBadge.css?inline";

interface StreakBadgeProps {
  days: number;
}

export const StreakBadge = component$<StreakBadgeProps>((props) => {
  useStylesScoped$(styles);

  return (
    <div class="badge">
      <p class="badge-label">Streak</p>
      <p class="badge-days">{props.days} days</p>
      <p class="badge-text">Держи серию, чтобы получать бонусные карточки.</p>
    </div>
  );
});
