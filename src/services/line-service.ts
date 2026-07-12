import { useQueries, useQuery } from "@tanstack/react-query";
import { ServiceType } from "../types/lines/service-type";
import { DtoLine } from "../types/lines/dto-line";
import { DtoLineMode } from "../types/lines/dto-line-mode";
import { DtoSeverityCode } from "../types/lines/dto-severity-code";
import { SafeQueryOptions } from "../types/safe-query-options";
import { DtoRouteSequence } from "../types/lines/dto-route-sequence";
import { DtoDisruption } from "../types/lines/dto-disruption";
import { fetchTflJson } from "./fetch-json";

export const useValidLinesQuery = (
  serviceType?: ServiceType,
  options?: SafeQueryOptions<DtoLine[]>,
) => {
  const serviceTypes =
    serviceType == null ? "" : `?serviceTypes=${serviceType}`;
  return useQuery<DtoLine[]>({
    queryKey: ["lines"],
    queryFn: () =>
      fetchTflJson<DtoLine[]>(`/Line/Route${serviceTypes}`, "lines.json", []),
    ...options,
  });
};

export const useLineModesQuery = (
  options?: SafeQueryOptions<DtoLineMode[]>,
) => {
  return useQuery<DtoLineMode[]>({
    queryKey: ["line-modes"],
    queryFn: () =>
      fetchTflJson<DtoLineMode[]>("/Line/Meta/Modes", "modes.json", []),
    ...options,
  });
};

export const useSeverityCodesQuery = (
  options?: SafeQueryOptions<DtoSeverityCode[]>,
) => {
  return useQuery<DtoSeverityCode[]>({
    queryKey: ["line-severity-codes"],
    queryFn: () =>
      fetchTflJson<DtoSeverityCode[]>(
        "/Line/Meta/Severity",
        "severity-codes.json",
        [],
      ),
    ...options,
  });
};

export const useLineDisruptionsQueries = (modeNames: string[]) => {
  return useQueries({
    queries: modeNames.map((mode) => ({
      queryKey: ["line-disruption", mode] as const,
      queryFn: () =>
        fetchTflJson<DtoDisruption[]>(
          `/Line/Mode/${mode}/Disruption`,
          `disruptions/${mode}.json`,
          [],
        ),
    })),
    combine: (results) => ({
      // null until every mode has loaded, then a mode name -> disruptions map
      disruptionsByMode: results.every((r) => r.data != null)
        ? new Map(
            modeNames.map((mode, i) => [
              mode,
              results[i].data as DtoDisruption[],
            ]),
          )
        : null,
      isError: results.some((r) => r.isError),
      error: results.find((r) => r.error != null)?.error ?? null,
    }),
  });
};

export const useTubeRoutesQueries = (lineIds: string[]) => {
  return useQueries({
    queries: lineIds.map((lineId) => ({
      queryKey: ["tube-route", lineId] as const,
      queryFn: () =>
        fetchTflJson<DtoRouteSequence | null>(
          `/Line/${lineId}/Route/Sequence/inbound`,
          `route-sequences/${lineId}.json`,
          null,
        ),
    })),
    combine: (results) => ({
      routeSequences:
        lineIds.length > 0 && results.every((r) => r.data != null)
          ? results.map((r) => r.data as DtoRouteSequence)
          : [],
      isError: results.some((r) => r.isError),
      error: results.find((r) => r.error != null)?.error ?? null,
    }),
  });
};
