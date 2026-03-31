export interface LocalStorageProvider<T> {
  key: string;
  read: (storage?: Storage) => T;
  write: (value: T, storage?: Storage) => T;
  update: (updater: (current: T) => T, storage?: Storage) => T;
}

interface CreateLocalStorageProviderOptions<T> {
  key: string;
  getDefaultValue: () => T;
  sanitize: (value: unknown) => T;
}

function resolveStorage(storage?: Storage): Storage | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createLocalStorageProvider<T>(options: CreateLocalStorageProviderOptions<T>): LocalStorageProvider<T> {
  const { key, getDefaultValue, sanitize } = options;

  const read = (storage?: Storage): T => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) {
      return getDefaultValue();
    }

    let raw: string | null = null;
    try {
      raw = resolvedStorage.getItem(key);
    } catch {
      return getDefaultValue();
    }

    if (!raw) {
      return getDefaultValue();
    }

    try {
      const parsed = JSON.parse(raw);
      return sanitize(parsed);
    } catch {
      return getDefaultValue();
    }
  };

  const write = (value: T, storage?: Storage): T => {
    const resolvedStorage = resolveStorage(storage);
    const next = sanitize(value);

    if (resolvedStorage) {
      try {
        resolvedStorage.setItem(key, JSON.stringify(next));
      } catch {
        return next;
      }
    }

    return next;
  };

  const update = (updater: (current: T) => T, storage?: Storage): T => {
    const current = read(storage);
    const next = updater(current);
    return write(next, storage);
  };

  return {
    key,
    read,
    write,
    update
  };
}
