import VectorLayer from "ol/layer/Vector";
import { createInteractions, Interactions } from "./create-interactions";
import { Feature, Map } from "ol";
import { Select } from "ol/interaction";
import { SelectEvent } from "ol/interaction/Select";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";

export interface IInteractionsManager {
  init: () => void;
  getSelect: () => Select | undefined;
}

export class InteractionsManager implements IInteractionsManager {
  constructor(
    map: Map,
    layer: VectorLayer<VectorSource<Feature<Geometry>>>,
    onSelect: (e: SelectEvent) => void,
  ) {
    this._map = map;
    this._layer = layer;
    this._onSelect = onSelect;
  }

  private _map: Map;
  private _layer: VectorLayer<VectorSource<Feature<Geometry>>>;
  private _interactions: Interactions = { snap: undefined, select: undefined };
  private _onSelect: (e: SelectEvent) => void;

  init() {
    this.dropInteractions();
    this.initSelectMode();
  }

  private dropInteractions() {
    this.dropSnap();
    this.dropSelect();
  }

  private dropSnap() {
    if (this._interactions.snap != null) {
      this._map.removeInteraction(this._interactions.snap);
      this._interactions.snap = undefined;
    }
  }

  private dropSelect() {
    if (this._interactions.select != null) {
      this._map.removeInteraction(this._interactions.select);
      this._interactions.select = undefined;
    }
  }

  private initSelectMode() {
    this._interactions = createInteractions(this._layer, this._onSelect);
    this.addSelect();
    this.addSnap();
  }

  private addSelect() {
    if (this._interactions.select != null)
      this._map.addInteraction(this._interactions.select);
  }

  private addSnap() {
    if (this._interactions.snap != null)
      this._map.addInteraction(this._interactions.snap);
  }

  getSelect() {
    return this._interactions.select;
  }
}
