import { useCallback, useEffect, useState } from "react";
import type { FetchStatus } from "../types";

interface FetchState<T> {
  data: T[];
  status: FetchStatus;
  error: Error | null;
}

/**
 * Runs `fetcher(signal)` on mount and returns { data, status, error, reload }.
 * `fetcher` must be a stable reference (e.g. a module-level function).
 */
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T[]>) {
  const [state, setState] = useState<FetchState<T>>({ data: [], status: "loading", error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: null }));

    fetcher(controller.signal)
      .then((data) => setState({ data, status: "success", error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          data: [],
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });

    return () => controller.abort();
  }, [fetcher, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
