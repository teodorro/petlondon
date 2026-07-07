import { create } from "zustand";
import { Feature } from "ol";
import { createSelectors } from "../utils/create-selectors";

interface ISelectedFeatureStore {
  selectedFeature: Feature | undefined | null;
  setSelectedFeature: (feature: Feature | undefined | null) => void;
}

const useSelectedFeatureStoreBase = create<ISelectedFeatureStore>((set) => ({
  selectedFeature: undefined,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}));

export const useSelectedFeatureStore = createSelectors(
  useSelectedFeatureStoreBase,
);
