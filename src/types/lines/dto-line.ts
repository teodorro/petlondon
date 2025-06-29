import { DtoDisruption } from "./dto-disruption"
import { DtoLineStatus } from "./dto-line-status"
import { DtoRouteSection } from "./dto-route-section"
import { ServiceType } from "./service-type"

export const TUBE = 'tube';

export type DtoLine = {
  id: string,
  name: string,
  modeName: string,
  disruptions: DtoDisruption[],
  created: string,
  modified: string,
  lineStatuses: DtoLineStatus[],
  routeSections: DtoRouteSection[],
  serviceTypes: ServiceType[], //??TODO
  crowding: unknown //??TODO
}