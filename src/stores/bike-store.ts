import { create } from 'zustand';
import { DtoBikePoint } from '../types/dto-bike-point';

interface IBikeStore {
  bikePoints: DtoBikePoint[],
  setBikePoints: (points: DtoBikePoint[]) => void,
}

export const useBikeStore = create<IBikeStore>((set) => ({
  bikePoints: [],
  setBikePoints: (points: DtoBikePoint[]) => set(() => ({ bikePoints: points })),
}))