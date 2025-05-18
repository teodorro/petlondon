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
import { getTileLayer } from './get-tile-layer';
import { loadBikesToSchema } from './load-objects-to-schema';
import { getBikeLayer } from './get-bike-layer';

export default function MapComp() {
  const tileLayer = useRef<Layer>(null);
  const bikeLayer = useRef<Layer>(null);

  const themeStoreSelectors = createSelectors(useThemeStore);
  const themeMode = themeStoreSelectors.use.mode();
  const bikeStoreSelectors = createSelectors(useBikeStore);
  const setBikePoints = bikeStoreSelectors.use.setBikePoints();
  const bikePoints = bikeStoreSelectors.use.bikePoints();

  const getAllBikePointLocations = useAllBikePointLocations();

  useEffect(() => {
    const view = getView();
    tileLayer.current = getTileLayer(themeMode);
    bikeLayer.current = getBikeLayer();
    loadBikesToSchema(bikeLayer.current, bikePoints);
    const map = getMap(view, [tileLayer.current, bikeLayer.current]);
    return () => {
      map.setTarget(undefined);
    };
  }, [themeMode]);
  useEffect(() => {
    setBikePoints(getAllBikePointLocations.data);
    if (bikeLayer.current != null)
      loadBikesToSchema(bikeLayer.current, bikePoints);
  }, [getAllBikePointLocations.data]);

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
