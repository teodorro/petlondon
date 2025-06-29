import { Circle } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
// import { useLineLayerStore } from "../../stores/line-layer-store";

let styles: Style[] = [];

export function getLinesLayer() {
  return new VectorLayer({
    source: new VectorSource({ wrapX: false }),
    // style: {
    //   'fill-color': 'rgba(255, 255, 255, 0.6)',
    //   'stroke-color': '#ff6633',
    //   'stroke-width': 2,
    //   'circle-radius': 7,
    //   'circle-fill-color': '#ff6633',
    // },
    style: schemaStyleFunction(),
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 5,
  });
}

function schemaStyleFunction() {
  // const lineLayerStore = useLineLayerStore();
  // if (lineLayerStore.styles.length === 0) {
  //   const styles = createLinesStyle();
  //   lineLayerStore.setStyles(styles);
  // }
  if (styles.length === 0) {
    styles = createLinesStyle();
  }
  return styles;
}

function createLinesStyle() {
  const styles = [];
  const stroke = new Stroke({
    width: 3,
    color: '#CC242D',
  });
  // const fill = new Fill({ color: '#CC242D' });
  // const circle = new Circle({
  //   fill,
  //   stroke,
  //   radius: 3,
  // });
  styles.push(
    new Style({
      stroke,
      // image: {
      //   circle,
      //   fill,
      //   stroke,
      // },
    })
  );
  return styles;
}
