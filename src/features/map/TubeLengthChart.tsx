import { Box } from "@mui/material";
import Feature from "ol/Feature";
import { SimpleGeometry } from "ol/geom";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { DtoStopPoint } from "../../types/stop-points/dto-stop-point";
import { distance } from "@turf/turf";
import { useThemeStore } from "../../stores/theme-store";
import { groupSmoothGeometryByStops, pathLengthKm } from "./tube-length-utils";

type Props = {
  line: Feature<SimpleGeometry>;
};

export default function TubeLengthChart({ line }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const themeMode = useThemeStore((s) => s.mode);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(
      chartRef.current,
      themeMode === "dark" ? "dark" : undefined,
    );

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    const stopPointsLonLat: [number, number][] = line
      .getProperties()
      .stopPoints.map((stop: unknown) => [
        (stop as DtoStopPoint).lon,
        (stop as DtoStopPoint).lat,
      ]);

    const directDistances: number[] = [];
    for (let i = 0; i < stopPointsLonLat.length - 1; i++) {
      const d = distance(stopPointsLonLat[i], stopPointsLonLat[i + 1], {
        units: "kilometers",
      });
      directDistances.push(d);
    }
    const smoothGeometry = line.getGeometry()?.getCoordinates() as unknown as [
      number,
      number,
    ][];

    const smoothDistances: number[] = smoothGeometry
      ? groupSmoothGeometryByStops(smoothGeometry, stopPointsLonLat).map(
          pathLengthKm,
        )
      : [];

    chart.setOption({
      title: { text: "Line Lengths Comparison" },
      legend: {
        orient: "vertical",
        right: 10,
        top: 30,
      },
      backgroundColor: "transparent",
      xAxis: {
        type: "category",
        data: Array.from(
          { length: line.getProperties().stopPoints.length - 1 },
          (_, i) => i + 1,
        ),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Direct",
          data: directDistances,
          type: "line",
          color: "red",
        },
        {
          name: "Smoothed",
          data: smoothDistances,
          type: "line",
          color: "blue",
        },
      ],
      grid: {
        left: 30,
        right: 140,
        top: 60,
        bottom: 20,
        containLabel: true,
      },
    });

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [line, themeMode]);

  return (
    <Box
      sx={{
        width: "calc(100% - 1rem)",
        height: "40%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor:
          themeMode === "dark"
            ? "var(--theme-background-paper-color)"
            : "var(--theme-background-color)",
        borderRadius: "1rem",
        padding: "0.5rem",
        margin: "0.5rem",
      }}
    >
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
