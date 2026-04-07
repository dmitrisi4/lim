import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "~/features/gamification/ui/StreakBadge.css?inline";

interface StreakBadgeProps {
  days: number;
  label: string;
  daysSuffix: string;
  motivation: string;
}

export const StreakBadge = component$<StreakBadgeProps>((props) => {
  useStylesScoped$(styles);

  return (
    <div class="badge">
      <p class="badge-label">{props.label}</p>
      <p class="badge-days">{props.days} {props.daysSuffix}</p>
      <p class="badge-text">{props.motivation}</p>
    </div>
  );
});
