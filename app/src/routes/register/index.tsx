import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { RegisterForm } from "~/features/auth/ui/RegisterForm";

export default component$(() => {
	return (
		<div class="register-page">
			<RegisterForm />
		</div>
	);
});

export const head: DocumentHead = {
	title: "Sign Up - Lim",
	meta: [
		{
			name: "description",
			content: "Create a Lim account to track your language learning progress.",
		},
	],
};
