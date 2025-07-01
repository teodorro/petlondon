import { UseQueryOptions } from "@tanstack/react-query";

export type SafeQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error>,
  "queryKey" | "queryFn"
>;
