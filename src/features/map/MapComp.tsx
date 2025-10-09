import { useEffect, useRef } from "react";
import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import { Layer } from "ol/layer";
import { useThemeStore } from "../../stores/theme-store";
import { Box } from "@mui/material";
import { createSelectors } from "../../utils/create-selectors";
import { getTileLayer } from "./get-layer/get-tile-layer";
import {
  useTubeRoutesQueries,
  useValidLinesQuery,
} from "../../services/line-service";
import { useLineStore } from "../../stores/line-store";
import { TUBE } from "../../types/lines/dto-line";
import { getLinesLayer } from "./get-layer/get-lines-layer";
import { DtoRouteSequence } from "../../types/lines/dto-route-sequence";
import { loadLinesToSchema } from "./load-objects-to-schema/load-lines-to-schema";
import VectorSource from "ol/source/Vector";
import { useShowQueriesError, useShowQueryError } from "../../utils/show-error";
import { useSelectedFeatureStore } from "../../stores/selected-feature-store";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {
  IInteractionsManager,
  InteractionsManager,
} from "./interactions/interactions-manager";
import Select, { SelectEvent } from "ol/interaction/Select";

export default function MapComp() {
  const tileLayer = useRef<Layer>(null);
  const linesLayer = useRef<VectorLayer<
    VectorSource<Feature<Geometry>>
  > | null>(null);
  const interactionsManager = useRef<IInteractionsManager | undefined>(
    undefined,
  );

  const themeSelectors = createSelectors(useThemeStore);
  const themeMode = themeSelectors.use.mode();

  const selectedFeatureStore = useSelectedFeatureStore();

  const lineSelectors = createSelectors(useLineStore);
  const lines = lineSelectors.use.lines();
  const routeSequences = lineSelectors.use.routeSequences();
  const setLines = lineSelectors.use.setLines();
  const setRouteSequences = lineSelectors.use.setRouteSequences();

  const getAllValidLinesQuery = useValidLinesQuery();
  const getTubeRoutesQueries = useTubeRoutesQueries(
    lines == null || lines.length === 0
      ? []
      : lines.filter((line) => line.modeName === TUBE).map((line) => line.id),
    {
      enabled: false,
    },
  );

  useShowQueriesError(
    getTubeRoutesQueries,
    (msg) => `Error requesting tube routes\n${msg}`,
  );
  useShowQueryError(
    getAllValidLinesQuery,
    (msg) => `Error requesting all valid lines\n${msg}`,
  );

  useEffect(() => {
    setLines(getAllValidLinesQuery.data ?? []);
  }, [getAllValidLinesQuery.data]);

  useEffect(() => {
    getTubeRoutesQueries.forEach((query) => query.refetch());
  }, [lines]);

  useEffect(() => {
    const allDataReady = getTubeRoutesQueries.every((query) => query.data);
    if (!allDataReady) return;

    const routesSeqs: DtoRouteSequence[] = [];
    getTubeRoutesQueries.forEach((query) => {
      if (query.data != null && linesLayer.current != null) {
        const routeSequence = query.data as DtoRouteSequence;
        routesSeqs.push(routeSequence);
      }
    });
    setRouteSequences(routesSeqs);
  }, [
    getTubeRoutesQueries
      .map((q) => (q.data as DtoRouteSequence)?.lineId || null)
      .join("-"),
  ]);

  useEffect(() => {
    loadRouteSequencesToSchema();
  }, [routeSequences]);

  useEffect(() => {
    const view = getView();
    tileLayer.current = getTileLayer(themeMode);
    linesLayer.current = getLinesLayer();
    const map = getMap(view, [tileLayer.current, linesLayer.current]);
    if (routeSequences != null && routeSequences.length !== 0) {
      loadRouteSequencesToSchema();
    }
    if (map != null) {
      initInteractions(map, linesLayer.current);
    }
    return () => {
      map.setTarget(undefined);
    };
  }, [themeMode]);

  useEffect(() => {
    console.log(selectedFeatureStore.selectedFeature);
  }, [selectedFeatureStore.selectedFeature]);

  const loadRouteSequencesToSchema = () => {
    if (linesLayer.current == null) return;
    (linesLayer.current.getSource() as VectorSource).clear();
    routeSequences.forEach((routeSequence) =>
      loadLinesToSchema(linesLayer.current!, routeSequence),
    );
  };

  const initInteractions = (
    map: Map,
    schemaLayer: VectorLayer<VectorSource<Feature<Geometry>>>,
  ) => {
    interactionsManager.current = new InteractionsManager(
      map,
      schemaLayer,
      selectOnClick,
    );
    interactionsManager.current.init();
  };

  const selectOnClick = (e: SelectEvent) => {
    const features = (e.target as Select).getFeatures().getArray();
    if (features.length === 0) {
      selectedFeatureStore.setSelectedFeature(null);
      return;
    }
    const feature = features[0];
    selectedFeatureStore.setSelectedFeature(feature);
  };

  return <Box id="map" sx={{ width: 1, height: 1 }}></Box>;
}

const getView = (): View => {
  return new View({
    center: fromLonLat([-0.12, 51.51]),
    zoom: 10,
    extent: [-202513.341856, 6561017.966314, 186327.095083, 6856950.728974],
  });
};

const getMap = (view: View, layers: Layer[]): Map => {
  return new Map({
    target: "map",
    layers: layers,
    view,
  });
};
