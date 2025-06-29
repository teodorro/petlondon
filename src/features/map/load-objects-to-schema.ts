import { Layer } from 'ol/layer';
import { DtoBikePoint } from '../../types/dto-bike-point';
import { createPointFeature } from './create-point-feature';
import VectorSource from 'ol/source/Vector';
import { DtoStopPoint } from '../../types/stop-points/dto-stop-point';
import { DtoRouteSequence } from '../../types/lines/dto-route-sequence';
import { createLineFeature } from './create-line-feature';
import { Point } from 'ol/geom';

export function loadBikesToSchema(
  layer: Layer,
  bikePoints: DtoBikePoint[]
): void {
  (layer.getSource() as VectorSource).clear();
  if (bikePoints == null) return;
  bikePoints.forEach((bikePoint) => {
    const feature = createPointFeature(bikePoint);
    (layer.getSource() as VectorSource).addFeature(feature);
  });
}

export function loadStopPointsToSchema(
  layer: Layer,
  stopPoints: DtoStopPoint[]
): void {
  (layer.getSource() as VectorSource).clear();
  if (stopPoints == null) return;
  stopPoints.forEach((stopPoint) => {
    const feature = createPointFeature(stopPoint);
    (layer.getSource() as VectorSource).addFeature(feature);
  });
}

export function loadLinesToSchema(
  layer: Layer,
  routeSequence: DtoRouteSequence
): void {
  // (layer.getSource() as VectorSource).clear();
  if (routeSequence == null) return;
  routeSequence.stopPointSequences.forEach((sequence) => {
    const feature = createLineFeature(sequence);
    // console.log(feature?.getGeometry());
    if (feature != null)
      (layer.getSource() as VectorSource).addFeature(feature);
  });
}

// export function loadLinesToSchema(
//   layer: Layer,
//   routeSequence: DtoRouteSequence
// ): void {
//   if (routeSequence == null) return;
//   routeSequence.stopPointSequences.forEach((sequence) => {
//     sequence.stopPoint.forEach((stopPoint) => {
//       const feature = createPointFeature({
//         lat: stopPoint.lat,
//         lon: stopPoint.lon,
//         commonName: stopPoint.name,
//       });
//       // console.log(feature);
//       console.log((feature?.getGeometry() as Point).getFlatCoordinates());
//       if (feature != null)
//         (layer.getSource() as VectorSource).addFeature(feature);
//     });
//   });
// }
