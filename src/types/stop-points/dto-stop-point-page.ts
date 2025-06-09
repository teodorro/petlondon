import { DtoStopPoint } from "./dto-stop-point";

export type DtoStopPointPage = {
  page: number,
  pageSize: number,
  total: number,
  stopPoints: DtoStopPoint[],
}