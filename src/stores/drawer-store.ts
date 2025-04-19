import { create } from 'zustand';

interface IDrawerStore {
  open: boolean;
  toggle: () => void;
}

export const useDrawerStore = create<IDrawerStore>((set) => ({
  open: true,
  toggle: () => set((s) => ({ open: !s.open }))
}));