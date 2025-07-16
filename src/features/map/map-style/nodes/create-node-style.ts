import { Feature } from "ol";
import { Circle, Style } from "ol/style";
import { Point } from "ol/geom";
import {
  createText,
  getIconScale,
  getSelectedNodeStroke,
  NODE_RESOLUTION_BREAKPOINT,
  selectedNodeFill,
} from "./node-utils";
import ImageStyle from "ol/style/Image";

export const createNodeStyle = (
  feature: Feature,
  resolution: number,
): Style => {
  const image = createImage(resolution);
  const geometry = createGeometry(feature);
  let style: Style;
  if (resolution <= NODE_RESOLUTION_BREAKPOINT) {
    const text = createText(feature, resolution);
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
};

const createImage = (resolution: number): ImageStyle => {
  const img = new Circle({
    fill: selectedNodeFill,
    stroke: getSelectedNodeStroke(resolution),
    radius: 8,
  });
  img?.setScale(getIconScale(resolution));
  return img;
};

const createGeometry = (feature: Feature): Point => {
  const geometry = feature.getGeometry() as Point;
  console.log("geometry instanceof Point", geometry instanceof Point);
  console.log("geometry", geometry);
  const coords = geometry.getCoordinates();
  return coords != null ? new Point(coords) : new Point([]);
};
