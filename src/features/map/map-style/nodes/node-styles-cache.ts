import { Feature } from "ol";
import { Style } from "ol/style";
import { createNodeStyle } from "./create-node-style";
import { getNodeCoordinates, getSelectedCircleStyle } from "./node-utils";
import { updateNodeStyle } from "./update-node-style";

export type NodeStyle = {
  style: Style;
  selected: boolean;
  resolution: number;
  coordinates: number[];
  name: string;
};

export type SetNodeStyleFn = (
  feature: Feature,
  resolution: number,
  style: Style,
  nodeStyles: Map<Feature, NodeStyle>,
) => void;

export type CreateAndSaveNodeStyleFn = (
  feature: Feature,
  resolution: number,
  setNodeStyle: SetNodeStyleFn,
  nodeStyles: Map<Feature, NodeStyle>,
) => Style[];

export type UpdateAndSaveNodeStyleFn = (
  feature: Feature,
  resolution: number,
  setNodeStyle: SetNodeStyleFn,
  nodeStyles: Map<Feature, NodeStyle>,
  options?: { selected?: boolean },
) => Style[];

export class NodeStylesCache {
  constructor(
    private createAndSaveNodeStyle: CreateAndSaveNodeStyleFn,
    private updateAndSaveNodeStyle: UpdateAndSaveNodeStyleFn,
  ) {}

  private _nodeStyles: Map<Feature, NodeStyle> = new Map<Feature, NodeStyle>();

  getNodeStyle = (
    feature: Feature,
    resolution: number,
    options?: { selected?: boolean },
  ): Style[] => {
    let styles: Style[] = [];
    const selected = options?.selected ?? false;
    if (this._nodeStyles.has(feature)) {
      styles = this.updateAndSaveNodeStyle(
        feature,
        resolution,
        setNodeStyle,
        this._nodeStyles,
        { selected },
      );
    } else {
      styles = this.createAndSaveNodeStyle(
        feature,
        resolution,
        setNodeStyle,
        this._nodeStyles,
      );
    }
    return styles;
  };
}

export const createAndSaveNodeStyle = (
  feature: Feature,
  resolution: number,
  setNodeStyle: SetNodeStyleFn,
  nodeStyles: Map<Feature, NodeStyle>,
): Style[] => {
  const styles: Style[] = [];
  const style = createNodeStyle(feature, resolution);
  styles.push(style);
  setNodeStyle(feature, resolution, style, nodeStyles);
  return styles;
};

export const updateAndSaveNodeStyle = (
  feature: Feature,
  resolution: number,
  setNodeStyle: SetNodeStyleFn,
  nodeStyles: Map<Feature, NodeStyle>,
  options?: { selected?: boolean },
): Style[] => {
  const selected = options?.selected ?? false;
  const styles: Style[] = [];
  const cachesVals = nodeStyles.get(feature);
  const style = updateNodeStyle(
    feature,
    resolution,
    cachesVals?.style ?? new Style(),
    cachesVals?.resolution ?? 0,
    cachesVals?.coordinates ?? [],
    cachesVals?.name ?? "",
  );
  styles.push(style);
  if (selected) {
    styles.push(getSelectedCircleStyle(resolution));
  }
  setNodeStyle(feature, resolution, style, nodeStyles);
  return styles;
};

export const setNodeStyle = (
  feature: Feature,
  resolution: number,
  style: Style,
  nodeStyles: Map<Feature, NodeStyle>,
): void => {
  const coordinates = getNodeCoordinates(feature);
  nodeStyles.set(feature, {
    style,
    resolution,
    coordinates,
    name: feature.get("name"),
    selected: false,
  });
};

export const nodeStylesCache = new NodeStylesCache(
  createAndSaveNodeStyle,
  updateAndSaveNodeStyle,
);
