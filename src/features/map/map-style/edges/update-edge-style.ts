import { Stroke, Style } from "ol/style";
import { getStrokeWidth } from "./edge-utils";
import { Feature } from "ol";
import { LineString } from "ol/geom";

export const updateEdgeStyle = (
  feature: Feature,
  resolution: number,
  oldStyles: Style[],
  oldResolution: number,
  oldCoordinates: number[],
): Style[] => {
  const coords = (feature.getGeometry() as LineString).getFlatCoordinates();
  if (resolution !== oldResolution || coordsChanged(coords, oldCoordinates)) {
    const styles: Style[] = [];
    updateStroke(
      styles,
      getStroke(
        oldStyles[0],
        resolution,
        feature.getProperties().properties?.lineColor,
      ),
    );
    return styles;
  }
  return oldStyles;
};

const updateStroke = (styles: Style[], stroke: Stroke | null) => {
  if (stroke != null) {
    styles.push(
      new Style({
        stroke,
      }),
    );
  }
};

const coordsChanged = (
  coordinates: number[],
  oldCoordinates: number[],
): boolean => {
  if (coordinates.length !== oldCoordinates.length) {
    return true;
  }
  for (let i = 0; i < oldCoordinates.length; i++) {
    if (coordinates[i] !== oldCoordinates[i]) {
      return true;
    }
  }
  return false;
};

const getStroke = (
  oldStyle: Style,
  resolution: number,
  color: string,
): Stroke | null => {
  const stroke = oldStyle.getStroke();
  if (stroke != null) {
    stroke.setWidth(getStrokeWidth(resolution));
    stroke.setColor(color);
  }
  return stroke;
};
