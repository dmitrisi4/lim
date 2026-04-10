/**
 * NOTE: This hook pattern cannot be implemented as a generic utility in Qwik
 * because Qwik serializes the closure of useVisibleTask$, and any external
 * function passed as a parameter is not serializable (throws "Captured variable
 * cannot be serialized" at runtime).
 *
 * Instead, copy-paste this pattern directly into each component that needs
 * localStorage sync:
 *
 * @example
 * useVisibleTask$(({ cleanup }) => {
 *   const syncFromStorage = () => {
 *     mySignal.value = readMyData();
 *   };
 *   syncFromStorage();
 *
 *   const onStorage = (event: StorageEvent) => {
 *     if (event.key === null || event.key === MY_STORAGE_KEY) {
 *       syncFromStorage();
 *     }
 *   };
 *
 *   window.addEventListener("storage", onStorage);
 *   cleanup(() => window.removeEventListener("storage", onStorage));
 * });
 *
 * This file is kept as documentation/reference for this Qwik-specific gotcha.
 */
export const STORAGE_SYNC_QWIK_NOTE =
	"In Qwik, pass-by-function hooks for useVisibleTask$ are not serializable. Use the inline pattern above.";
