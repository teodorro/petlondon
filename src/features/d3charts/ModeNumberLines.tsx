import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useAllValidLines, useLineModes } from '../../services/line-service';
import { useLineStore } from '../../stores/line-store';
import { createSelectors } from '../../utils/create-selectors';
// import { useThemeStore } from '../../stores/theme-store';

export default function ModeNumberLines() {
  const lineStoreSelectors = createSelectors(useLineStore);
  const lines = lineStoreSelectors.use.lines();
  const setLines = lineStoreSelectors.use.setLines();
  const modes = lineStoreSelectors.use.modes();
  const setModes = lineStoreSelectors.use.setModes();
  // const themeStore = useThemeStore();

  const rawData = useRef<{ name: string; count: number }[]>([]);

  const getLineModes = useLineModes();
  const getAllValidLines = useAllValidLines();

  useEffect(() => {
    setModes(getLineModes.data);
  }, [getLineModes.data]);
  useEffect(() => {
    setLines(getAllValidLines.data);
  }, [getAllValidLines.data]);
  useEffect(() => {
    calcNumberOfLines();
  }, [modes, lines]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

  // D3 rendering
  useEffect(() => {
    if (!size.width || !size.height) return;
    const stubWidth = 150;
    const data = rawData.current;
    data.sort((a, b) => b.count - a.count);
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = size.width - margin.left - margin.right;
    const innerHeight = size.height - margin.top - margin.bottom;
    // console.log(size.width);
    // console.log(svgD3Ref.current);
    if (svgD3Ref.current) {
      svgD3Ref.current.selectAll('*').remove();
      console.log(size.width);
      // console.log(width);
      svgD3Ref.current.attr('width', size.width).attr('height', size.height);
    } else {
      console.log(size.width);
      svgD3Ref.current = d3
        .select(containerRef.current)
        .append('svg')
        .attr('width', size.width)
        .attr('height', size.height)
        .style('display', 'block') // removes unwanted inline spacing
        .style('max-width', '100%') // prevents it from being wider than parent
        .style('max-height', '100%') // same for height
        .style('overflow', 'visible') // or 'hidden' if you want clipping
        .style('border', '1px solid red');
    }
    const innerChart = svgD3Ref.current
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const xScale = d3
      .scaleLinear()
      .domain([0, 90])
      .range([0, innerWidth - stubWidth]);
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .paddingInner(0.2);
    // repositioning data
    // prettier-ignore
    const barAndLabel = innerChart
      .selectAll('g')
      .data(data)
      .join('g')
        .attr('transform', d => `translate(0, ${yScale(d.name)})`)
    // data rects
    // prettier-ignore
    barAndLabel
      .append('rect')
        .attr('width', (d) => xScale(getBarWidth(d.count)))
        .attr("height", yScale.bandwidth())
        .attr("x", stubWidth)
        .attr("y", 0)
        .attr("fill", d => d.name === "D" ? "yellowgreen" : "var(--theme-primary-color)");
    // labels left
    // prettier-ignore
    barAndLabel
      .append("text")
        .text(d => d.name)
        .attr('x', stubWidth - 4)
        .attr('y', 16)
        .attr('text-anchor', 'end')
        .style('fill', 'var(--theme-text-primary-color)')
        .style('font-size', '12px');
    // labels right
    // prettier-ignore
    barAndLabel
      .append("text")
        .text(d => d.count)
        .attr('x', (d) => stubWidth + xScale(getBarWidth(d.count)) + 5)
        .attr('y', 16)
        .style('fill', 'var(--theme-text-primary-color)')
        .style('font-size', '12px');
  }, [size, modes, lines]);

  const getBarWidth = (count: number) =>
    count === 0 ? 0 : (Math.log(count) + 1) * 10;

  const calcNumberOfLines = () => {
    console.log('-----');
    if (modes == null || lines == null) return;
    rawData.current = [];
    const dataLog: { name: string; count: number }[] = [];
    modes.forEach((mode) => {
      const num = lines.filter(
        (line) => line.modeName === mode.modeName
      ).length;
      rawData.current.push({ name: mode.modeName, count: num });
      dataLog.push({ name: mode.modeName, count: Math.log(num) + 1 });
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        // height: '100%', // or fixed height
        height: '400px',
        // display: 'flex',
        // flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--theme-background-color)',
        // margin: 1,
        border: '1px solid #0a0',
      }}
    ></div>
  );
}
