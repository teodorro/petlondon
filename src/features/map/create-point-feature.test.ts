import { describe, expect, it } from "vitest";
import { createPointFeature } from "./create-point-feature";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";

describe('create', () => {
  it('converts node with lan and lot to feature with lan and lot', () => {
    const node = {
      commonName: "qwe",
      lon: 123,
      lat: 456,
    }

    const feature = createPointFeature(node);
    const coords = fromLonLat([node.lon, node.lat])

    expect(feature.getProperties().name).toEqual("qwe");
    expect((feature.getGeometry() as Point).getCoordinates()[0]).toEqual(coords[0])
    expect((feature.getGeometry() as Point).getCoordinates()[1]).toEqual(coords[1])
  })
})