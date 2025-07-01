/**
 * Turned out too boring chart :/ Mode-Severity parts are differs too little
 */
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import { useLineStore } from "../../stores/line-store";
import { createSelectors } from "../../utils/create-selectors";
import {
  useLineModesQuery,
  useSeverityCodesQuery,
} from "../../services/line-service";
import { lineColors, LineModeName } from "../../utils/line-colors";

interface ModeSeverityNode {
  name: string;
  value?: number;
  children?: ModeSeverityNode[];
}

export default function ModeSeverityLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [radius, setRadius] = useState<number>(0);
  const [data, setData] = useState<ModeSeverityNode | null>(null);

  const lineStoreSelectors = createSelectors(useLineStore);

  const severityCodes = lineStoreSelectors.use.severityCodes();
  const modes = lineStoreSelectors.use.modes();

  const setSeverityCodes = lineStoreSelectors.use.setSeverityCodes();
  const setModes = lineStoreSelectors.use.setModes();

  const getLineModes = useLineModesQuery();
  const getSeverityCodes = useSeverityCodesQuery();

  useEffect(() => {
    setModes(getLineModes.data ?? []);
  }, [getLineModes.data]);

  useEffect(() => {
    setSeverityCodes(getSeverityCodes.data ?? []);
  }, [getSeverityCodes.data]);

  useEffect(() => {
    buildHierarchy();
  }, [modes, severityCodes]);

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
    if (!size.width || !size.height) return;
    const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
    const chartWidth = size.width - chartMargin.left - chartMargin.right;
    const chartHeight = size.height - chartMargin.top - chartMargin.bottom;
    initSvg(chartWidth, chartHeight);
  }, [size.width, size.height]);

  useEffect(() => {
    setData(buildHierarchy());
  }, [modes, severityCodes]);

  useEffect(() => {
    if (!size.width || !size.height) return;

    const chartMargin = { top: 6, right: 2, bottom: 6, left: 2 };
    const chartWidth = size.width - chartMargin.left - chartMargin.right;
    const chartHeight = size.height - chartMargin.top - chartMargin.bottom;
    setRadius(chartHeight / 2);
    if (data == null) return;
    const root = partition(data);

    if (svgD3Ref.current == null) return;
    const svg = svgD3Ref.current;

    const innerChart = getInnerChart(svg, chartMargin.left, chartMargin.top);

    innerChart.attr(
      "transform",
      `translate(${chartWidth / 2}, ${chartHeight / 2})`,
    );

    const label = innerChart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .style("visibility", "hidden");

    label
      .append("tspan")
      .attr("class", "percentage")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-0.1em")
      .attr("font-size", "2em")
      .text("");

    label
      .append("tspan")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.5em")
      .attr("font-size", "0.75em")
      .text("of visits begin with this sequence");

    const arc = d3
      .arc<d3.HierarchyRectangularNode<ModeSeverityNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);

    const mousearc = d3
      .arc<d3.HierarchyRectangularNode<ModeSeverityNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius(radius);

    const path = innerChart
      .append("g")
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        }),
      )
      .join("path")
      // .attr('fill', (d) => color((d.data as ModeSeverityNode).name))
      .attr(
        "fill",
        (d) => lineColors[(d.data as ModeSeverityNode).name as LineModeName],
      )
      .attr("d", arc);

    innerChart
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseleave", () => {
        path.attr("fill-opacity", 1);
        label.style("visibility", "hidden");
        // Update the value of this view
        // setHoverInfo({ sequence: [], percentage: 0.0 });
      })
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        }),
      )
      .join("path")
      .attr("d", mousearc)
      .on("mouseenter", (_event, d) => {
        // Get the ancestors of the current segment, minus the root
        const sequence = d.ancestors().reverse().slice(1);
        // Highlight the ancestors
        path.attr("fill-opacity", (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3,
        );
        const percentage = (
          (100 * (d.value ?? 0)) /
          (root.value ?? 1)
        ).toPrecision(3);
        label
          .style("visibility", null)
          .select(".percentage")
          .text(percentage + "%");
        // Update the value of this view with the currently hovered sequence and percentage
        // setHoverInfo({ sequence, percentage });
      });
  }, [size, data]);

  const partition = (data: ModeSeverityNode) =>
    d3.partition<ModeSeverityNode>().size([2 * Math.PI, radius * radius])(
      d3
        .hierarchy<ModeSeverityNode>(data)
        .sum((d) => (d as { value: number }).value)
        .sort(
          (a, b) =>
            (b as { value: number }).value - (a as { value: number }).value,
        ),
    );

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

  const buildHierarchy = (): ModeSeverityNode => {
    const root: ModeSeverityNode = {
      name: "root",
      children: [],
    };
    if (modes == null || severityCodes == null) return root;

    /**
     * 1st level - modes
     * 2nd level - severity codes in these modes
     * size of parts depends on number of severity codes
     */

    const allSeverities = modes.reduce((ac, mode) => {
      const filteredCodes = severityCodes.filter(
        (code) => code.modeName === mode.modeName,
      );
      return ac + filteredCodes.length;
    }, 0);
    modes.forEach((mode) => {
      const filteredCodes = severityCodes.filter(
        (code) => code.modeName === mode.modeName,
      );
      const modePart = filteredCodes.length / allSeverities;
      const currentNode: ModeSeverityNode = {
        name: mode.modeName,
        children: [],
      };
      filteredCodes.forEach(() => {
        const child: ModeSeverityNode = {
          name: mode.modeName,
          children: undefined,
          value: modePart / filteredCodes.length,
        };
        currentNode.children?.push(child);
      });
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
        Mode vs Severity
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
