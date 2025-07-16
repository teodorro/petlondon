import { LineString } from "ol/geom";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";

export function createLineFeature(
  name: string,
  nodes: { lon: number; lat: number }[],
): Feature {
  const geometry = new LineString(
    nodes.map((node) => fromLonLat([node.lon, node.lat])),
  );
  const line = new Feature({
    name,
    geometry,
  });
  return line;
}
