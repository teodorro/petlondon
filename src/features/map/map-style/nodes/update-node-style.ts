import { Feature } from "ol";
import { SimpleGeometry } from "ol/geom";
import { Style, Text } from "ol/style";
import {
  createImage,
  createText,
  getFont,
  getName,
  getTextOffsetY,
  NODE_RESOLUTION_BREAKPOINT,
} from "./node-utils";

export const updateNodeStyle = (
  feature: Feature,
  resolution: number,
  oldStyle: Style,
  oldResolution: number,
  oldCoordinates: number[],
  oldName: string,
): Style => {
  const geometry = feature.getGeometry() as SimpleGeometry;
  const coordinates = geometry.getCoordinates();
  if (
    resolution === oldResolution &&
    coordinates != null &&
    coordinates[0] === oldCoordinates[0] &&
    coordinates[1] === oldCoordinates[1] &&
    getName(feature) === oldName
  ) {
    return oldStyle;
  }
  if (resolution !== oldResolution || getName(feature) !== oldName) {
    const image = createImage(feature, resolution);
    const geometry = getGeometry(feature, oldStyle);
    let style: Style;
    if (resolution <= NODE_RESOLUTION_BREAKPOINT) {
      const text = getText(feature, oldStyle, resolution);
      style = new Style({
        image,
        text,
        geometry,
      });
    } else {
      style = new Style({
        image,
        geometry,
      });
    }
    return style;
  }
  if (
    coordinates != null &&
    (coordinates[0] !== oldCoordinates[0] ||
      coordinates[1] !== oldCoordinates[1])
  ) {
    oldStyle.setGeometry(getGeometry(feature, oldStyle));
  }
  return oldStyle;
};

const getGeometry = (feature: Feature, oldStyle: Style): SimpleGeometry => {
  const oldGeometry = oldStyle.getGeometry() as SimpleGeometry;
  const geometry = feature.getGeometry() as SimpleGeometry;
  const coords = geometry.getCoordinates();
  oldGeometry.setCoordinates(coords ?? []);
  return geometry;
};

const getText = (
  feature: Feature,
  oldStyle: Style,
  resolution: number,
): Text | undefined => {
  let text = oldStyle.getText();
  if (text == null) text = createText(feature, resolution);
  text.setFont(getFont(resolution));
  text.setOffsetY(getTextOffsetY(resolution));
  return text ?? undefined;
};
