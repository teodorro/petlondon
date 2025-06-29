import { DtoStation } from "./dto-station";
import { DtoStopPointSequence } from "./dto-stop-point-sequence";

export type DtoRouteSequence = {
  lineId: string,
  lineName: string,
  direction: string,
  isOutboundOnly: boolean,
  mode: string,
  lineStrings: string,
  stations: DtoStation[],
  stopPointSequences: DtoStopPointSequence[],
}