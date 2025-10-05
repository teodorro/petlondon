import { describe, expect, it } from "vitest";
import { createLineFeature } from "./create-line-feature";
import { SimpleGeometry } from "ol/geom";

describe("create", () => {
  it("converts line with lan and lot to feature with lan and lot", () => {
    const name = "asd-qwe";
    const points: [number, number][] = [
      [123, 456],
      [234, 567],
    ];

    const feature = createLineFeature(name, points);
    const flatCoords = (
      feature.getGeometry() as SimpleGeometry
    ).getFlatCoordinates();
    expect(feature.getProperties().name).toEqual("asd-qwe");
    expect(flatCoords.length).toEqual(points.length * 2);
    expect(flatCoords[1]).toEqual(points[0][1]);
    expect(flatCoords[3]).toEqual(points[1][1]);
  });
});
