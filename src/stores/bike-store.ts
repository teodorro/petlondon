import { create } from "zustand";
import { DtoBikePoint } from "../types/dto-bike-point";
import { createSelectors } from "../utils/create-selectors";

interface IBikeStore {
  bikePoints: DtoBikePoint[];
  setBikePoints: (points: DtoBikePoint[]) => void;
}

const useBikeStoreBase = create<IBikeStore>((set) => ({
  bikePoints: [],
  setBikePoints: (points: DtoBikePoint[]) =>
    set(() => ({ bikePoints: points })),
}));

export const useBikeStore = createSelectors(useBikeStoreBase);
