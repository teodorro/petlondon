import { Feature } from "ol";
import { SimpleGeometry } from "ol/geom";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import ImageStyle from "ol/style/Image";

export enum NodeType {
  NodeField = "NodeField",
  NodeDemand = "NodeDemand",
}

export const NODE_WIDTH = 16;
export const NODE_RESOLUTION_BREAKPOINT = 12;
export const NODE_FONT_RESOLUTION_BREAKPOINT = 6;

export const SELECTED_COLOR = "#cc00cc";
export const DEFAULT_COLOR = "#4444CC";

export const addTransparencyToColor = (
  color: string,
  transparency: string = "aa",
): string => `${color}${transparency}`;
export const selectedNodeFill = new Fill({
  color: addTransparencyToColor(SELECTED_COLOR),
});
export const defaultNodeFill = new Fill({
  color: addTransparencyToColor(DEFAULT_COLOR),
});
export const selectedNodeStroke = new Stroke({
  color: SELECTED_COLOR,
  width: 0.5,
});
export const defaultNodeStroke = new Stroke({
  color: DEFAULT_COLOR,
  width: 0.5,
});

export const textFill = new Fill({
  color: "#414239",
});

export const getNodeIcon = (feature: Feature): Icon => {
  let img = null;
  switch ((feature as any).getProperties()?.type) {
    default:
      img = new Icon({
        src: "/openlayers.svg",
        scale: 1,
        anchor: [0.5, 1],
      });
      break;
  }
  return img;
};

export const getNodeCircle = (
  resolution: number,
  color: string,
): ImageStyle => {
  const transColor = addTransparencyToColor(color);
  const img = new Circle({
    fill: new Fill({ color: transColor }),
    stroke: getDefaultNodeStroke(resolution, transColor),
    radius: 40 / resolution + 4,
  });
  return img;
};

export const getFont = (resolution: number): string => {
  if (resolution <= NODE_FONT_RESOLUTION_BREAKPOINT) {
    return `normal ${Math.round(12)}px Arial`;
  } else {
    return `normal ${Math.round(30 / resolution + 5)}px Arial`;
  }
};

export const getIconScale = (resolution: number): number => {
  return NODE_WIDTH / (1 * resolution);
};

export const getTextOffsetY = (resolution: number): number => {
  if (resolution <= NODE_RESOLUTION_BREAKPOINT) {
    return NODE_WIDTH + 10;
  } else {
    return NODE_WIDTH / resolution + 20 / resolution; // in fact doesn't matter
  }
};

export const getSelectedStrokeWidth = (resolution: number): number => {
  return 4 / resolution;
};

export const getDefaultStrokeWidth = (resolution: number): number => {
  return 4 / resolution;
};

export const getSelectedNodeRadius = (resolution: number): number => {
  return NODE_WIDTH / (1 * resolution);
};

export const getNodeCoordinates = (nodeFeature: Feature): number[] => {
  return (nodeFeature.getGeometry() as SimpleGeometry).getFlatCoordinates();
};

export const getSelectedCircleStyle = (resolution: number): Style => {
  const style = new Style({
    image: new Circle({
      fill: selectedNodeFill,
      stroke: getSelectedNodeStroke(resolution),
      radius: getSelectedNodeRadius(resolution),
    }),
  });
  return style;
};

export const getSelectedNodeStroke = (resolution: number): Stroke => {
  selectedNodeStroke.setWidth(getSelectedStrokeWidth(resolution));
  selectedNodeStroke.setColor(SELECTED_COLOR);
  return selectedNodeStroke;
};

export const getDefaultNodeStroke = (
  resolution: number,
  color: string,
): Stroke => {
  defaultNodeStroke.setWidth(getDefaultStrokeWidth(resolution));
  defaultNodeStroke.setColor(color);
  return defaultNodeStroke;
};

export const getName = (feature: Feature): string => {
  return feature.getProperties()["name"];
};

export const createText = (feature: Feature, resolution: number): Text => {
  const text = new Text({
    textAlign: "center",
    textBaseline: "middle",
    font: getFont(resolution),
    text: getName(feature),
    fill: textFill,
    offsetX: 0,
    offsetY: getTextOffsetY(resolution),
    placement: "point",
    maxAngle: 0.7853981633974483,
    overflow: false,
    rotation: 0,
  });
  return text;
};

export const createImage = (
  feature: Feature,
  resolution: number,
): ImageStyle => {
  const img = getNodeCircle(
    resolution,
    feature.getProperties().properties?.lineColor,
  );
  // img?.setScale(getIconScale(resolution));
  return img;
};
