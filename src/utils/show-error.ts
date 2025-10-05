import { useEffect, useMemo } from "react";
import useErrorStore from "../stores/error-store";

export const showError = (msg: string, err?: unknown) => {
  console.log(msg, err);
  if (msg === "") return;

  useErrorStore.getState().setError(msg, err);
  useErrorStore.getState().setErrorHappened(true);
};

export const useShowQueryError = (
  query: { isError: boolean; error: Error | null },
  getMessage: (msg: string) => string,
) => {
  useEffect(() => {
    if (query.isError) {
      showError(getMessage(query.error?.message ?? ""), query.error);
    }
  }, [query.error]);
};

type QueryLike = { isError: boolean; error: unknown };

const extractMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e ?? "");

export const useShowQueriesError = (
  queries: QueryLike[],
  getMessage: (msg: string) => string,
) => {
  const signature = useMemo(
    () =>
      queries
        .map((q) => `${q.isError ? 1 : 0}:${extractMessage(q.error)}`)
        .join("|"),
    [queries],
  );

  useEffect(() => {
    const firstErr = queries.find((q) => q.isError);
    if (!firstErr) return;
    const msg = extractMessage(firstErr.error);
    showError(getMessage(msg), firstErr.error);
  }, [signature, getMessage]);
};
