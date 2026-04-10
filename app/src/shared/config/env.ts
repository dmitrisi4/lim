const serverEnv = typeof process !== "undefined" ? process.env : ({} as Record<string, string | undefined>);

export const env = {
	apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? "",
	geminiApiKey: serverEnv.GEMINI_API_KEY ?? "",
	geminiModel: serverEnv.GEMINI_MODEL ?? "gemini-1.5-flash",
	geminiApiBaseUrl: serverEnv.GEMINI_API_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta"
};
