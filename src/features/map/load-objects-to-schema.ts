import { Layer } from "ol/layer";
import { DtoBikePoint } from "../../types/dto-bike-point";
import { createPointFeature } from "./create-point-feature";
import VectorSource from "ol/source/Vector";
import { DtoStopPoint } from "../../types/stop-points/dto-stop-point";

export function loadBikesToSchema(
  layer: Layer,
  bikePoints: DtoBikePoint[]
): void {
  (layer.getSource() as VectorSource).clear();
  if (bikePoints == null) return;
  bikePoints.forEach(bikePoint => {
    const feature = createPointFeature(bikePoint);
    (layer.getSource() as VectorSource).addFeature(feature)
  })
}

export function loadStopPointsToSchema(
  layer: Layer,
  stopPoints: DtoStopPoint[]
): void {
  (layer.getSource() as VectorSource).clear();
  if (stopPoints == null) return;
  stopPoints.forEach(stopPoint => {
    const feature = createPointFeature(stopPoint);
    (layer.getSource() as VectorSource).addFeature(feature)
  })
}