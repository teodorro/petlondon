
import { useQueries, useQuery } from '@tanstack/react-query'
import { baseUrl } from './services-config';
import { DtoStopPoint } from '../types/stop-points/dto-stop-point';
import { DtoStopPointPage } from '../types/stop-points/dto-stop-point-page';

export function useGetStopPoints(mode: string, options?: any) {
  const url = `${baseUrl}/StopPoint/Mode/${mode}`
  const queryFn = (): Promise<DtoStopPointPage> =>
    fetch(url).then(res => res.json())
  return useQuery<DtoStopPointPage>({
    queryKey: ['stop-points', `${mode}`],
    queryFn,
    ...options
  });
}