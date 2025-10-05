import { LineString } from "ol/geom";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import * as d3 from "d3";
import { tubeLineColors } from "../../../utils/line-colors";

export const SEGMENTS_NUMBER = 30;

export const createLineFeatureLogLat = (
  name: string,
  nodes: { lon: number; lat: number }[],
): Feature => {
  const geometry = new LineString(
    nodes.map((node) => fromLonLat([node.lon, node.lat])),
  );
  const line = new Feature({
    name,
    geometry,
  });
  return line;
};

export const createLineFeature = (
  name: string,
  nodes: [number, number][],
): Feature => {
  const geometry = new LineString(nodes);
  const line = new Feature({
    name,
    geometry,
  });
  return line;
};

export const createSmoothLineFeature = (
  name: string,
  nodes: [number, number][],
): Feature => {
  const lonLatLine: [number, number][] = nodes.map(
    ([lon, lat]) => fromLonLat([lon, lat]) as [number, number],
  );

  const d = getSvgSmoothLine(lonLatLine);
  if (!d) return new Feature({ name, geometry: new LineString(lonLatLine) });
  const sampled = convertSvgToMapCoords(d, lonLatLine);
  const geom = new LineString(sampled);
  const feature = new Feature({
    name,
    geometry: geom,
    properties: {
      lineName: name,
      lineColor: tubeLineColors[name],
    },
  });
  return feature;
};

const getSvgSmoothLine = (lonLatLine: [number, number][]): string | null => {
  const d = d3
    .line<[number, number]>()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveCatmullRom.alpha(0.5))(lonLatLine);
  return d;
};

const convertSvgToMapCoords = (
  d: string,
  lonLatLine: [number, number][],
): [number, number][] => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const total = path.getTotalLength();

  const sampled: [number, number][] = [];
  const step = total / (lonLatLine.length * SEGMENTS_NUMBER);
  for (let L = 0; L <= total; L += step) {
    const p = path.getPointAtLength(L);
    sampled.push([p.x, p.y]);
  }
  sampled.push(lonLatLine[lonLatLine.length - 1]);
  return sampled;
};
