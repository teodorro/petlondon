import { Layer } from "ol/layer";
import { DtoStopPoint } from "../../../types/stop-points/dto-stop-point";
import VectorSource from "ol/source/Vector";
import { createPointFeature } from "../create-feature/create-point-feature";

export function loadStopPointsToSchema(
  layer: Layer,
  stopPoints: DtoStopPoint[],
): void {
  (layer.getSource() as VectorSource).clear();
  if (stopPoints == null) return;
  stopPoints.forEach((stopPoint) => {
    const feature = createPointFeature(stopPoint);
    (layer.getSource() as VectorSource).addFeature(feature);
  });
}
