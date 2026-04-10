import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = ({ cookie, redirect }) => {
	cookie.delete("mock_auth_token", { path: "/" });
	throw redirect(302, "/");
};
