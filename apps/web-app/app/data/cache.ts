import { ok, type Result } from "@repo/type-safe-errors";

class CacheStore {
  private store: Map<string, unknown> = new Map();

  get(key: string): unknown | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: unknown) {
    this.store.set(key, value);
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const queryCache = new CacheStore();

export function clearQueryCache() {
  queryCache.clear();
}

type Fetcher<T> = (options: { signal: AbortSignal }) => Promise<T>;

export function createQuery<T>({
  cacheKey,
  fetcher,
}: {
  cacheKey: string;
  fetcher: Fetcher<Result<T, string>>;
}) {
  let abortController = new AbortController();

  async function getData() {
    abortController.abort();
    abortController = new AbortController();

    const cachedData = queryCache.get(cacheKey) as T | null;

    async function fetchDataAndUpdateCache() {
      const data = await fetcher({ signal: abortController.signal });
      if (data.ok) {
        queryCache.set(cacheKey, data.value);
      } else {
        queryCache.delete(cacheKey);
      }

      return data;
    }

    if (cachedData) return ok(cachedData);

    return fetchDataAndUpdateCache();
  }

  function clearCache() {
    queryCache.delete(cacheKey);
  }

  return {
    getData,
    clearCache,
  };
}
