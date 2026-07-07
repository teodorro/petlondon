import { create } from "zustand";
import { createSelectors } from "../utils/create-selectors";

interface IDrawerStore {
  open: boolean;
  toggle: () => void;
}

export const useDrawerStoreBase = create<IDrawerStore>((set) => ({
  open: true,
  toggle: () => set((s) => ({ open: !s.open })),
}));

export const useDrawerStore = createSelectors(useDrawerStoreBase);
