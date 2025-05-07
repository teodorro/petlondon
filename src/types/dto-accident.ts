import { DtoCasualty } from "./dto-casualty"

export type DtoAccident = {
  id: number,
  lat: number,
  lon: number,
  location: string,
  date: string,
  severity: string,
  borough: string,
  casualties: DtoCasualty[],
  vehicles: { type: string }[]
}