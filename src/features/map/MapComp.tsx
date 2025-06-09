import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Layer } from 'ol/layer';
import { useThemeStore } from '../../stores/theme-store';
import { Box } from '@mui/material';
import { useAllBikePointLocations } from '../../services/bike-point-service';
import { createSelectors } from '../../utils/create-selectors';
import { useBikeStore } from '../../stores/bike-store';
import { useStopPointsStore } from '../../stores/stop-points-store';
import { getTileLayer } from './get-tile-layer';
import { loadBikesToSchema } from './load-objects-to-schema';
import { loadStopPointsToSchema } from './load-objects-to-schema';
import { getBikeLayer } from './get-bike-layer';
import { useGetStopPoints } from '../../services/stop-point-service';
import { getStopPointsLayer } from './get-stop-points-layer';

export default function MapComp() {
  const tileLayer = useRef<Layer>(null);
  // const bikeLayer = useRef<Layer>(null);
  const stopPointsLayer = useRef<Layer>(null);

  const themeSelectors = createSelectors(useThemeStore);
  const themeMode = themeSelectors.use.mode();

  // const bikeSelectors = createSelectors(useBikeStore);
  // const setBikePoints = bikeSelectors.use.setBikePoints();
  // const bikePoints = bikeSelectors.use.bikePoints();

  const stopPointsSelectors = createSelectors(useStopPointsStore);
  const setStopPoints = stopPointsSelectors.use.setStopPoints();
  const stopPoints = stopPointsSelectors.use.stopPoints();

  // const getAllBikePointLocations = useAllBikePointLocations();
  const getTubeStopPoints = useGetStopPoints('tube');

  useEffect(() => {
    const view = getView();
    tileLayer.current = getTileLayer(themeMode);
    // bikeLayer.current = getBikeLayer();
    // loadBikesToSchema(bikeLayer.current, bikePoints);
    stopPointsLayer.current = getStopPointsLayer();
    loadStopPointsToSchema(stopPointsLayer.current, stopPoints);
    const map = getMap(view, [
      tileLayer.current,
      // bikeLayer.current,
      stopPointsLayer.current,
    ]);
    return () => {
      map.setTarget(undefined);
    };
  }, [themeMode]);

  // useEffect(() => {
  //   setBikePoints(getAllBikePointLocations.data);
  //   if (bikeLayer.current != null)
  //     loadBikesToSchema(bikeLayer.current, bikePoints);
  // }, [getAllBikePointLocations.data]);

  useEffect(() => {
    setStopPoints(
      getTubeStopPoints.data == null ? [] : getTubeStopPoints.data.stopPoints
    );
  }, [getTubeStopPoints.data]);

  useEffect(() => {
    if (stopPointsLayer.current != null)
      loadStopPointsToSchema(stopPointsLayer.current, stopPoints);
  }, [stopPoints]);

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
    target: 'map',
    layers: layers,
    view,
  });
};
