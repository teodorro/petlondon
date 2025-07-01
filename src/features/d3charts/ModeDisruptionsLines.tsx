import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import { useLineStore } from "../../stores/line-store";
import { createSelectors } from "../../utils/create-selectors";
import {
  useLineModesQuery,
  useLineDisruptionsQueries,
  useValidLinesQuery,
} from "../../services/line-service";
import { lineColors, LineModeName } from "../../utils/line-colors";
import { DtoDisruption } from "../../types/lines/dto-disruption";
import { makeKebabReadable } from "../../utils/text-utils";

interface ModeDisruptionNode {
  name: string;
  info?: string;
  value?: number;
  children?: ModeDisruptionNode[];
}

type ModeCount = {
  mode: string;
  count: number;
};

export default function ModeDisruptionLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);
  const numberOfLines = useRef<ModeCount[]>([]);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [data, setData] = useState<ModeDisruptionNode | null>(null);

  const selectors = createSelectors(useLineStore);

  const modes = selectors.use.modes();
  const lines = selectors.use.lines();
  const disruptions = selectors.use.disruptions();

  const setModes = selectors.use.setModes();
  const setLines = selectors.use.setLines();
  const addDisruption = selectors.use.addDisruption();

  const getLineModes = useLineModesQuery({ enabled: false });
  const getAllValidLines = useValidLinesQuery();
  const getLineDisruptions = useLineDisruptionsQueries(
    modes == null || lines == null
      ? []
      : modes
          .filter((mode) =>
            lines.some((line) => line.modeName === mode.modeName),
          )
          .map((mode) => mode.modeName),
    {
      enabled: false,
    },
  );

  useEffect(() => {
    setModes(getLineModes.data ?? []);
  }, [getLineModes.data]);

  useEffect(() => {
    setLines(getAllValidLines.data ?? []);
  }, [getAllValidLines.data]);

  useEffect(() => {
    calcNumberOfLines();
    getLineDisruptions.forEach((query) => query.refetch());
  }, [modes, lines]);

  useEffect(() => {
    const allDataReady = getLineDisruptions.every((query) => query.data);

    if (!allDataReady) return;

    getLineDisruptions.forEach((query, index) => {
      const disruptionData = query.data;
      const mode = modes[index];
      if (disruptionData) {
        addDisruption(mode.modeName, disruptionData as DtoDisruption[]);
      }
    });
  }, [
    // to make it run after receiving all disruptions
    getLineDisruptions
      .map((q) => ((q.data as DtoDisruption[]) || null)?.length)
      .join("-"),
  ]);

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
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setSize({ width: clientWidth, height: clientHeight });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(buildHierarchy());
  }, [modes, disruptions, lines]);

  useEffect(() => {
    if (!size.width || !size.height) return;
    const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
    const chartWidth = size.width - chartMargin.left - chartMargin.right;
    const chartHeight = size.height - chartMargin.top - chartMargin.bottom;
    const radius = chartHeight / 2;

    // needed every time because data is asynchronously modified by different queries
    initSvg(chartWidth, chartHeight);

    if (data == null || svgD3Ref.current == null) return;

    const root = partition(data, radius);
    const svg = svgD3Ref.current;

    const innerChart = getInnerChart(
      svg,
      chartMargin.left,
      chartMargin.top,
      chartWidth,
      chartHeight,
    );

    const label = getLabel(innerChart);
    const { arc, mousearc } = createArcGenerators(radius);
    const path = renderSegments(innerChart, root, arc);
    addInteractionLayers(innerChart, root, mousearc, path, label);
  }, [size, data]);

  const addInteractionLayers = (
    innerChart: d3.Selection<SVGGElement, unknown, null, undefined>,
    root: d3.HierarchyRectangularNode<ModeDisruptionNode>,
    mousearc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>,
    path: d3.Selection<
      d3.BaseType | SVGPathElement,
      d3.HierarchyRectangularNode<ModeDisruptionNode>,
      SVGGElement,
      unknown
    >,
    label: d3.Selection<SVGTextElement, unknown, null, undefined>,
  ) => {
    innerChart
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseleave", () => {
        path.attr("fill-opacity", 1);
        label.style("visibility", "hidden");
      })
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          return d.depth && d.x1 - d.x0 > 0.001;
        }),
      )
      .join("path")
      .attr("d", mousearc)
      .on("mouseenter", (event, d) => {
        const sequence = d.ancestors().reverse().slice(1);
        path.attr("fill-opacity", (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3,
        );
        label
          .style("visibility", null)
          .select(".upper-text")
          .text(makeKebabReadable(d.data.name));
        label
          .style("visibility", null)
          .select(".lower-text")
          .text(
            d.data == null || d.data.info == null ? "" : d.data.info.toString(),
          );
      });
  };

  const renderSegments = (
    innerChart: d3.Selection<SVGGElement, unknown, null, undefined>,
    root: d3.HierarchyRectangularNode<ModeDisruptionNode>,
    arc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>,
  ) => {
    return innerChart
      .append("g")
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          return d.depth && d.x1 - d.x0 > 0.001;
        }),
      )
      .join("path")
      .attr(
        "fill",
        (d) => lineColors[(d.data as ModeDisruptionNode).name as LineModeName],
      )
      .attr("d", arc);
  };

  const createArcGenerators = (
    radius: number,
  ): {
    arc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>;
    mousearc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>;
  } => {
    const arc = d3
      .arc<d3.HierarchyRectangularNode<ModeDisruptionNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);

    const mousearc = d3
      .arc<d3.HierarchyRectangularNode<ModeDisruptionNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius(radius);

    return { arc, mousearc };
  };

  const getLabel = (
    innerChart: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) => {
    const label = innerChart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .style("visibility", "hidden");

    label
      .append("tspan")
      .attr("class", "upper-text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-0.1em")
      .attr("font-size", "2em")
      .text("");

    label
      .append("tspan")
      .attr("class", "lower-text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.5em")
      .attr("font-size", "0.75em")
      .text("");

    return label;
  };

  const getInnerChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    marginLeft: number,
    marginTop: number,
    width: number,
    height: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined> =>
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`)
      .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`);

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

  const partition = (data: ModeDisruptionNode, radius: number) =>
    d3.partition<ModeDisruptionNode>().size([2 * Math.PI, radius * radius])(
      d3
        .hierarchy<ModeDisruptionNode>(data)
        .sum((d) => (d as { value: number }).value)
        .sort(
          (a, b) =>
            (b as { value: number }).value - (a as { value: number }).value,
        ),
    );

  const calcNumberOfLines = () => {
    if (modes == null || lines == null) return;
    numberOfLines.current = [];
    modes.forEach((mode) => {
      const num = lines.filter(
        (line) => line.modeName === mode.modeName,
      ).length;
      numberOfLines.current.push({ mode: mode.modeName, count: num });
    });
  };

  const buildHierarchy = (): ModeDisruptionNode => {
    const root: ModeDisruptionNode = {
      name: "root",
      children: [],
    };
    if (modes == null || disruptions == null || lines == null) return root;

    /**
     * 1st level - modes with lines, log scale
     * 2nd level - categories in these modes
     * 3nd level - disruptions if there's not a single one (not made yet. Not needed?)
     */
    const logNumberOfLines = numberOfLines.current
      .filter((item) => item.count > 0)
      .map((x) => ({
        name: x.mode,
        count: Math.log(x.count) + 1,
      }));
    const sumLogs = logNumberOfLines.reduce((ac, cv) => ac + cv.count, 0);
    const partLogNumberOfLines = logNumberOfLines.map((item) => ({
      name: item.name,
      count: item.count / sumLogs,
    }));

    partLogNumberOfLines.forEach((item) => {
      const itemDisruptions = disruptions.get(item.name);
      const currentNode: ModeDisruptionNode = {
        name: item.name,
        info: `${
          numberOfLines.current.find((x) => x.mode === item.name)?.count
        } lines`,
        children: [],
        value:
          itemDisruptions == null || itemDisruptions.length === 0
            ? item.count
            : undefined,
      };
      if (itemDisruptions != null && itemDisruptions.length !== 0) {
        const uniqueCategories = [
          ...new Set(itemDisruptions.map((d) => d.category)),
        ];
        uniqueCategories.forEach((category) => {
          const categoryDisruptions = itemDisruptions.filter(
            (d) => d.category === category,
          );
          const childNode: ModeDisruptionNode = {
            name: category,
            info: `${categoryDisruptions.length} disruptions`,
            children: [],
            value:
              item.count *
              (categoryDisruptions.length / itemDisruptions.length),
          };
          currentNode.children?.push(childNode);
        });
      }
      root.children?.push(currentNode);
    });

    return root;
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "var(--theme-background-color)",
          fontSize: "16pt",
          pt: 2,
        }}
      >
        Mode vs Disruptions
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
