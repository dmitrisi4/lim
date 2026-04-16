import { component$, useSignal, $, useStylesScoped$, type PropFunction } from "@builder.io/qwik";
import { authProvider } from "~/shared/providers/auth.provider";
import { GoogleAuthButton } from "./GoogleAuthButton";
import styles from "./LoginForm.css?inline";

type PropsType = {
	onSuccess$?: PropFunction<(user: any) => void>;
};

export const RegisterForm = component$<PropsType>(({ onSuccess$ }) => {
	useStylesScoped$(styles);
	const name = useSignal("");
	const email = useSignal("");
	const password = useSignal("");
	const isLoading = useSignal(false);
	const error = useSignal("");

	const handleSubmit = $(async (e: Event) => {
		e.preventDefault();
		isLoading.value = true;
		error.value = "";

		try {
			const user = await authProvider.register({
				name: name.value,
				email: email.value,
				password: password.value,
			});
			if (onSuccess$) {
				await onSuccess$(user);
			}
			window.location.href = "/";
		} catch (err: any) {
			error.value = err.response?.data?.message || "Registration failed. Please try again.";
		} finally {
			isLoading.value = false;
		}
	});

	return (
		<div class="auth-card">
			<form class="auth-form" onSubmit$={handleSubmit}>
				<header class="auth-header">
					<div class="brand-dot" aria-hidden="true" />
					<h2 class="auth-title">Create Account</h2>
					<p class="auth-subtitle">Join Lim to track your progress</p>
				</header>

				{error.value && (
					<div class="auth-error">
						<span>{error.value}</span>
					</div>
				)}

				<div class="form-group">
					<label for="name">Full Name</label>
					<input
						id="name"
						type="text"
						placeholder="Alex Johnson"
						value={name.value}
						onInput$={(e) => (name.value = (e.target as HTMLInputElement).value)}
						required
					/>
				</div>

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
					{isLoading.value ? "Creating Account..." : "Sign Up"}
				</button>

				<div class="divider">
					<span>OR</span>
				</div>

				<GoogleAuthButton className="google-btn-full" buttonText="Sign up with Google" />

				<p class="auth-footer">
					Already have an account? <a href="/login">Log In</a>
				</p>
			</form>
		</div>
	);
});
