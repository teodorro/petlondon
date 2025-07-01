import { DtoAccident } from "../types/accidents/dto-accident";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./services-config";
import { SafeQueryOptions } from "../types/safe-query-options";

export function useAccidentsQuery(
  year: number,
  options?: SafeQueryOptions<DtoAccident[]>,
) {
  const url = `${baseUrl}/AccidentStats/${year}`;
  const queryFn = (): Promise<DtoAccident[]> =>
    fetch(url).then((res) => res.json());
  return useQuery<DtoAccident[]>({
    queryKey: ["accidents", year],
    queryFn,
    ...options,
  });
}
