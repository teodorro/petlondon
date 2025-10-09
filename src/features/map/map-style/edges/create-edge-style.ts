import { Feature } from "ol";
import { Stroke, Style } from "ol/style";
import { addTransparencyToColor, getStrokeWidth } from "./edge-utils";
import { SELECTED_COLOR } from "../nodes/node-utils";

export const createEdgeStyle = (
  feature: Feature,
  resolution: number,
  options?: { selected?: boolean },
): Style[] => {
  const selected = options?.selected ?? false;
  const styles: Style[] = [];
  const stroke = createStroke(feature, resolution, { selected });
  styles.push(
    new Style({
      stroke,
    }),
  );
  return styles;
};

const createStroke = (
  feature: Feature,
  resolution: number,
  options?: { selected?: boolean },
): Stroke => {
  const selected = options?.selected ?? false;
  return new Stroke({
    color: selected
      ? SELECTED_COLOR
      : addTransparencyToColor(feature.getProperties().properties?.lineColor),
    width: getStrokeWidth(resolution, { selected }),
  });
};
