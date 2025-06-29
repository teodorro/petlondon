import { LineString } from "ol/geom";
import { DtoStopPointSequence } from "../../types/lines/dto-stop-point-sequence";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";

export function createLineFeature(stopPointSequence: DtoStopPointSequence): Feature | undefined {

  if (stopPointSequence == null || stopPointSequence.stopPoint.length <= 1) {
    return undefined;
  }
  const points = stopPointSequence.stopPoint.map(stopPoint => ({
    name: stopPoint.name,
    lon: stopPoint.lon,
    lat: stopPoint.lat
  }));
  const geometry = new LineString(points.map(point => fromLonLat([point.lon, point.lat])));
  const line = new Feature({
    name: stopPointSequence.lineName,
    geometry,
  });
  return line;
}