import { useEffect, useMemo, useRef, useState } from "react";

interface UseApiQueryOptions<T> {
  enabled?: boolean;
  initialData?: T;
  keepPreviousData?: boolean;
  staleTimeMs?: number;
}

interface UseApiLoaderContext {
  signal: AbortSignal;
}

interface CachedQueryValue {
  data: unknown;
  cachedAt: number;
}

const queryCache = new Map<string, CachedQueryValue>();

export function useApiQuery<T>(
  deps: readonly unknown[],
  loader: (context: UseApiLoaderContext) => Promise<T>,
  options: UseApiQueryOptions<T> = {},
) {
  const { enabled = true, initialData, keepPreviousData = true, staleTimeMs = 0 } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled && initialData === undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const [requestVersion, setRequestVersion] = useState(0);
  const loaderRef = useRef(loader);
  const dataRef = useRef<T | undefined>(initialData);
  const dependencyKey = useMemo(() => JSON.stringify(deps), [deps]);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const controller = new AbortController();
    const cachedValue = queryCache.get(dependencyKey);
    const hasFreshCache =
      requestVersion === 0 && cachedValue !== undefined && staleTimeMs > 0 && Date.now() - cachedValue.cachedAt < staleTimeMs;

    if (hasFreshCache) {
      setData(cachedValue.data as T);
      setLoading(false);
      setRefreshing(false);
      setError("");
      return () => {
        controller.abort();
      };
    }

    if (cachedValue && keepPreviousData && dataRef.current === undefined) {
      setData(cachedValue.data as T);
    }

    const hasExistingData = dataRef.current !== undefined || (cachedValue !== undefined && keepPreviousData);
    setLoading(!hasExistingData);
    setRefreshing(hasExistingData);
    setError("");

    loaderRef.current({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) {
          return;
        }

        queryCache.set(dependencyKey, { data: result, cachedAt: Date.now() });
        setData(result);
      })
      .catch((reason) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(reason instanceof Error ? reason.message : "Unable to load data.");
      })
      .finally(() => {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      controller.abort();
    };
  }, [dependencyKey, enabled, keepPreviousData, requestVersion, staleTimeMs]);

  return {
    data,
    setData,
    loading,
    refreshing,
    error,
    retry: () => setRequestVersion((current) => current + 1),
  };
}
