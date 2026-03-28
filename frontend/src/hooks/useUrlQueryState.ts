import { useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

type QueryValue = string | number | null | undefined;
type QueryShape = Record<string, QueryValue>;

function cleanValue(value: QueryValue) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}

export function useUrlQueryState<T extends QueryShape>(defaults: T) {
  const defaultsRef = useRef(defaults);
  const stableDefaults = defaultsRef.current;
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const next = { ...stableDefaults } as T;

    Object.keys(stableDefaults).forEach((key) => {
      const raw = searchParams.get(key);
      if (raw === null) {
        return;
      }

      const defaultValue = stableDefaults[key];
      (next as Record<string, QueryValue>)[key] = typeof defaultValue === "number" ? Number(raw) : raw;
    });

    return next;
  }, [searchParams, stableDefaults]);

  const setState = useCallback(
    (patch: Partial<T> | ((current: T) => Partial<T>), options?: { replace?: boolean }) => {
      const current = state;
      const nextPatch = typeof patch === "function" ? patch(current) : patch;
      const merged = { ...current, ...nextPatch } as T;
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(merged).forEach(([key, value]) => {
        const cleaned = cleanValue(value);
        if (cleaned === null) {
          nextParams.delete(key);
          return;
        }
        nextParams.set(key, cleaned);
      });

      setSearchParams(nextParams, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams, state],
  );

  const resetState = useCallback(
    (options?: { replace?: boolean }) => {
      const nextParams = new URLSearchParams(searchParams);
      Object.keys(stableDefaults).forEach((key) => nextParams.delete(key));
      setSearchParams(nextParams, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams, stableDefaults],
  );

  return { state, setState, resetState };
}
