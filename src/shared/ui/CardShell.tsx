import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "~/shared/ui/CardShell.css?inline";

interface CardShellProps {
  cardType: string;
  variant?: "default" | "immersive";
}

export const CardShell = component$<CardShellProps>((props) => {
  useStylesScoped$(styles);

  const className = props.variant === "immersive" ? "card-shell immersive" : "card-shell";

  return (
    <article class={className}>
      <p class="card-type">{props.cardType}</p>
      <Slot />
    </article>
  );
});
