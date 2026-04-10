import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import styles from "~/shared/ui/Button.css?inline";

interface ButtonProps {
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  disabled?: boolean;
  onClick$?: PropFunction<() => void | Promise<void>>;
}

export const Button = component$<ButtonProps>((props) => {
  useStylesScoped$(styles);

  const variant = props.variant ?? "primary";
  const className = variant === "outline" ? "btn btn-outline" : "btn btn-primary";

  return (
    <button type={props.type ?? "button"} class={className} disabled={props.disabled} onClick$={props.onClick$}>
      <Slot />
    </button>
  );
});
