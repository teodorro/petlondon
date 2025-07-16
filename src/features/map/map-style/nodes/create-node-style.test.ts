import { describe, expect, it } from "vitest";
import { Feature } from "ol";
import { NODE_RESOLUTION_BREAKPOINT } from "./node-utils";
import { createNodeStyle } from "./create-node-style";
import { Point } from "ol/geom";

describe("createNodeStyle", () => {
  it("Creates node style at small scale", () => {
    const feature = new Feature({ type: "Point", geometry: new Point([1, 2]) });
    const resolution = NODE_RESOLUTION_BREAKPOINT + 1;

    const style = createNodeStyle(feature, resolution);

    expect(style).not.toBeNull();
    expect(style.getImage()).not.toBeNull();
    expect(style.getText()).toBeNull();
    expect(style.getGeometry).not.toBeNull();
  });

  it("Creates node style at large scale", () => {
    const feature = new Feature({ type: "Point", geometry: new Point([1, 2]) });
    const resolution = NODE_RESOLUTION_BREAKPOINT - 1;

    const style = createNodeStyle(feature, resolution);

    expect(style).not.toBeNull();
    expect(style.getImage()).not.toBeNull();
    expect(style.getText()).not.toBeNull();
    expect(style.getGeometry).not.toBeNull();
  });
});
