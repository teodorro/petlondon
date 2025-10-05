import { useEffect, useRef, useState } from "react";
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
import { useShowQueriesError, useShowQueryError } from "../../utils/show-error";

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
  const getAllValidLinesQuery = useValidLinesQuery();
  const getLineDisruptionsQueries = useLineDisruptionsQueries(
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

  const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
  const getChartWidth = (): number =>
    Math.max(0, size.width - chartMargin.left - chartMargin.right);
  const getChartHeight = (): number =>
    Math.max(0, size.height - chartMargin.top - chartMargin.bottom);

  useEffect(() => {
    setModes(getLineModes.data ?? []);
  }, [getLineModes.data]);

  useEffect(() => {
    setLines(getAllValidLinesQuery.data ?? []);
  }, [getAllValidLinesQuery.data]);

  useEffect(() => {
    calcNumberOfLines();
    getLineDisruptionsQueries.forEach((query) => query.refetch());
  }, [modes, lines]);

  useEffect(() => {
    const allDataReady = getLineDisruptionsQueries.every((query) => query.data);

    if (!allDataReady) return;

    getLineDisruptionsQueries.forEach((query, index) => {
      const disruptionData = query.data;
      const mode = modes[index];
      if (disruptionData) {
        addDisruption(mode.modeName, disruptionData as DtoDisruption[]);
      }
    });
  }, [
    // to make it run after receiving all disruptions
    getLineDisruptionsQueries
      .map((q) => ((q.data as DtoDisruption[]) || null)?.length)
      .join("-"),
  ]);

  useShowQueriesError(
    getLineDisruptionsQueries,
    (msg) => `Error requesting line disruptions\n${msg}`,
  );
  useShowQueryError(
    getAllValidLinesQuery,
    (msg) => `Error requesting all valid lines\n${msg}`,
  );

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
    if (!size.width || !size.height || !data) return;
    const chartWidth = getChartWidth();
    const chartHeight = getChartHeight();
    const radius = chartHeight / 2 - 10;
    initSvg(chartWidth, chartHeight);

    if (data == null || svgD3Ref.current == null) return;

    const root = partition(data, radius);

    const innerChart = getInnerChart(
      svgD3Ref.current,
      chartMargin.left,
      chartMargin.top,
      chartWidth,
      chartHeight,
    );

    const label = getLabel(innerChart);
    const { arc, mousearc } = createArcGenerators(radius, root);
    renderSegments(innerChart, root, arc);
    addInteractionLayers(innerChart, root, mousearc, label);
  }, [size, data]);

  const getKey = (d: d3.HierarchyRectangularNode<ModeDisruptionNode>) =>
    d
      .ancestors()
      .map((x) => x.data.name)
      .join("/");

  const addInteractionLayers = (
    innerChart: d3.Selection<
      d3.BaseType | SVGGElement,
      null,
      SVGSVGElement,
      unknown
    >,
    root: d3.HierarchyRectangularNode<ModeDisruptionNode>,
    mousearc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>,
    label: d3.Selection<
      d3.BaseType | SVGTextElement,
      null,
      d3.BaseType | SVGGElement,
      null
    >,
  ) => {
    const data = root
      .descendants()
      .filter((d) => d.depth && d.x1 - d.x0 > 0.001);

    const onMouseLeave = () => {
      innerChart.selectAll("g.arcs-group path").attr("fill-opacity", 1);
      label.style("visibility", "hidden");
    };

    const onMouseEnter = (
      _event: unknown,
      d: d3.HierarchyRectangularNode<ModeDisruptionNode>,
    ) => {
      const sequence = new Set(d.ancestors().map((n) => n.data.name));
      innerChart
        .selectAll<
          SVGPathElement,
          d3.HierarchyRectangularNode<ModeDisruptionNode>
        >("g.arcs-group path")
        .attr("fill-opacity", (node) =>
          sequence.has(node.data.name) ? 1.0 : 0.3,
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
    };

    const mouseArcsGroup = innerChart
      .selectAll<SVGGElement, null>("g.mouse-arcs-group")
      .data([null])
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "mouse-arcs-group")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseleave", onMouseLeave),
        (update) => update,
        (exit) => exit.remove(),
      );

    mouseArcsGroup
      .selectAll<
        SVGPathElement,
        d3.HierarchyRectangularNode<ModeDisruptionNode>
      >("path")
      .data(data, getKey)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("d", mousearc)
            .on("mouseenter", onMouseEnter),
        (update) => update.attr("d", mousearc),
        (exit) => exit.remove(),
      );
  };

  const renderSegments = (
    innerChart: d3.Selection<
      d3.BaseType | SVGGElement,
      null,
      SVGSVGElement,
      unknown
    >,
    root: d3.HierarchyRectangularNode<ModeDisruptionNode>,
    arc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>,
  ): d3.Selection<
    SVGPathElement,
    d3.HierarchyRectangularNode<ModeDisruptionNode>,
    SVGGElement,
    null
  > => {
    const data = root
      .descendants()
      .filter((d) => d.depth && d.x1 - d.x0 > 0.001);

    const arcsGroup = innerChart
      .selectAll<SVGGElement, null>("g.arcs-group")
      .data([null])
      .join(
        (enter) => enter.append("g").attr("class", "arcs-group"),
        (update) => update,
        (exit) => exit.remove(),
      );

    const paths = arcsGroup
      .selectAll<
        SVGPathElement,
        d3.HierarchyRectangularNode<ModeDisruptionNode>
      >("path")
      .data(data, getKey)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr(
              "fill",
              (d) =>
                lineColors[(d.data as ModeDisruptionNode).name as LineModeName],
            )
            .attr("d", arc),
        (update) => update.transition().duration(500).attr("d", arc),
        (exit) => exit.remove(),
      );

    return paths;
  };

  const createArcGenerators = (
    fallbackRadius: number,
    root: d3.HierarchyRectangularNode<ModeDisruptionNode>,
  ): {
    arc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>;
    mousearc: d3.Arc<unknown, d3.HierarchyRectangularNode<ModeDisruptionNode>>;
  } => {
    const maxY1 =
      d3.max(root.descendants(), (d) => d.y1) ??
      fallbackRadius * fallbackRadius;
    const realRadius = Math.sqrt(maxY1);
    console.log(realRadius, "realRadius");

    const arc = d3
      .arc<d3.HierarchyRectangularNode<ModeDisruptionNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / realRadius)
      .padRadius(realRadius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);

    const mousearc = d3
      .arc<d3.HierarchyRectangularNode<ModeDisruptionNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1));

    return { arc, mousearc };
  };

  const getLabel = (
    innerChart: d3.Selection<
      d3.BaseType | SVGGElement,
      null,
      SVGSVGElement,
      unknown
    >,
  ): d3.Selection<
    d3.BaseType | SVGTextElement,
    null,
    d3.BaseType | SVGGElement,
    null
  > => {
    const label = innerChart
      .selectAll("text.chart-label")
      .data([null])
      .join("text")
      .attr("class", "chart-label")
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .style("visibility", "hidden");

    label
      .selectAll("text.upper-text")
      .data([null])
      .join("tspan")
      .attr("class", "upper-text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-0.1em")
      .attr("font-size", "2em")
      .text("");

    label
      .selectAll("text.lower-text")
      .data([null])
      .join("tspan")
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
  ): d3.Selection<d3.BaseType | SVGGElement, null, SVGSVGElement, unknown> =>
    svg
      .selectAll(".inner-chart")
      .data([null])
      .join("g")
      .attr("class", "inner-chart")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`)
      .attr("transform", `translate(${width / 2}, ${height / 2 + 10})`);

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
