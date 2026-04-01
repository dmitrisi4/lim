import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { ReadonlySignal } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type {
	LanguageMapChatMessage,
	LanguageMapChatMode,
	LanguageMapChatResponse,
} from "~/features/language-map/model/chat";
import type { LanguageMapNode } from "~/features/language-map/model/graph";
import { httpPost } from "~/shared/api/client";
import { endpoints } from "~/shared/api/endpoints";
import { toChatNodeContext, buildSelectNodeMessage, buildProviderErrorMessage } from "~/features/language-map/lib/chat-utils";

type ChatRole = "assistant" | "user";

interface ChatMessage {
	id: string;
	role: ChatRole;
	text: string;
}

type PropsType = {
	language: "en" | "es";
	/** The currently active chat node — pass a Signal containing the node object (or undefined). */
	activeNode: ReadonlySignal<LanguageMapNode | undefined>;
	ui: {
		mapChatTitle: string;
		mapChatSubtitle: string;
		mapChatContext: string;
		mapChatNoContext: string;
		mapChatEmptyState: string;
		mapChatAssistant: string;
		mapChatYou: string;
		mapChatThinking: string;
		mapChatInputPlaceholder: string;
		mapChatSend: string;
	};
	onChatPendingChange$?: PropFunction<(pending: boolean) => void>;
};

export const LanguageMapChat = component$<PropsType>((props) => {
	const chatMessages = useSignal<ChatMessage[]>([]);
	const chatInput = useSignal("");
	const chatPending = useSignal(false);
	const chatMessageCounter = useSignal(0);
	const chatThreadRef = useSignal<HTMLElement>();

	useVisibleTask$(({ track }) => {
		track(() => chatMessages.value.length);
		track(() => chatPending.value);

		const thread = chatThreadRef.value;
		if (!thread) return;
		thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
	});

	const chatNode = props.activeNode.value;
	const { language, ui } = props;

	const sendMessage$ = $(async (question: string) => {
		if (question.length === 0 || chatPending.value) return;

		const userId = chatMessageCounter.value + 1;
		const userMessage: ChatMessage = { id: `map-chat-${userId}`, role: "user", text: question };
		chatMessages.value = [...chatMessages.value, userMessage];
		chatMessageCounter.value = userId;
		chatInput.value = "";

		const currentNode = props.activeNode.value;
		if (!currentNode) {
			const assistantId = chatMessageCounter.value + 1;
			chatMessages.value = [
				...chatMessages.value,
				{ id: `map-chat-${assistantId}`, role: "assistant", text: buildSelectNodeMessage(language) },
			];
			chatMessageCounter.value = assistantId;
			return;
		}

		chatPending.value = true;
		props.onChatPendingChange$?.(true);

		const historyPayload: LanguageMapChatMessage[] = [...chatMessages.value].slice(-10).map((m) => ({
			role: m.role,
			text: m.text,
		}));

		try {
			const response = await httpPost<LanguageMapChatResponse>(endpoints.languageMapChat, {
				language,
				mode: "follow_up" satisfies LanguageMapChatMode,
				message: question,
				node: toChatNodeContext(currentNode),
				history: historyPayload,
			});

			const assistantId = chatMessageCounter.value + 1;
			chatMessages.value = [
				...chatMessages.value,
				{
					id: `map-chat-${assistantId}`,
					role: "assistant",
					text: response.ok && response.answer ? response.answer : buildProviderErrorMessage(language),
				},
			];
			chatMessageCounter.value = assistantId;
		} catch (_error) {
			const assistantId = chatMessageCounter.value + 1;
			chatMessages.value = [
				...chatMessages.value,
				{ id: `map-chat-${assistantId}`, role: "assistant", text: buildProviderErrorMessage(language) },
			];
			chatMessageCounter.value = assistantId;
		} finally {
			chatPending.value = false;
			props.onChatPendingChange$?.(false);
		}
	});

	return (
		<section class="node-chat" aria-label={ui.mapChatTitle}>
			<header class="node-chat-head">
				<h3 class="node-chat-title">{ui.mapChatTitle}</h3>
				<p class="node-chat-subtitle">{ui.mapChatSubtitle}</p>
				<p class="node-chat-context">
					{chatNode ? `${ui.mapChatContext}: ${chatNode.label}` : ui.mapChatNoContext}
				</p>
			</header>

			<div ref={chatThreadRef} class="node-chat-thread" aria-live="polite">
				{chatMessages.value.length === 0 ? (
					<p class="node-chat-empty">{ui.mapChatEmptyState}</p>
				) : (
					chatMessages.value.map((message) => (
						<article
							key={message.id}
							class={message.role === "assistant" ? "node-chat-message assistant" : "node-chat-message user"}
						>
							<p class="node-chat-role">
								{message.role === "assistant" ? ui.mapChatAssistant : ui.mapChatYou}
							</p>
							<p class="node-chat-text">{message.text}</p>
						</article>
					))
				)}

				{chatPending.value ? (
					<article class="node-chat-message assistant thinking" role="status" aria-live="polite">
						<p class="node-chat-role">{ui.mapChatAssistant}</p>
						<p class="node-chat-text">{ui.mapChatThinking}</p>
					</article>
				) : null}
			</div>

			<form
				class="node-chat-form"
				preventdefault:submit
				onSubmit$={() => sendMessage$(chatInput.value.trim())}
			>
				<input
					type="text"
					class="node-chat-input"
					value={chatInput.value}
					placeholder={ui.mapChatInputPlaceholder}
					onInput$={(event) => {
						chatInput.value = (event.target as HTMLInputElement).value;
					}}
					disabled={chatPending.value}
				/>
				<button
					type="submit"
					class="node-chat-send"
					disabled={chatInput.value.trim().length === 0 || chatPending.value}
				>
					{ui.mapChatSend}
				</button>
			</form>
		</section>
	);
});
