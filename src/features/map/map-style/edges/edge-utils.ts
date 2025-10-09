import { Feature } from "ol";
import { LineString } from "ol/geom";

export const EDGE_RESOLUTION_BREAKPOINT = 13;

export const getStrokeWidth = (
  resolution: number,
  options?: { selected?: boolean },
): number => {
  const isSelected = options?.selected ?? false;
  return isSelected ? 15 / resolution + 15 : 50 / resolution + 5;
};

export const getEdgeCoordinates = (edge: Feature): number[] => {
  return [...(edge.getGeometry() as LineString).getFlatCoordinates()];
};

export const addTransparencyToColor = (
  color: string,
  transparency: string = "aa",
): string => `${color}${transparency}`;
