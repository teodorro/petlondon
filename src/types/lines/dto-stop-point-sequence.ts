import { DtoStation } from "./dto-station";

export type DtoStopPointSequence = {
  lineId: string,
  lineName: string,
  direction: string,
  branchId: number,
  nextBranchIds: number[],
  prevBranchIds: number[],
  serviceType: string,
  stopPoint: DtoStation[],
}