import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  useValidLinesQuery,
  useLineModesQuery,
} from "../../services/line-service";
import { Box, CircularProgress } from "@mui/material";
import { lineColors, LineModeName } from "../../utils/line-colors";
import { makeKebabReadable } from "../../utils/text-utils";
import { useShowQueryError } from "../../utils/show-error";

type Item = {
  name: string;
  count: number;
};

export default function ModeNumberLines() {
  const numberWidth = 30;
  const stubWidth = 150;
  const xScaleHeight = 30;
  const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };

  const [size, setSize] = useState({ width: 0, height: 0 });

  const rawData = useRef<Item[]>([]);
  const maxCount = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);
  const xScale = useRef<d3.ScaleLogarithmic<number, number, never>>(
    d3.scaleLog().domain([1, 10]).range([0, 100]),
  );

  const getLineModesQuery = useLineModesQuery();
  const getAllValidLinesQuery = useValidLinesQuery();

  const modes = useMemo(
    () => getLineModesQuery.data ?? [],
    [getLineModesQuery.data],
  );
  const lines = useMemo(
    () => getAllValidLinesQuery.data ?? [],
    [getAllValidLinesQuery.data],
  );

  const getChartWidth = (): number =>
    Math.max(0, size.width - chartMargin.left - chartMargin.right);
  const getChartHeight = (): number =>
    Math.max(0, size.height - chartMargin.top - chartMargin.bottom);

  useShowQueryError(
    getAllValidLinesQuery,
    (msg) => `Error requesting all valid lines\n${msg}`,
  );
  useShowQueryError(
    getLineModesQuery,
    (msg) => `Error requesting line modes\n${msg}`,
  );

  useEffect(() => {
    calcNumberOfLines();
  }, [modes, lines]);

  // ResizeObserver to track container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) return;
    const chartWidth = getChartWidth();
    const chartHeight = getChartHeight();
    initSvg(chartWidth, chartHeight);
    if (svgD3Ref.current == null) return;

    const data = getPreparedData();
    const innerChart = getInnerChart(
      svgD3Ref.current,
      chartMargin.left,
      chartMargin.top,
    );
    createXScale(chartWidth);
    const yScale = createYScale(chartHeight, data);
    const barGroups = addBarGroups(innerChart, data, yScale);
    addStub(barGroups, yScale);
    addBars(barGroups, yScale);
    addCountRightToBars(barGroups, yScale);
    addBottomAxis(innerChart, chartHeight);
  }, [size, modes, lines, svgD3Ref, rawData.current]);

  const getPreparedData = (): Item[] => {
    let data = rawData.current.filter((item) => item.count > 0);
    data = data.sort((a, b) => b.count - a.count);
    maxCount.current = Math.max(...data.map((item) => item.count));
    return data;
  };

  const addBottomAxis = (
    innerChart: d3.Selection<
      d3.BaseType | SVGGElement,
      null,
      SVGSVGElement,
      unknown
    >,
    chartHeight: number,
  ) => {
    const bottomAxisGroup = innerChart
      .selectAll(".axis-x")
      .data([null])
      .join(
        (enter) => enter.append("g").attr("class", "axis-x"),
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr("class", "axis-x")
      .attr(
        "transform",
        `translate(${stubWidth}, ${chartHeight - xScaleHeight + 5})`,
      );
    const bottomAxis = d3.axisBottom(xScale.current);
    bottomAxisGroup
      .transition()
      .duration(500)
      .call(bottomAxis as any);
    bottomAxisGroup
      .selectAll(".tick text")
      .attr("transform", "translate(5,0)")
      .style("text-anchor", "end");
  };

  const addCountRightToBars = (
    barGroups: d3.Selection<SVGGElement, Item, d3.BaseType | SVGGElement, null>,
    yScale: d3.ScaleBand<string>,
  ) => {
    barGroups
      .selectAll("text.count-label")
      .data((d) => [d])
      .join(
        (enter) => {
          const entered = enter
            .append("text")
            .text((d) => d.count)
            .attr("class", "count-label")
            .attr("x", stubWidth + 5)
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", "var(--theme-text-primary-color)");
          entered
            .transition()
            .duration(500)
            .attr("x", (d) => getBarEndX(d));
          return entered;
        },
        (update) =>
          update
            .text((d) => d.count)
            .transition()
            .duration(500)
            .attr("x", (d) => getBarEndX(d)),
      );
  };

  const getBarEndX = (d: Item): number =>
    stubWidth + xScale.current(d.count === 1 ? d.count + 0.05 : d.count) + 4;

  const addStub = (
    barGroups: d3.Selection<SVGGElement, Item, d3.BaseType | SVGGElement, null>,
    yScale: d3.ScaleBand<string>,
  ) => {
    barGroups
      .selectAll("text.name-label")
      .data((d) => [d])
      .join((enter) =>
        enter
          .append("text")
          .text((d) => makeKebabReadable(d.name))
          .attr("class", "name-label")
          .attr("x", stubWidth - 4)
          .attr("y", yScale.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .style("font-size", "12px")
          .style("fill", "var(--theme-text-primary-color)"),
      );
  };

  const addBars = (
    barGroups: d3.Selection<SVGGElement, Item, d3.BaseType | SVGGElement, null>,
    yScale: d3.ScaleBand<string>,
  ) => {
    barGroups
      .selectAll("rect")
      .data((d) => [d])
      .join("rect")
      .attr("x", stubWidth)
      .attr("y", 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => getColor(d))
      .transition()
      .duration(500)
      .attr("width", (d) =>
        xScale.current(d.count === 1 ? d.count + 0.05 : d.count),
      );
  };

  const addBarGroups = (
    innerChart: d3.Selection<
      d3.BaseType | SVGGElement,
      null,
      SVGSVGElement,
      unknown
    >,
    data: Item[],
    yScale: d3.ScaleBand<string>,
  ): d3.Selection<SVGGElement, Item, d3.BaseType | SVGGElement, null> => {
    const barGroups = innerChart
      .selectAll<SVGGElement, Item>("g.bar-group")
      .data(data, (d) => d.name)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", (d) => `translate(0, ${yScale(d.name)})`),
        (update) =>
          update.attr("transform", (d) => `translate(0, ${yScale(d.name)})`),
        (exit) => exit.remove(),
      );

    return barGroups;
  };

  const createYScale = (
    chartHeight: number,
    data: Item[],
  ): d3.ScaleBand<string> =>
    d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartHeight - xScaleHeight])
      .paddingInner(0.2);

  const createXScale = (chartWidth: number): void => {
    xScale.current
      .domain([1, maxCount.current + 1])
      .range([0, chartWidth - stubWidth - numberWidth])
      .nice();
  };

  const getInnerChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    marginLeft: number,
    marginTop: number,
  ): d3.Selection<d3.BaseType | SVGGElement, null, SVGSVGElement, unknown> =>
    svg
      .selectAll(".inner-chart")
      .data([null])
      .join("g")
      .attr("class", "inner-chart")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

  const initSvg = (width: number, height: number) => {
    if (!containerRef.current) return;
    if (svgD3Ref.current) {
      svgD3Ref.current.attr("width", width).attr("height", height);
    } else {
      svgD3Ref.current = d3
        .select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("max-width", "100%")
        .style("max-height", "100%")
        .style("overflow", "visible");
    }
  };

  const calcNumberOfLines = () => {
    if (modes == null || lines == null) return;
    rawData.current = [];
    const dataLog: Item[] = [];
    modes.forEach((mode) => {
      const num = lines.filter(
        (line) => line.modeName === mode.modeName,
      ).length;
      rawData.current.push({ name: mode.modeName, count: num });
      dataLog.push({ name: mode.modeName, count: Math.log(num) + 1 });
    });
  };

  const getColor = (d: Item): string => lineColors[d.name as LineModeName];

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "var(--theme-background-color)",
          fontSize: "16pt",
          pt: 2,
        }}
      >
        Mode vs Number of lines
      </Box>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "500px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "var(--theme-background-color)",
        }}
      >
        {modes.length === 0 && lines.length === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </div>
    </Box>
  );
}
