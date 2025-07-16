import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
// import Stroke from "ol/style/Stroke";
// import Style from "ol/style/Style";
import { getSchemaStyle } from "../map-style/get-schema-style";

// const styles: Style[] = [];

export function getLinesLayer() {
  return new VectorLayer({
    source: new VectorSource({ wrapX: false }),
    style: getSchemaStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 5,
  });
}

// function schemaStyleFunction() {
//   // const lineLayerStore = useLineLayerStore();
//   // if (lineLayerStore.styles.length === 0) {
//   //   const styles = createLinesStyle();
//   //   lineLayerStore.setStyles(styles);
//   // }
//   if (styles.length === 0) {
//     styles = createLinesStyle();
//   }
//   return styles;
// }

// function createLinesStyle() {
//   const styles = [];
//   const stroke = new Stroke({
//     width: 3,
//     color: "#CC242D",
//   });
//   styles.push(
//     new Style({
//       stroke,
//     }),
//   );
//   return styles;
// }
