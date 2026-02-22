"use client";

export function readStorageJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageJson<T>(key: string, value: T, eventName: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(eventName));
}

export function subscribeStorage(
  key: string,
  eventName: string,
  callback: () => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      callback();
    }
  };

  const onCustom = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, onCustom);
  };
}
