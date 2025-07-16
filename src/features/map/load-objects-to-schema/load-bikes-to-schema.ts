import { Layer } from "ol/layer";
import { DtoBikePoint } from "../../../types/dto-bike-point";
import VectorSource from "ol/source/Vector";
import { createPointFeature } from "../create-feature/create-point-feature";

export function loadBikesToSchema(
  layer: Layer,
  bikePoints: DtoBikePoint[],
): void {
  (layer.getSource() as VectorSource).clear();
  if (bikePoints == null) return;
  bikePoints.forEach((bikePoint) => {
    const feature = createPointFeature(bikePoint);
    (layer.getSource() as VectorSource).addFeature(feature);
  });
}
