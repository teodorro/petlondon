import { create } from "zustand";
import { createSelectors } from "../utils/create-selectors";

interface IViewState {
  center: [number | undefined, number | undefined];
  zoom: number | undefined;
  setCenter: (center: [number | undefined, number | undefined]) => void;
  setZoom: (zoom: number | undefined) => void;
}

const useViewStoreBase = create<IViewState>((set) => ({
  center: [undefined, undefined],
  zoom: undefined,
  setCenter: (center: [number | undefined, number | undefined]) =>
    set({ center }),
  setZoom: (zoom: number | undefined) => set({ zoom }),
}));

export const useViewStore = createSelectors(useViewStoreBase);
