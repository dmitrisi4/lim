import type { InteractionSubmissionInput, InteractionSubmitResult } from "~/features/interactions/model/types";
import { trackEvent } from "~/shared/analytics/events";
import { submitMockInteraction } from "~/shared/api/mock-db";

export async function submitInteraction(input: InteractionSubmissionInput): Promise<InteractionSubmitResult> {
  const result = submitMockInteraction(input);

  trackEvent({
    event: "interaction_submit",
    cardId: input.cardId,
    cardType: input.cardType,
    xpDelta: result.xpDelta
  });

  return result;
}
