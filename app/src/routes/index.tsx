import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { LoginForm } from "~/features/auth/ui/LoginForm";

export const useAuthLoader = routeLoader$(({ cookie, redirect }) => {
	const isAuth = !!cookie.get("token")?.value;
	if (isAuth) {
		throw redirect(302, "/path");
	}
	return { isAuth };
});

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
			content: "Login to Lim to track your progress and access exclusive features",
		},
	],
};
