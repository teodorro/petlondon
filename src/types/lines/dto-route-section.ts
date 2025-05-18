import { ServiceType } from "./service-type"

export type DtoRouteSection = {
  name: string,
  direction: string,
  originationName: string,
  destinationName: string,
  originator: string,
  destination: string
  serviceType: ServiceType,
  validTo: string,
  validFrom: string,
}