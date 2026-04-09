import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$, routeLoader$, Form, z, zod$ } from "@builder.io/qwik-city";
import { GoogleAuthButton } from "~/features/auth/ui/GoogleAuthButton";
import styles from "./login.css?inline";

export const useAuthLoader = routeLoader$(({ cookie, redirect }) => {
	const isAuth = cookie.get("mock_auth_token")?.value === "true";
	if (isAuth) {
		throw redirect(302, "/path");
	}
	return { isAuth };
});

export const useLoginAction = routeAction$((data, { cookie, redirect }) => {
	if (data.login === "admin" && data.password === "admin") {
		cookie.set("mock_auth_token", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
		throw redirect(302, "/path");
	}
	return {
		success: false,
		message: "Invalid login or password",
	};
}, zod$({
	login: z.string(),
	password: z.string()
}));

export default component$(() => {
	useStylesScoped$(styles);
	const loginAction = useLoginAction();

	return (
		<div class="login-page">
			<div class="login-container">
				<h1 class="login-title">Welcome</h1>
				<p class="login-subtitle">Sign in or register to continue your learning journey.</p>
				
				<Form action={loginAction} class="login-form">
					<div class="form-group">
						<label for="login">Login</label>
						<input id="login" name="login" type="text" placeholder="Enter admin" />
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input id="password" name="password" type="password" placeholder="Enter admin" />
					</div>
					
					{loginAction.value?.message && (
						<p class="error-message">{loginAction.value.message}</p>
					)}
					
					<button type="submit" class="submit-button">Sign In</button>
				</Form>

				<div class="divider">
					<span class="divider-text">Or</span>
				</div>

				<div class="login-actions">
					<GoogleAuthButton />
				</div>
			</div>
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
