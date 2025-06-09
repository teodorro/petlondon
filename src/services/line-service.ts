
import { useQueries, useQuery } from '@tanstack/react-query'
import { baseUrl } from './services-config';
import { ServiceType } from '../types/lines/service-type';
import { DtoLine } from '../types/lines/dto-line';
import { DtoLineMode } from '../types/lines/dto-line-mode';
import { DtoSeverityCode } from '../types/lines/dto-severity-code';

export function useAllValidLinesQuery(serviceType?: ServiceType, options?: any) {
  const serviceTypes = `${serviceType == null ? '' : "?serviceTypes="}${serviceType == null ? '' : serviceType}`;
  const url = `${baseUrl}/Line/Route${serviceTypes}`;
  const queryFn = (): Promise<DtoLine[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoLine[]>({
    queryKey: ['all-lines'],
    queryFn,
    ...options
  });
}

export function useLineModesQuery(options?: any) {
  const url = `${baseUrl}/Line/Meta/Modes`;
  const queryFn = (): Promise<DtoLineMode[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoLineMode[]>({
    queryKey: ['line-modes'],
    queryFn,
    ...options
  });
}

export function useSeverityCodesQuery(options?: any) {
  const url = `${baseUrl}/Line/Meta/Severity`;
  const queryFn = (): Promise<DtoSeverityCode[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoSeverityCode[]>({
    queryKey: ['line-severity-codes'],
    queryFn,
    ...options
  })
}

export function useLineDisruptionsQueries(modes: string[], options?: any) {
  return useQueries({
    queries: modes.map((mode) => ({
      queryKey: ['line-disruption', mode],
      queryFn: ({ queryKey }) => {
        const [, mode] = queryKey as [string, string];
        const url = `${baseUrl}/Line/Mode/${mode}/Disruption`;
        return fetch(url).then((res) => res.json());
      },
      ...options,
    }))
  })
}

