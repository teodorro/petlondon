import { create } from "zustand";
import { Feature } from "ol";

interface ISelectedFeatureStore {
  selectedFeature: Feature | undefined | null;
  setSelectedFeature: (feature: Feature | undefined | null) => void;
}

export const useSelectedFeatureStore = create<ISelectedFeatureStore>((set) => ({
  selectedFeature: undefined,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}));
