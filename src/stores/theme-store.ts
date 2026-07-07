import { create } from "zustand";
import { createSelectors } from "../utils/create-selectors";

export type ThemeMode = "light" | "dark";

interface IThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

const useThemeStoreBase = create<IThemeState>((set, get) => ({
  mode: "light",
  toggleMode: () => set({ mode: get().mode === "light" ? "dark" : "light" }),
}));

export const useThemeStore = createSelectors(useThemeStoreBase);
