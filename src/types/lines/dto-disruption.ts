import { DtoRouteSection } from "./dto-route-section"

export type DtoDisruption = {
  category: string,
  type: string,
  categoryDescription: string,
  description: string,
  created: string,
  lastUpdate: string,
  affectedRoutes: DtoRouteSection[],
  affectedStops: unknown[], //TODO
  closureText: string,
}