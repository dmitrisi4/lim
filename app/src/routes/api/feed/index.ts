import type { RequestHandler } from "@builder.io/qwik-city";
import { getFeedPage } from "~/features/feed/model/get-feed";
import { DEMO_USER_ID } from "~/shared/api/mock-db";
import { LEARNING_LANGUAGE_COOKIE, detectLearningLanguage } from "~/shared/i18n/ui";
import { parseFeedFiltersFromSearchParams } from "~/shared/lib/feed-filters";

export const onGet: RequestHandler = async ({ url, json, cookie }) => {
  const cursor = Number(url.searchParams.get("cursor") ?? "0");
  const limit = Number(url.searchParams.get("limit") ?? "6");
  const filters = parseFeedFiltersFromSearchParams(url.searchParams);
  const language = detectLearningLanguage(url, cookie.get(LEARNING_LANGUAGE_COOKIE)?.value);

  const payload = await getFeedPage({
    userId: DEMO_USER_ID,
    cursor: Number.isFinite(cursor) ? cursor : 0,
    limit: Number.isFinite(limit) ? Math.max(1, Math.min(limit, 10)) : 6,
    levels: filters.levels,
    categories: filters.categories,
    answers: filters.answers,
    language
  });

  json(200, payload);
};
