import { Layer } from "ol/layer";
import { DtoRouteSequence } from "../../../types/lines/dto-route-sequence";
import VectorSource from "ol/source/Vector";
import { createPointFeature } from "../create-feature/create-point-feature";
import { DtoStation } from "../../../types/lines/dto-station";
import { createSmoothLineFeature } from "../create-feature/create-line-feature";

export const loadLinesToSchema = (
  layer: Layer,
  routeSequence: DtoRouteSequence,
): void => {
  if (routeSequence == null || routeSequence.stopPointSequences == null) return;
  routeSequence.stopPointSequences.forEach((sequence) => {
    sequence.stopPoint.forEach((stopPoint) => {
      addStopPoint(
        layer.getSource() as VectorSource,
        routeSequence.lineName,
        stopPoint,
      );
    });
    addLine(
      layer.getSource() as VectorSource,
      routeSequence.lineName,
      sequence.stopPoint,
    );
  });
};

const addStopPoint = (
  layerSource: VectorSource,
  lineName: string,
  stopPoint: DtoStation,
) => {
  const feature = createPointFeature({
    lat: stopPoint.lat,
    lon: stopPoint.lon,
    commonName: stopPoint.name,
    lineName,
  });
  if (feature != null) layerSource.addFeature(feature);
};

// const addLine = (
//   layerSource: VectorSource,
//   lineName: string,
//   stopPoints: DtoStation[],
// ) => {
//   const dataPoints: [number, number][] = stopPoints.map(
//     (sp) => fromLonLat([sp.lon, sp.lat]) as [number, number],
//   );
//   lineGen(dataPoints);
//   const feature = createLineFeature(lineName, dataPoints);
//   console.log(
//     "geometry",
//     (feature.getGeometry() as SimpleGeometry).getCoordinates(),
//   );
//   if (feature != null) layerSource.addFeature(feature);
// };

const addLine = (
  layerSource: VectorSource,
  lineName: string,
  stopPoints: DtoStation[],
) => {
  const feature = createSmoothLineFeature(
    lineName,
    stopPoints.map((sp) => [sp.lon, sp.lat] as [number, number]),
  );
  if (feature != null) layerSource.addFeature(feature);
};
