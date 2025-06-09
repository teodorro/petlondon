import { create } from 'zustand';
import { DtoStopPoint } from '../types/stop-points/dto-stop-point';

interface IStopPointsStore {
  stopPoints: DtoStopPoint[],
  setStopPoints: (points: DtoStopPoint[]) => void,
}

export const useStopPointsStore = create<IStopPointsStore>((set) => ({
  stopPoints: [],
  setStopPoints: (points: DtoStopPoint[]) => set(() => ({ stopPoints: points })),
}))