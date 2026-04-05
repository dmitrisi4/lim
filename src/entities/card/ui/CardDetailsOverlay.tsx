import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Card } from "~/entities/card/model/types";
import styles from "~/entities/card/ui/CardDetailsOverlay.css?inline";

type PropsType = {
	card: Card;
	title: string;
	closeLabel: string;
	slides: string[];
	onClose$: PropFunction<() => void>;
};

export const CardDetailsOverlay = component$<PropsType>((props) => {
	const handleClose$ = $(() => props.onClose$());

	useVisibleTask$(({ cleanup }) => {
		const panel = document.querySelector<HTMLElement>(".card-details-panel");
		const closeBtn = panel?.querySelector<HTMLButtonElement>(".card-details-close");
		closeBtn?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") props.onClose$();
		};
		document.addEventListener("keydown", onKey);
		cleanup(() => document.removeEventListener("keydown", onKey));
	});

	return (
		<div
			class="card-details-overlay"
			onClick$={handleClose$}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="card-details-title"
				class="card-details-panel"
				onClick$={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label={props.title}
			>
				<div class="card-details-head">
					<h4 id="card-details-title" class="card-details-title">{props.title}</h4>
					<button type="button" class="card-details-close" onClick$={handleClose$}>
						{props.closeLabel}
					</button>
				</div>

				<div class="card-details-body">
					<div ref={scrollAreaRef} class="card-details-scroll">
						<div class="card-details-scroll-content">
							<p class="card-details-description">{props.card.description}</p>

							{props.slides.length > 0 ? (
								<ul class="card-details-list">
									{props.slides.map((slide, index) => (
										<li key={`${props.card.id}-details-${index}`} class="card-details-item">
											{slide}
										</li>
									))}
								</ul>
							) : null}
						</div>
					</div>

					<div
						ref={scrollbarRef}
						class={
							scrollbarDragging.value
								? "card-details-scrollbar card-details-scrollbar-dragging"
								: scrollbarState.value.canScroll
									? "card-details-scrollbar card-details-scrollbar-active"
									: "card-details-scrollbar"
						}
						onPointerDown$={onScrollbarPointerDown$}
						aria-hidden="true"
					>
						<span
							class="card-details-scrollbar-thumb"
							style={{
								height: `${scrollbarState.value.thumbHeight}%`,
								top: `${scrollbarState.value.thumbTop}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
