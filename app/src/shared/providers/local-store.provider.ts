export const localStoreProvider = {
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const item = window.localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  }
};
