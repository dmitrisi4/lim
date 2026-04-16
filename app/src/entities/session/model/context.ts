import { createContextId } from "@builder.io/qwik";

export type UserType = {
	id: string;
	email: string;
	name: string;
	avatarUrl?: string;
	isTestPassed?: boolean;
};

export type SessionStateType = {
	isAuth: boolean;
	user: UserType | null;
	isLoading: boolean;
};

export const SESSION_CONTEXT = createContextId<SessionStateType>("session-context");
