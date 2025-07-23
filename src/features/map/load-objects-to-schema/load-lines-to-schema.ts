import { Layer } from "ol/layer";
import { DtoRouteSequence } from "../../../types/lines/dto-route-sequence";
// import { createLineFeature } from "../create-feature/create-line-feature";
import VectorSource from "ol/source/Vector";
import { createPointFeature } from "../create-feature/create-point-feature";

// export function loadLinesToSchema(
//   layer: Layer,
//   routeSequence: DtoRouteSequence,
// ): void {
//   // (layer.getSource() as VectorSource).clear();
//   if (routeSequence == null) return;
//   routeSequence.stopPointSequences.forEach((sequence) => {
//     // export function createLineFeature(
//     //   stopPointSequence: DtoStopPointSequence,
//     // ): Feature | undefined {
//     //   if (stopPointSequence == null || stopPointSequence.stopPoint.length <= 1) {
//     //     return undefined;
//     //   }
//     const feature = createLineFeature(sequence);
//     // console.log(feature?.getGeometry());
//     if (feature != null)
//       (layer.getSource() as VectorSource).addFeature(feature);
//   });
// }

export function loadLinesToSchema(
  layer: Layer,
  routeSequence: DtoRouteSequence,
): void {
  if (routeSequence == null) return;
  console.log("routeSequence", routeSequence.lineName);
  routeSequence.stopPointSequences.forEach((sequence) => {
    sequence.stopPoint.forEach((stopPoint) => {
      const feature = createPointFeature({
        lat: stopPoint.lat,
        lon: stopPoint.lon,
        commonName: stopPoint.name,
        lineName: routeSequence.lineName,
      });
      if (feature != null)
        (layer.getSource() as VectorSource).addFeature(feature);
    });
  });
}
