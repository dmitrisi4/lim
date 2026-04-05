import { $, component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
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
	useStylesScoped$(styles);
	const scrollAreaRef = useSignal<HTMLElement>();
	const scrollbarRef = useSignal<HTMLElement>();
	const scrollbarDragging = useSignal(false);
	const scrollbarState = useSignal({ thumbHeight: 100, thumbTop: 0, canScroll: false });

	useVisibleTask$(({ track, cleanup }) => {
		track(() => props.card.id);
		track(() => scrollAreaRef.value);

		const element = scrollAreaRef.value;
		if (!element) {
			scrollbarState.value = { thumbHeight: 100, thumbTop: 0, canScroll: false };
			return;
		}

		const updateScrollbarState = () => {
			const visibleHeight = Math.max(element.clientHeight, 1);
			const totalHeight = Math.max(element.scrollHeight, visibleHeight);
			const maxScrollTop = Math.max(totalHeight - visibleHeight, 0);
			const canScroll = maxScrollTop > 8;
			const rawThumbHeight = (visibleHeight / totalHeight) * 100;
			const thumbHeight = Math.min(100, Math.max(rawThumbHeight, canScroll ? 16 : 100));
			const thumbTravel = Math.max(100 - thumbHeight, 0);
			const progress = maxScrollTop > 0 ? element.scrollTop / maxScrollTop : 0;
			const thumbTop = thumbTravel * progress;

			scrollbarState.value = {
				thumbHeight,
				thumbTop: Number.isFinite(thumbTop) ? thumbTop : 0,
				canScroll,
			};
		};

		updateScrollbarState();

		element.addEventListener("scroll", updateScrollbarState, { passive: true });
		window.addEventListener("resize", updateScrollbarState);
		const resizeObserver = new ResizeObserver(() => updateScrollbarState());
		resizeObserver.observe(element);
		const rafId = window.requestAnimationFrame(() => updateScrollbarState());

		cleanup(() => {
			window.cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
			element.removeEventListener("scroll", updateScrollbarState);
			window.removeEventListener("resize", updateScrollbarState);
		});
	});

	const onScrollbarPointerDown$ = $(async (event: PointerEvent) => {
		const scrollArea = scrollAreaRef.value;
		const scrollbar = scrollbarRef.value;
		if (!scrollArea || !scrollbar) return;

		event.preventDefault();
		scrollbarDragging.value = true;

		const scrollbarRect = scrollbar.getBoundingClientRect();
		const trackHeight = Math.max(scrollbarRect.height, 1);
		const maxScrollTop = Math.max(scrollArea.scrollHeight - scrollArea.clientHeight, 0);
		const thumbHeightPx = (scrollbarState.value.thumbHeight / 100) * trackHeight;
		const maxThumbTopPx = Math.max(trackHeight - thumbHeightPx, 0);

		const syncScrollByClientY = (clientY: number) => {
			if (maxScrollTop <= 0 || maxThumbTopPx <= 0) {
				scrollArea.scrollTo({ top: 0, behavior: "auto" });
				return;
			}

			const thumbTopPx = Math.min(
				Math.max(clientY - scrollbarRect.top - thumbHeightPx * 0.5, 0),
				maxThumbTopPx,
			);
			scrollArea.scrollTo({ top: (thumbTopPx / maxThumbTopPx) * maxScrollTop, behavior: "auto" });
		};

		syncScrollByClientY(event.clientY);

		const onPointerMove = (moveEvent: PointerEvent) => {
			moveEvent.preventDefault();
			syncScrollByClientY(moveEvent.clientY);
		};

		const stopDragging = () => {
			scrollbarDragging.value = false;
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", stopDragging);
			window.removeEventListener("pointercancel", stopDragging);
		};

		window.addEventListener("pointermove", onPointerMove, { passive: false });
		window.addEventListener("pointerup", stopDragging);
		window.addEventListener("pointercancel", stopDragging);
	});

	return (
		<div
			class="card-details-overlay"
			onClick$={() => props.onClose$()}
		>
			<div
				class="card-details-panel"
				onClick$={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label={props.title}
			>
				<div class="card-details-head">
					<h4 class="card-details-title">{props.title}</h4>
					<button type="button" class="card-details-close" onClick$={() => props.onClose$()}>
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
