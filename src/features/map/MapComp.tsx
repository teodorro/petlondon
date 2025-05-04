import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { Layer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { useThemeStore } from '../../stores/theme-store';
import { Box } from '@mui/material';

export default function MapComp() {
  const themeStore = useThemeStore();

  useEffect(() => {
    const view = getView();
    const map = getMap(view, [getTileLayer()]);
    return () => {
      map.setTarget(undefined);
    };
  }, [themeStore.mode]);

  const getTileLayer = (): TileLayer => {
    const layer = new TileLayer({
      source: new OSM(),
    });
    if (themeStore.mode === 'dark') {
      layer.on('prerender', makeColorsDark);
      layer.on('postrender', stopFilteringColors);
    }
    return layer;
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
    target: 'map',
    layers: layers,
    view,
  });
};

const makeColorsDark = (evt: { context: unknown }) => {
  if (evt.context) {
    const context = evt.context as CanvasRenderingContext2D;
    context.filter = 'grayscale(80%) invert(100%) ';
    context.globalCompositeOperation = 'source-over';
  }
};

const stopFilteringColors = (evt: { context: unknown }) => {
  if (evt.context) {
    const context = evt.context as CanvasRenderingContext2D;
    context.filter = 'none';
  }
};
