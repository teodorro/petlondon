import Style from "ol/style/Style";
import { create } from "zustand";
import { createSelectors } from "../utils/create-selectors";

interface ILineLayerStore {
  styles: Style[];
  setStyles: (dtoStyles: Style[]) => void;
}

const useLineLayerStoreBase = create<ILineLayerStore>((set) => ({
  styles: [],
  setStyles: (dtoStyles: Style[]) => set({ styles: dtoStyles }),
}));

export const useLineLayerStore = createSelectors(useLineLayerStoreBase);
