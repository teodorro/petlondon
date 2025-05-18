import { create } from 'zustand'
import { DtoLine } from '../types/lines/dto-line';
import { DtoLineMode } from '../types/lines/dto-line-mode';

interface ILineStore {
  lines: DtoLine[],
  modes: DtoLineMode[],
  setLines: (lines: DtoLine[]) => void,
  setModes: (modes: DtoLineMode[]) => void,
}

export const useLineStore = create<ILineStore>((set) => ({
  lines: [],
  modes: [],
  setLines: (dtoLines: DtoLine[]) => set(() => ({ lines: dtoLines })),
  setModes: (dtoModes: DtoLineMode[]) => set(() => ({ modes: dtoModes })),
}))