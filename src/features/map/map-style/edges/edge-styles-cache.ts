import { Feature } from "ol";
import { Style } from "ol/style";
import { createEdgeStyle } from "./create-edge-style";
import { updateEdgeStyle } from "./update-edge-style";
import { getEdgeCoordinates } from "./edge-utils";

export type EdgeStyle = {
  styles: Style[];
  selected: boolean;
  resolution: number;
  coordinates: number[];
};

export type UpdateAndSaveEdgeStyleFn = (
  feature: Feature,
  resolution: number,
  setEdgeStyle: SetEdgeStyleFn,
  edgeStyles: Map<Feature, EdgeStyle>,
  options?: { selected?: boolean },
) => Style[];

export type CreateAndSaveEdgeStyleFn = (
  feature: Feature,
  resolution: number,
  setEdgeStyle: SetEdgeStyleFn,
  edgeStyles: Map<Feature, EdgeStyle>,
) => Style[];

export type SetEdgeStyleFn = (
  feature: Feature,
  resolution: number,
  styles: Style[],
  edgeStyles: Map<Feature, EdgeStyle>,
) => void;

export class EdgeStylesCache {
  constructor(
    private createAndSaveEdgeStyle: CreateAndSaveEdgeStyleFn,
    private updateAndSaveEdgeStyle: UpdateAndSaveEdgeStyleFn,
  ) {}

  private _edgeStyles: Map<Feature, EdgeStyle> = new Map<Feature, EdgeStyle>();

  getEdgeStyle = (
    feature: Feature,
    resolution: number,
    options?: { selected?: boolean },
  ): Style[] => {
    const selected = options?.selected ?? false;
    let styles: Style[] = [];
    if (this._edgeStyles.has(feature)) {
      styles = this.updateAndSaveEdgeStyle(
        feature,
        resolution,
        setEdgeStyle,
        this._edgeStyles,
        { selected },
      );
    } else {
      styles = this.createAndSaveEdgeStyle(
        feature,
        resolution,
        setEdgeStyle,
        this._edgeStyles,
      );
    }
    return styles;
  };

  getEdges() {
    return Array.from(this._edgeStyles.keys());
  }
}

export const createAndSaveEdgeStyle = (
  feature: Feature,
  resolution: number,
  setEdgeStyle: SetEdgeStyleFn,
  edgeStyles: Map<Feature, EdgeStyle>,
): Style[] => {
  const styles: Style[] = [];
  const createdStyles = createEdgeStyle(feature, resolution);
  createdStyles.forEach((style) => {
    styles.push(style);
  });
  setEdgeStyle(feature, resolution, createdStyles, edgeStyles);
  return styles;
};

export const updateAndSaveEdgeStyle = (
  feature: Feature,
  resolution: number,
  setEdgeStyle: SetEdgeStyleFn,
  edgeStyles: Map<Feature, EdgeStyle>,
  options?: { selected?: boolean },
): Style[] => {
  const selected = options?.selected ?? false;
  const styles: Style[] = [];
  const cachedVals = edgeStyles.get(feature);
  const updatedStyles = updateEdgeStyle(
    feature,
    resolution,
    cachedVals?.styles ?? [],
    cachedVals?.resolution ?? 0,
    cachedVals?.coordinates ?? [],
  );
  updatedStyles.forEach((style) => {
    styles.push(style);
  });
  if (selected) {
    styles.push(...createEdgeStyle(feature, resolution, { selected }));
  }
  setEdgeStyle(feature, resolution, updatedStyles, edgeStyles);
  return styles;
};

export const setEdgeStyle = (
  feature: Feature,
  resolution: number,
  styles: Style[],
  edgeStyles: Map<Feature, EdgeStyle>,
): void => {
  edgeStyles.set(feature, {
    styles: styles,
    selected: false,
    resolution,
    coordinates: getEdgeCoordinates(feature),
  });
};

export const edgeStylesCache = new EdgeStylesCache(
  createAndSaveEdgeStyle,
  updateAndSaveEdgeStyle,
);
