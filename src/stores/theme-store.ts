import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface IThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const useThemeStore = create<IThemeState>((set, get) => ({
  mode: 'light',
  toggleMode: () =>
    set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
}));