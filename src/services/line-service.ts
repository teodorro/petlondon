
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './services-config';
import { ServiceType } from '../types/lines/service-type';
import { DtoLine } from '../types/lines/dto-line';
import { DtoLineMode } from '../types/lines/dto-line-mode';

export function useAllValidLines(serviceType?: ServiceType, options?: any) {
  const url = `${baseUrl}/Line/Route${serviceType == null ? '' : "?serviceTypes="}${serviceType == null ? '' : serviceType}`;
  const queryFn = (): Promise<DtoLine[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoLine[]>({
    queryKey: ['all-lines'],
    queryFn,
    ...options
  });
}

export function useLineModes(options?: any) {
  const url = `${baseUrl}/Line/Meta/Modes`;
  const queryFn = (): Promise<DtoLineMode[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoLineMode[]>({
    queryKey: ['line-modes'],
    queryFn,
    ...options
  });
}
