import { DtoAdditionalProperty } from "./dto-additional-property"
import { DtoLightLine } from "./dto-light-line"
import { DtoLineGroup } from "./dto-line-group"
import { DtoLineModeGroups } from "./dto-line-mode-groups"

export type DtoStopPoint = {
  id: string,
  naptanId: string,
  commonName: string,
  placeType: string,
  lat: number,
  lon: number,
  modes: string[],
  icsCode: string,
  stopType: string,
  stationNaptan: string,
  status: boolean,
  lines: DtoLightLine[],
  lineGroup: DtoLineGroup[],
  lineModeGroups: DtoLineModeGroups[],
  additionalProperties: DtoAdditionalProperty[],
  children: DtoStopPoint[],
}