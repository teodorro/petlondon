import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";

export function createPointFeature(
  node: { lat: number, lon: number, commonName: string }
): Feature {
  const coords = fromLonLat([node.lon, node.lat]);
  const geometry = new Point(coords);
  const feature = new Feature({
    name: node.commonName,
    geometry,
  });
  return feature;
}

