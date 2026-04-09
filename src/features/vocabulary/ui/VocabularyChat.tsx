import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { ReadonlySignal } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { VocabularyChatMessage, VocabularyChatMode, VocabularyChatResponse } from "~/features/vocabulary/model/chat";
import type { VocabularyWord } from "~/features/vocabulary/model/word-bank";
import { resolveWordSections } from "~/features/vocabulary/model/word-bank";

import { buildProviderErrorMessage, buildSelectCardMessage } from "~/features/vocabulary/lib/chat-utils";

type ChatRole = "assistant" | "user";

interface ChatMessage {
	id: string;
	role: ChatRole;
	text: string;
}

type PropsType = {
	language: "en" | "es";
	activeWord: ReadonlySignal<VocabularyWord | undefined>;
	chatMessages: ReadonlySignal<ChatMessage[]>;
	chatPending: ReadonlySignal<boolean>;
	chatCollapsed: boolean;
	ui: {
		vocabAiTitle: string;
		vocabAiSubtitle: string;
		vocabAiEmptyState: string;
		vocabAiAssistant: string;
		vocabAiYou: string;
		vocabAiThinking: string;
		vocabAiInputPlaceholder: string;
		vocabAiSend: string;
		vocabAiExpand: string;
		vocabAiCollapse: string;
	};
	onToggleCollapse$: PropFunction<() => void>;
	onSendMessage$: PropFunction<(message: string) => void | Promise<void>>;
};

export const VocabularyChat = component$<PropsType>((props) => {
	const chatInput = useSignal("");
	const chatThreadRef = useSignal<HTMLElement>();

	const { ui } = props;
	const aiPanelClass = props.chatCollapsed ? "vocabulary-ai collapsed" : "vocabulary-ai";

	useVisibleTask$(({ track }) => {
		track(() => props.chatMessages.value.length);
		track(() => props.chatPending.value);

		const thread = chatThreadRef.value;
		if (!thread) return;
		thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
	});

	return (
		<aside class={aiPanelClass} aria-label={ui.vocabAiTitle}>
			<button
				type="button"
				class="vocabulary-ai-toggle"
				aria-expanded={!props.chatCollapsed}
				aria-label={props.chatCollapsed ? ui.vocabAiExpand : ui.vocabAiCollapse}
				title={props.chatCollapsed ? ui.vocabAiExpand : ui.vocabAiCollapse}
				onClick$={() => props.onToggleCollapse$()}
			>
				<span class="vocabulary-ai-toggle-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" role="presentation">
						<path d="M8 6.5v11" />
						<path d="m11 8.5 5 3.5-5 3.5" />
					</svg>
				</span>
			</button>

			<div class="vocabulary-ai-content" aria-hidden={props.chatCollapsed ? "true" : "false"}>
				<header class="vocabulary-ai-head">
					<h3 class="vocabulary-ai-title">{ui.vocabAiTitle}</h3>
					<p class="vocabulary-ai-subtitle">{ui.vocabAiSubtitle}</p>
					<p class="vocabulary-ai-context">
						{props.activeWord.value
							? `${props.activeWord.value.term} - ${props.activeWord.value.translation}`
							: ui.vocabAiEmptyState}
					</p>
				</header>

				<div ref={chatThreadRef} class="vocabulary-ai-thread" aria-live="polite">
					{props.chatMessages.value.length === 0 ? (
						<p class="vocabulary-ai-empty">{ui.vocabAiEmptyState}</p>
					) : (
						props.chatMessages.value.map((message) => (
							<article
								key={message.id}
								class={
									message.role === "assistant"
										? "vocabulary-ai-message assistant"
										: "vocabulary-ai-message user"
								}
							>
								<p class="vocabulary-ai-role">
									{message.role === "assistant" ? ui.vocabAiAssistant : ui.vocabAiYou}
								</p>
								<p class="vocabulary-ai-text">{message.text}</p>
							</article>
						))
					)}

					{props.chatPending.value ? (
						<article class="vocabulary-ai-message assistant thinking" role="status" aria-live="polite">
							<p class="vocabulary-ai-role">{ui.vocabAiAssistant}</p>
							<div class="vocabulary-ai-thinking">
								<span class="vocabulary-ai-thinking-label">{ui.vocabAiThinking}</span>
								<span class="vocabulary-ai-thinking-dots" aria-hidden="true">
									<span class="vocabulary-ai-thinking-dot" />
									<span class="vocabulary-ai-thinking-dot" />
									<span class="vocabulary-ai-thinking-dot" />
								</span>
							</div>
						</article>
					) : null}
				</div>

				<form
					class="vocabulary-ai-form"
					preventdefault:submit
					onSubmit$={() => {
						const question = chatInput.value.trim();
						if (question.length === 0 || props.chatPending.value) return;

						void props.onSendMessage$(question);
						chatInput.value = "";
					}}
				>
					<input
						type="text"
						class="vocabulary-ai-input"
						placeholder={ui.vocabAiInputPlaceholder}
						value={chatInput.value}
						onInput$={(event) => {
							chatInput.value = (event.target as HTMLInputElement).value;
						}}
						disabled={props.chatPending.value || props.chatCollapsed}
					/>
					<button
						type="submit"
						class="vocabulary-ai-send"
						disabled={chatInput.value.trim().length === 0 || props.chatPending.value || props.chatCollapsed}
					>
						{props.chatPending.value ? "..." : ui.vocabAiSend}
					</button>
				</form>
			</div>
		</aside>
	);
});
