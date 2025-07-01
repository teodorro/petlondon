import { useQueries, useQuery } from "@tanstack/react-query";
import { baseUrl } from "./services-config";
import { ServiceType } from "../types/lines/service-type";
import { DtoLine } from "../types/lines/dto-line";
import { DtoLineMode } from "../types/lines/dto-line-mode";
import { DtoSeverityCode } from "../types/lines/dto-severity-code";
import { SafeQueryOptions } from "../types/safe-query-options";

export function useValidLinesQuery(
  serviceType?: ServiceType,
  options?: SafeQueryOptions<DtoLine[]>,
) {
  const serviceTypes =
    serviceType == null
      ? ""
      : `?serviceTypes=${serviceType == null ? "" : serviceType}`;
  const url = `${baseUrl}/Line/Route${serviceTypes}`;
  const queryFn = (): Promise<DtoLine[]> =>
    fetch(url).then((res) => res.json());
  return useQuery<DtoLine[]>({
    queryKey: ["lines"],
    queryFn,
    ...options,
  });
}

export function useLineModesQuery(options?: SafeQueryOptions<DtoLineMode[]>) {
  const url = `${baseUrl}/Line/Meta/Modes`;
  const queryFn = (): Promise<DtoLineMode[]> =>
    fetch(url).then((res) => res.json());
  return useQuery<DtoLineMode[]>({
    queryKey: ["line-modes"],
    queryFn,
    ...options,
  });
}

export function useSeverityCodesQuery(
  options?: SafeQueryOptions<DtoSeverityCode[]>,
) {
  const url = `${baseUrl}/Line/Meta/Severity`;
  const queryFn = (): Promise<DtoSeverityCode[]> =>
    fetch(url).then((res) => res.json());
  return useQuery<DtoSeverityCode[]>({
    queryKey: ["line-severity-codes"],
    queryFn,
    ...options,
  });
}

export function useLineDisruptionsQueries(
  modes: string[],
  options?: SafeQueryOptions<unknown[]>,
) {
  return useQueries({
    queries: modes.map((mode) => ({
      queryKey: ["line-disruption", mode],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: ({ queryKey }: any) => {
        const [, mode] = queryKey as [string, string];
        const url = `${baseUrl}/Line/Mode/${mode}/Disruption`;
        return fetch(url).then((res) => res.json());
      },
      ...options,
    })),
  });
}

export function useTubeRoutesQueries(
  lineIds: string[],
  options?: SafeQueryOptions<unknown>,
) {
  return useQueries({
    queries: lineIds.map((lineId) => ({
      queryKey: ["tube-route", lineId],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: ({ queryKey }: any) => {
        const [, lineId] = queryKey as [string, string];
        const url = `${baseUrl}/Line/${lineId}/Route/Sequence/inbound`;
        return fetch(url).then((res) => res.json());
      },
      ...options,
    })),
  });
}
