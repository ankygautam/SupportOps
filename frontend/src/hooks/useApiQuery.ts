import { useEffect, useRef, useState } from "react";

interface UseApiQueryOptions<T> {
  enabled?: boolean;
  initialData?: T;
}

export function useApiQuery<T>(deps: readonly unknown[], loader: () => Promise<T>, options: UseApiQueryOptions<T> = {}) {
  const { enabled = true, initialData } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string>("");
  const [requestVersion, setRequestVersion] = useState(0);
  const loaderRef = useRef(loader);
  const dependencyKey = JSON.stringify(deps);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    loaderRef.current()
      .then((result) => {
        if (!active) {
          return;
        }

        setData(result);
      })
      .catch((reason) => {
        if (!active) {
          return;
        }

        setError(reason instanceof Error ? reason.message : "Unable to load data.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [dependencyKey, enabled, requestVersion]);

  return {
    data,
    setData,
    loading,
    error,
    retry: () => setRequestVersion((current) => current + 1),
  };
}
