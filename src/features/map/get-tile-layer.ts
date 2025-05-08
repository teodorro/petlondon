import TileLayer from "ol/layer/Tile";
import { ThemeMode } from "../../stores/theme-store";
import { OSM } from "ol/source";

export function getTileLayer(themeMode: ThemeMode): TileLayer {
  const layer = new TileLayer({
    source: new OSM(),
  });
  if (themeMode === 'dark') {
    layer.on('prerender', makeColorsDark);
    layer.on('postrender', stopFilteringColors);
  }
  return layer;
}

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