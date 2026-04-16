import { component$, useSignal, $, useStylesScoped$, type PropFunction } from "@builder.io/qwik";
import { authProvider } from "~/shared/providers/auth.provider";
import { GoogleAuthButton } from "./GoogleAuthButton";
import styles from "./LoginForm.css?inline";

type PropsType = {
	onSuccess$?: PropFunction<(user: any) => void>;
};

export const LoginForm = component$<PropsType>(({ onSuccess$ }) => {
	useStylesScoped$(styles);
	const email = useSignal("");
	const password = useSignal("");
	const isLoading = useSignal(false);
	const error = useSignal("");

	const handleSubmit = $(async (e: Event) => {
		e.preventDefault();
		isLoading.value = true;
		error.value = "";

		try {
			const user = await authProvider.login({
				email: email.value,
				password: password.value,
			});
			if (onSuccess$) {
				await onSuccess$(user);
			}
			// Redirect or reload
			window.location.href = "/";
		} catch (err: any) {
			error.value = err.response?.data?.message || "Login failed. Please check your credentials.";
		} finally {
			isLoading.value = false;
		}
	});

	return (
		<div class="auth-card">
			<form class="auth-form" onSubmit$={handleSubmit}>
				<header class="auth-header">
					<div class="brand-dot" aria-hidden="true" />
					<h2 class="auth-title">Welcome Back</h2>
					<p class="auth-subtitle">Log in to your account to continue</p>
				</header>

				{error.value && (
					<div class="auth-error">
						<span>{error.value}</span>
					</div>
				)}

				<div class="form-group">
					<label for="email">Email</label>
					<input
						id="email"
						type="email"
						placeholder="name@example.com"
						value={email.value}
						onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
						required
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password.value}
						onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
						required
					/>
				</div>

				<button type="submit" class="submit-button" disabled={isLoading.value}>
					{isLoading.value ? "Logging in..." : "Log In"}
				</button>

				<div class="divider">
					<span>OR</span>
				</div>

				<GoogleAuthButton className="google-btn-full" />

				<p class="auth-footer">
					Don't have an account? <a href="/register">Sign Up</a>
				</p>
			</form>
		</div>
	);
});
