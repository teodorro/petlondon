import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  useAllValidLinesQuery,
  useLineModesQuery,
} from '../../services/line-service';
import { useLineStore } from '../../stores/line-store';
import { createSelectors } from '../../utils/create-selectors';
import { Box } from '@mui/material';
import { lineColors } from '../../utils/line-colors';
import { makeKebabReadable } from '../../utils/text-utils';
export default function ModeNumberLines() {
  const numberWidth = 30;
  const stubWidth = 150;
  const xScaleHeight = 30;

  const lineStoreSelectors = createSelectors(useLineStore);

  const lines = lineStoreSelectors.use.lines();
  const modes = lineStoreSelectors.use.modes();

  const setLines = lineStoreSelectors.use.setLines();
  const setModes = lineStoreSelectors.use.setModes();

  const rawData = useRef<{ name: string; count: number }[]>([]);
  const maxCount = useRef<number>(0);

  const getLineModes = useLineModesQuery();
  const getAllValidLines = useAllValidLinesQuery();

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
    const data = rawData.current;
    data.sort((a, b) => b.count - a.count);
    maxCount.current = Math.max(...data.map((item) => item.count));
    const margin = { top: 6, right: 2, bottom: 6, left: 2 };
    const innerWidth = size.width - margin.left - margin.right;
    const innerHeight = size.height - margin.top - margin.bottom;

    if (svgD3Ref.current) {
      svgD3Ref.current.selectAll('*').remove();
      svgD3Ref.current.attr('width', innerWidth).attr('height', innerHeight);
    } else {
      svgD3Ref.current = d3
        .select(containerRef.current)
        .append('svg')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .style('display', 'block')
        .style('max-width', '100%')
        .style('max-height', '100%')
        .style('overflow', 'visible');
    }

    const innerChart = svgD3Ref.current
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleLog()
      .domain([1, maxCount.current + 1])
      .range([0, innerWidth - stubWidth - numberWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight - xScaleHeight])
      .paddingInner(0.2);
    // repositioning data
    // prettier-ignore

    const barAndLabel = innerChart
      .selectAll('g')
      .data(data)
      .join('g')
        .attr('transform', d => `translate(0, ${yScale(d.name)})`)

    const tickValues = [1, 2, 6, 11, 26, 101, 251, 501];
    const bottomAxis = d3
      .axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat((d) => Math.round(+d - 1).toString());
    innerChart
      .append('g')
      .attr(
        'transform',
        `translate(${stubWidth}, ${innerHeight - xScaleHeight + 5})`
      )
      .call(bottomAxis);

    // data rects
    // prettier-ignore
    barAndLabel
      .append('rect')
      .attr('width', (d) => xScale(d.count === 0 ? 1.05 : d.count + 1))
      .attr('height', yScale.bandwidth())
      .attr('x', stubWidth)
      .attr('y', 0)
      .attr('fill', (d) => getColor(d));
    // labels left
    // prettier-ignore
    barAndLabel
      .append("text")
        .text(d => makeKebabReadable(d.name))
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
        .attr('x', (d) => stubWidth + xScale(d.count === 0 ? 1.05 : d.count + 1) + 4)
        .attr('y', 16)
        .style('fill', 'var(--theme-text-primary-color)')
        .style('font-size', '12px');
  }, [size, modes, lines]);

  const calcNumberOfLines = () => {
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

  const getColor = (d: { name: string; count: number }): string => {
    return lineColors[d.name];
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: 'var(--theme-background-color)',
          fontSize: '16pt',
          pt: 2,
        }}
      >
        Mode vs Number of lines
      </Box>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'var(--theme-background-color)',
        }}
      ></div>
    </Box>
  );
}
