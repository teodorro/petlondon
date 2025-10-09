import { Select, Snap } from "ol/interaction";
import { SelectEvent } from "ol/interaction/Select";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import * as OlCondition from "ol/events/condition";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { getSchemaStyleWithSelection } from "../map-style/get-schema-style";

export type Interactions = {
  select?: Select;
  snap?: Snap;
};

export const createInteractions = (
  layer: VectorLayer<VectorSource<Feature<Geometry>>>,
  onSelect: (e: SelectEvent) => void,
): Interactions => {
  const layerSource = layer.getSource();
  if (layerSource == null)
    throw new Error(
      "Initializing interactions on not initialized layer source",
    );
  return {
    select: createLayerSelectInteraction(layer, onSelect),
    snap: createLayerSnapInteraction(layerSource),
  };
};

const createLayerSelectInteraction = (
  layer: VectorLayer<VectorSource<Feature<Geometry>>>,
  onSelect: (e: SelectEvent) => void,
) => {
  const select = new Select({
    condition: OlCondition.click,
    style: getSchemaStyleWithSelection,
    layers: [layer],
  });
  select.on("select", onSelect);
  return select;
};

const createLayerSnapInteraction = (
  source: VectorSource<Feature<Geometry>>,
) => {
  const snap = new Snap({ source });
  // snap.on('change', (e: BaseEvent) => {
  //   console.log(e);
  // });
  return snap;
};
