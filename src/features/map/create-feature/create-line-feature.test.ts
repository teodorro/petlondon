import { describe, expect, it } from "vitest";
import { fromLonLat } from "ol/proj";
import { createLineFeature } from "./create-line-feature";
import { SimpleGeometry } from "ol/geom";

describe("create", () => {
  it("converts line with lan and lot to feature with lan and lot", () => {
    const name = "asd-qwe";
    const points = [
      {
        commonName: "asd",
        lon: 123,
        lat: 456,
      },
      {
        commonName: "qwe",
        lon: 234,
        lat: 567,
      },
    ];

    const feature = createLineFeature(name, points);
    const coordsStart = fromLonLat([points[0].lon, points[0].lat]);
    const coordsEnd = fromLonLat([points[1].lon, points[1].lat]);
    const flatCoords = (
      feature.getGeometry() as SimpleGeometry
    ).getFlatCoordinates();
    expect(feature.getProperties().name).toEqual("asd-qwe");
    expect(flatCoords[0]).toEqual(coordsStart[0]);
    expect(flatCoords[1]).toEqual(coordsStart[1]);
    expect(flatCoords[2]).toEqual(coordsEnd[0]);
    expect(flatCoords[3]).toEqual(coordsEnd[1]);
  });
});
