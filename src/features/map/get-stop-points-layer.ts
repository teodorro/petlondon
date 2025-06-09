import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function getStopPointsLayer() {
  return new VectorLayer({
    source: new VectorSource({ wrapX: false }),
    // style: schemaStyleFunction,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 4,
  });
}