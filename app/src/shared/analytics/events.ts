interface AnalyticsPayload {
  event: string;
  cardId?: string;
  cardType?: string;
  xpDelta?: number;
}

export function trackEvent(payload: AnalyticsPayload): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[analytics]", payload);
  }
}
