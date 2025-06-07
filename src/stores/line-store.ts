import { create } from 'zustand'
import { DtoLine } from '../types/lines/dto-line';
import { DtoLineMode } from '../types/lines/dto-line-mode';
import { DtoSeverityCode } from '../types/lines/dto-severity-code';
import { DtoDisruption } from '../types/lines/dto-disruption';

interface ILineStore {
  lines: DtoLine[],
  modes: DtoLineMode[],
  severityCodes: DtoSeverityCode[],
  disruptions: Map<string, DtoDisruption[]>,
  setLines: (lines: DtoLine[]) => void,
  setModes: (modes: DtoLineMode[]) => void,
  setSeverityCodes: (codes: DtoSeverityCode[]) => void,
  setDisruptions: (dtoDisruptions: Map<string, DtoDisruption[]>) => void,
  addDisruption: (modeName: string, disruptionPack: DtoDisruption[]) => void,
}

export const useLineStore = create<ILineStore>((set) => ({
  lines: [],
  modes: [],
  severityCodes: [],
  disruptions: new Map(),
  setLines: (dtoLines: DtoLine[]) => set(() => ({ lines: dtoLines })),
  setModes: (dtoModes: DtoLineMode[]) => set(() => ({ modes: dtoModes })),
  setSeverityCodes: (codes: DtoSeverityCode[]) => set(() => ({ severityCodes: codes })),
  setDisruptions: (dtoDisruptions: Map<string, DtoDisruption[]>) =>
    set(() => {
      const map = new Map<string, DtoDisruption[]>();
      dtoDisruptions.forEach((disruptionPack, modeName) => {
        map.set(modeName, disruptionPack);
      })
      return { disruptions: map };
    }),
  addDisruption: (modeName, disruptionPack) =>
    set((state) => {
      const map = new Map(state.disruptions);
      map.set(modeName, disruptionPack);
      return { disruptions: map };
    }),
}))