import { useQueries, useQuery } from "@tanstack/react-query";
import { baseUrl } from "./services-config";
import { ServiceType } from "../types/lines/service-type";
import { DtoLine } from "../types/lines/dto-line";
import { DtoLineMode } from "../types/lines/dto-line-mode";
import { DtoSeverityCode } from "../types/lines/dto-severity-code";
import { SafeQueryOptions } from "../types/safe-query-options";
import { HttpError } from "./http-error";
import { DtoRouteSequence } from "../types/lines/dto-route-sequence";

export const useValidLinesQuery = (
  serviceType?: ServiceType,
  options?: SafeQueryOptions<DtoLine[]>,
) => {
  const serviceTypes =
    serviceType == null
      ? ""
      : `?serviceTypes=${serviceType == null ? "" : serviceType}`;
  const url = `${baseUrl}/Line/Route${serviceTypes}`;
  const queryFn = async (): Promise<DtoLine[]> => {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const ra = res.headers.get("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
      throw new HttpError(res.status, res.statusText, text, retryAfterMs);
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as DtoLine[]) : [];
  };
  return useQuery<DtoLine[]>({
    queryKey: ["lines"],
    queryFn,
    ...options,
  });
};

export const useLineModesQuery = (
  options?: SafeQueryOptions<DtoLineMode[]>,
) => {
  const url = `${baseUrl}/Line/Meta/Modes`;
  const queryFn = async (): Promise<DtoLineMode[]> => {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const ra = res.headers.get("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
      throw new HttpError(res.status, res.statusText, text, retryAfterMs);
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as DtoLineMode[]) : [];
  };
  return useQuery<DtoLineMode[]>({
    queryKey: ["line-modes"],
    queryFn,
    ...options,
  });
};

export const useSeverityCodesQuery = (
  options?: SafeQueryOptions<DtoSeverityCode[]>,
) => {
  const url = `${baseUrl}/Line/Meta/Severity`;
  const queryFn = async (): Promise<DtoSeverityCode[]> => {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const ra = res.headers.get("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
      throw new HttpError(res.status, res.statusText, text, retryAfterMs);
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as DtoSeverityCode[]) : [];
  };
  return useQuery<DtoSeverityCode[]>({
    queryKey: ["line-severity-codes"],
    queryFn,
    ...options,
  });
};

export const useLineDisruptionsQueries = (
  modes: string[],
  options?: SafeQueryOptions<unknown[]>,
) => {
  const queryFn = async ({ queryKey }: any) => {
    const [, mode] = queryKey as [string, string];
    const url = `${baseUrl}/Line/Mode/${mode}/Disruption`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const ra = res.headers.get("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
      throw new HttpError(res.status, res.statusText, text, retryAfterMs);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  };

  return useQueries({
    queries: modes.map((mode) => ({
      queryKey: ["line-disruption", mode],
      queryFn,
      ...options,
    })),
  });
};

export const useTubeRoutesQueries = (
  lineIds: string[],
  options?: SafeQueryOptions<unknown>,
) => {
  const queryFn = async ({
    queryKey,
  }: any): Promise<DtoRouteSequence | undefined> => {
    const [, lineId] = queryKey as [string, string];
    const url = `${baseUrl}/Line/${lineId}/Route/Sequence/inbound`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const ra = res.headers.get("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
      throw new HttpError(res.status, res.statusText, text, retryAfterMs);
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as DtoRouteSequence) : undefined;
  };
  return useQueries({
    queries: lineIds.map((lineId) => ({
      queryKey: ["tube-route", lineId],
      queryFn,
      ...options,
    })),
  });
};
