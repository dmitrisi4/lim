export const env = {
	apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? "",
	geminiApiKey: process.env.GEMINI_API_KEY ?? "",
	geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
	geminiApiBaseUrl: process.env.GEMINI_API_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta"
};
