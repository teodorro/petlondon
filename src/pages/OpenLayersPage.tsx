import { Box } from "@mui/material";
import MapComp from "../features/map/MapComp";
import TubeLengthChart from "../features/map/TubeLengthChart";
import { useSelectedFeatureStore } from "../stores/selected-feature-store";
import Feature from "ol/Feature";
import { SimpleGeometry } from "ol/geom";

export default function OpenLayersPage() {
  const selectedFeature = useSelectedFeatureStore((s) => s.selectedFeature);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <MapComp></MapComp>
      {selectedFeature &&
        (selectedFeature as Feature<SimpleGeometry>)
          .getGeometry()
          ?.getType() === "LineString" && (
          <TubeLengthChart
            line={selectedFeature as Feature<SimpleGeometry>}
          ></TubeLengthChart>
        )}
    </Box>
  );
}
