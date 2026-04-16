import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LoginForm } from "~/features/auth/ui/LoginForm";

export default component$(() => {
	return (
		<div class="login-page">
			<LoginForm />
		</div>
	);
});

export const head: DocumentHead = {
	title: "Login - Lim",
	meta: [
		{
			name: "description",
			content: "Login to your Lim account",
		},
	],
};
