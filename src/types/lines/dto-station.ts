import { DtoLightLine } from "./dto-light-line"

export type DtoStation = {
  id: string,
  name: string,
  stationId: string,
  parentId: string,
  icsId: string,
  topMostParentId: string,
  status: string,
  lat: number,
  lon: number,
  modes: string[],
  stopType: string,
  zone: string,
  hasDisruption: boolean,
  lines: DtoLightLine[],
}