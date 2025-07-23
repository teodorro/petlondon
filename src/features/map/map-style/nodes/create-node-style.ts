import { Feature } from "ol";
import { Style } from "ol/style";
import { Point } from "ol/geom";
import {
  createText,
  getIconScale,
  getNodeCircle,
  NODE_RESOLUTION_BREAKPOINT,
} from "./node-utils";
import ImageStyle from "ol/style/Image";

export const createNodeStyle = (
  feature: Feature,
  resolution: number,
): Style => {
  const image = createImage(feature, resolution);
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

const createImage = (feature: Feature, resolution: number): ImageStyle => {
  const img = getNodeCircle(
    resolution,
    feature.getProperties().properties?.lineColor,
  );
  img?.setScale(getIconScale(resolution));
  return img;
};

const createGeometry = (feature: Feature): Point => {
  const geometry = feature.getGeometry() as Point;
  const coords = geometry.getCoordinates();
  return coords != null ? new Point(coords) : new Point([]);
};
