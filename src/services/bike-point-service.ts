
import { useQuery } from '@tanstack/react-query'
import { DtoBikePoint } from '../types/dto-bike-point';
import { baseUrl } from './services-config';

export function useAllBikePointLocations(options?: any) {
  const url = `${baseUrl}/BikePoint`;
  const queryFn = (): Promise<DtoBikePoint[]> =>
    fetch(url).then((res) => res.json())
  return useQuery<DtoBikePoint[]>({
    queryKey: ['all-bike-points'],
    queryFn,
    ...options
  });
}