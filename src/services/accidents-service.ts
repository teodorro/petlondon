import { DtoAccident } from "../types/accidents/dto-accident";
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from "./services-config";

export function useAccidentsQuery(year: number, options?: any) {
  const url = `${baseUrl}/AccidentStats/${year}`;
  const queryFn = (): Promise<DtoAccident[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoAccident[]>({
    queryKey: ['accidents', year],
    queryFn,
    ...options
  })
}