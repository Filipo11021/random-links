import { ok, type Result } from "@repo/type-safe-errors";

class CacheStore<T> {
  private store: Map<string, T> = new Map();

  get(key: string): T | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: T) {
    this.store.set(key, value);
  }

  delete(key: string) {
    this.store.delete(key);
  }
}

type Fetcher<T> = (options: { signal: AbortSignal }) => Promise<T>;

export function createQuery<T>({
  cacheKey,
  fetcher,
}: {
  cacheKey: string;
  fetcher: Fetcher<Result<T, string>>;
}) {
  const cacheStore = new CacheStore<T>();
  let abortController = new AbortController();

  async function getData() {
    abortController.abort();
    abortController = new AbortController();

    const cachedData = cacheStore.get(cacheKey);

    function getCachedDataAndInvalidateCache(cachedData: T) {
      fetcher({ signal: abortController.signal })
        .then((data) => {
          if (data.ok) {
            cacheStore.set(cacheKey, data.value);
          } else {
            cacheStore.delete(cacheKey);
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            cacheStore.delete(cacheKey);
          }
        });

      return ok(cachedData);
    }

    async function fetchDataAndUpdateCache() {
      const data = await fetcher({ signal: abortController.signal });
      if (data.ok) {
        cacheStore.set(cacheKey, data.value);
      } else {
        cacheStore.delete(cacheKey);
      }

      return data;
    }

    if (cachedData) return getCachedDataAndInvalidateCache(cachedData);

    return fetchDataAndUpdateCache();
  }

  function clearCache() {
    cacheStore.delete(cacheKey);
  }

  return {
    getData,
    clearCache,
  };
}
