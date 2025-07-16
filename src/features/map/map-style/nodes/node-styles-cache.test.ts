import { describe, expect, it } from "vitest";
import { Feature } from "ol";
import { NODE_RESOLUTION_BREAKPOINT } from "./node-utils";
import {
  createAndSaveNodeStyle,
  NodeStyle,
  setNodeStyle,
} from "./node-styles-cache";
import { Style } from "ol/style";
import { Point, SimpleGeometry } from "ol/geom";

describe("createAndSaveNodeStyle", () => {
  it("Caches node styles at small scale", () => {
    const feature = new Feature({ type: "Point", geometry: new Point([1, 2]) });
    const resolution = NODE_RESOLUTION_BREAKPOINT + 1;
    const nodeStyles = new Map<Feature, NodeStyle>();

    const styles = createAndSaveNodeStyle(
      feature,
      resolution,
      setNodeStyle,
      nodeStyles,
    );

    expect(styles.length).toEqual(1);
    expect(nodeStyles.size).toEqual(1);
  });
  it("Caches node styles at large scale", () => {
    const feature = new Feature({ type: "Point", geometry: new Point([1, 2]) });
    const resolution = NODE_RESOLUTION_BREAKPOINT - 1;
    const nodeStyles = new Map<Feature, NodeStyle>();

    const styles = createAndSaveNodeStyle(
      feature,
      resolution,
      setNodeStyle,
      nodeStyles,
    );

    expect(styles.length).toEqual(1);
    expect(nodeStyles.size).toEqual(1);
  });
});

describe("setNodeStyle", () => {
  it("Checks created EdgeStyle", () => {
    const feature = new Feature({ type: "Point" });
    const resolution = NODE_RESOLUTION_BREAKPOINT - 1;
    const nodeStyles = new Map<Feature, NodeStyle>();
    const style: Style = new Style();

    setNodeStyle(feature, resolution, style, nodeStyles);

    expect(nodeStyles.size).toEqual(1);
    expect(nodeStyles.has(feature)).toBeTruthy();
    expect(nodeStyles.get(feature)?.style).toEqual(style);
    expect(nodeStyles.get(feature)?.selected).toBeFalsy();
    expect(nodeStyles.get(feature)?.resolution).toEqual(resolution);
    expect(nodeStyles.get(feature)?.coordinates).toEqual(
      (
        feature.getGeometry() as SimpleGeometry | undefined
      )?.getFlatCoordinates(),
    );
  });
});
