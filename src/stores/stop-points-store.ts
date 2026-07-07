import { create } from "zustand";
import { DtoStopPoint } from "../types/stop-points/dto-stop-point";
import { createSelectors } from "../utils/create-selectors";

interface IStopPointsStore {
  stopPoints: DtoStopPoint[];
  setStopPoints: (points: DtoStopPoint[]) => void;
}

const useStopPointsStoreBase = create<IStopPointsStore>((set) => ({
  stopPoints: [],
  setStopPoints: (points: DtoStopPoint[]) =>
    set(() => ({ stopPoints: points })),
}));

export const useStopPointsStore = createSelectors(useStopPointsStoreBase);
