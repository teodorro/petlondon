import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  useValidLinesQuery,
  useLineModesQuery,
} from "../../services/line-service";
import { useLineStore } from "../../stores/line-store";
import { createSelectors } from "../../utils/create-selectors";
import { Box } from "@mui/material";
import { lineColors, LineModeName } from "../../utils/line-colors";
import { makeKebabReadable } from "../../utils/text-utils";

type Item = {
  name: string;
  count: number;
};

export default function ModeNumberLines() {
  const numberWidth = 30;
  const stubWidth = 150;
  const xScaleHeight = 30;

  const selectors = createSelectors(useLineStore);

  const lines = selectors.use.lines();
  const modes = selectors.use.modes();

  const setLines = selectors.use.setLines();
  const setModes = selectors.use.setModes();

  const [size, setSize] = useState({ width: 0, height: 0 });

  const rawData = useRef<Item[]>([]);
  const maxCount = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);

  const getLineModes = useLineModesQuery();
  const getAllValidLines = useValidLinesQuery();

  useEffect(() => {
    setModes(getLineModes.data ?? []);
  }, [getLineModes.data]);

  useEffect(() => {
    setLines(getAllValidLines.data ?? []);
  }, [getAllValidLines.data]);

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
    const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
    const chartWidth = size.width - chartMargin.left - chartMargin.right;
    const chartHeight = size.height - chartMargin.top - chartMargin.bottom;
    initSvg(chartWidth, chartHeight);
  }, [size.width, size.height]);

  useEffect(() => {
    if (!size.width || !size.height) return;
    const data = rawData.current.filter((item) => item.count > 0);
    data.sort((a, b) => b.count - a.count);
    maxCount.current = Math.max(...data.map((item) => item.count));
    const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
    const chartWidth = size.width - chartMargin.left - chartMargin.right;
    const chartHeight = size.height - chartMargin.top - chartMargin.bottom;

    if (svgD3Ref.current == null) return;
    const svg = svgD3Ref.current;

    const innerChart = getInnerChart(svg, chartMargin.left, chartMargin.top);
    const xScale = createXScale(chartWidth);
    const yScale = createYScale(chartHeight, data);
    const barGroups = addBarGroups(innerChart, data, yScale);
    addStub(barGroups);
    addBars(barGroups, xScale, yScale);
    addCountRightToBars(barGroups, xScale);
    addBottomAxis(innerChart, xScale, chartHeight);
  }, [size, modes, lines]);

  const addBottomAxis = (
    innerChart: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleLogarithmic<number, number, never>,
    chartHeight: number,
  ) => {
    const bottomAxis = d3.axisBottom(xScale);
    innerChart
      .append("g")
      .attr(
        "transform",
        `translate(${stubWidth}, ${chartHeight - xScaleHeight + 5})`,
      )
      .call(bottomAxis);
  };

  const addCountRightToBars = (
    barGroups: d3.Selection<
      d3.BaseType | SVGGElement,
      Item,
      SVGGElement,
      unknown
    >,
    xScale: d3.ScaleLogarithmic<number, number, never>,
  ) => {
    barGroups
      .append("text")
      .text((d) => d.count)
      .attr("y", 24)
      .attr("x", stubWidth + 5)
      .style("font-size", "12px")
      .style("fill", "var(--theme-text-primary-color)")
      .transition()
      .duration(500)
      .attr(
        "x",
        (d) => stubWidth + xScale(d.count === 1 ? d.count + 0.05 : d.count) + 4,
      );
  };

  const addStub = (
    barGroups: d3.Selection<
      d3.BaseType | SVGGElement,
      Item,
      SVGGElement,
      unknown
    >,
  ) => {
    barGroups
      .append("text")
      .text((d) => makeKebabReadable(d.name))
      .attr("x", stubWidth - 4)
      .attr("y", 24)
      .attr("text-anchor", "end")
      .style("fill", "var(--theme-text-primary-color)")
      .style("font-size", "12px");
  };

  const addBars = (
    barGroups: d3.Selection<
      d3.BaseType | SVGGElement,
      Item,
      SVGGElement,
      unknown
    >,
    xScale: d3.ScaleLogarithmic<number, number, never>,
    yScale: d3.ScaleBand<string>,
  ) => {
    barGroups
      .append("rect")
      .attr("height", yScale.bandwidth())
      .attr("x", stubWidth)
      .transition()
      .duration(500)
      .attr("width", (d) => xScale(d.count === 1 ? d.count + 0.05 : d.count))
      .attr("y", 0)
      .attr("fill", (d) => getColor(d));
  };

  const addBarGroups = (
    innerChart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: Item[],
    yScale: d3.ScaleBand<string>,
  ): d3.Selection<d3.BaseType | SVGGElement, Item, SVGGElement, unknown> =>
    innerChart
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0, ${yScale(d.name)})`);

  const createYScale = (
    chartHeight: number,
    data: Item[],
  ): d3.ScaleBand<string> =>
    d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartHeight - xScaleHeight])
      .paddingInner(0.2);

  const createXScale = (
    chartWidth: number,
  ): d3.ScaleLogarithmic<number, number, never> =>
    d3
      .scaleLog()
      .domain([1, maxCount.current + 1])
      .range([0, chartWidth - stubWidth - numberWidth])
      .nice();

  const getInnerChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    marginLeft: number,
    marginTop: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined> =>
    svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`);

  const initSvg = (chartWidth: number, chartHeight: number) => {
    if (svgD3Ref.current) {
      svgD3Ref.current.selectAll("*").remove();
      svgD3Ref.current.attr("width", chartWidth).attr("height", chartHeight);
    } else {
      svgD3Ref.current = d3
        .select(containerRef.current)
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
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
      ></div>
    </Box>
  );
}
