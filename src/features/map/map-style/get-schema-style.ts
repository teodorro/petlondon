import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { nodeStylesCache } from "./nodes/node-styles-cache";
import { edgeStylesCache } from "./edges/edge-styles-cache";
import Style from "ol/style/Style";

export const getSchemaStyle = (
  ff: FeatureLike,
  resolution: number,
  selected: boolean = false,
): Style[] => {
  const feature = ff as Feature;
  if (isNode(feature)) {
    return nodeStylesCache.getNodeStyle(feature, resolution, { selected });
  } else if (isEdge(feature)) {
    return edgeStylesCache.getEdgeStyle(feature, resolution, { selected });
  }
  return [];
};

export const getSchemaStyleWithSelection = (
  fl: FeatureLike,
  resolution: number,
): Style[] => {
  return getSchemaStyle(fl, resolution, true);
};

const getFeatureType = (feature: Feature): string | undefined | null => {
  const type = feature.getGeometry()?.getType();
  return type;
};

const isNode = (feature: Feature): boolean => {
  return getFeatureType(feature) === "Point";
};

const isEdge = (feature: Feature): boolean => {
  return getFeatureType(feature) === "LineString";
};
