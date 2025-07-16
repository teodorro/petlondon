import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { nodeStylesCache } from "./nodes/node-styles-cache";

// const edgeStyles = new Map<Feature, any>();

export const getSchemaStyle = (
  ff: FeatureLike,
  resolution: number,
  selected: boolean = false,
) => {
  // console.log(resolution);
  const feature = ff as Feature;
  if (isNode(feature)) {
    return nodeStylesCache.getNodeStyle(feature, resolution, { selected });
  } else if (isEdge(feature)) {
    return []; //getEdgeStyle(feature, resolution);
  }
  return [];
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
