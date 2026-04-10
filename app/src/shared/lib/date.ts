export function isoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
