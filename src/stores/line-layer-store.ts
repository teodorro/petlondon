import Style from "ol/style/Style";
import { create } from "zustand";

interface ILineLayerStore {
  styles: Style[],
  setStyles: (dtoStyles: Style[]) => void,
}

export const useLineLayerStore = create<ILineLayerStore>((set) => ({
  styles: [],
  setStyles: (dtoStyles: Style[]) => set({ styles: dtoStyles }),
}))