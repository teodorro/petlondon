import { DtoDisruption } from "./dto-disruption"
import { DtoValidityPeriod } from "./dto-validity-period"

export type DtoLineStatus = {
  id: number,
  statusSeverity: number,
  statusSeverityDescription: string,
  created: string,
  validityPeriods: DtoValidityPeriod[],
  disruption?: DtoDisruption,
}