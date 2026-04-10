import type { RequestHandler } from "@builder.io/qwik-city";
import { isCardType } from "~/entities/card/model/guards";
import type { InteractionSubmissionInput } from "~/features/interactions/model/types";
import { submitInteraction } from "~/features/interactions/model/submit-interaction";
import { DEMO_USER_ID } from "~/shared/api/mock-db";

export const onPost: RequestHandler = async ({ json, request }) => {
  const body = (await request.json()) as Record<string, unknown>;
  const rawCardType = typeof body.cardType === "string" ? body.cardType : "video";

  const payload: InteractionSubmissionInput = {
    userId: typeof body.userId === "string" ? body.userId : DEMO_USER_ID,
    cardId: typeof body.cardId === "string" ? body.cardId : "",
    cardType: isCardType(rawCardType) ? rawCardType : "video",
    answer: typeof body.answer === "string" ? body.answer : undefined
  };

  const result = await submitInteraction(payload);
  json(result.ok ? 200 : 400, result);
};
