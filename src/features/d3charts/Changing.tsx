///////////////// ChangingNoReps //////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useAllValidLinesQuery } from '../../services/line-service';
import { useLineStore } from '../../stores/line-store';
import { createSelectors } from '../../utils/create-selectors';

export default function Changing() {
  const lineStoreSelectors = createSelectors(useLineStore);
  const lines = lineStoreSelectors.use.lines();
  const setLines = lineStoreSelectors.use.setLines();
  const rawData = useRef([
    { name: 'A', count: 30 },
    { name: 'Bb', count: 80 },
    { name: 'Cccc', count: 45 },
    { name: 'D', count: 60 },
    { name: 'Evfdsvd', count: 20 },
    { name: 'F', count: 90 },
    { name: 'Gwwedde', count: 55 },
  ]);

  const getAllValidLines = useAllValidLinesQuery();

  useEffect(() => {
    setLines(getAllValidLines.data);
    console.log(getAllValidLines.data);
  }, [getAllValidLines.data]);

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

    if (svgD3Ref.current == null) {
      svgD3Ref.current = d3
        .select(containerRef.current)
        .append('svg')
        .attr('viewBox', '0 0 600 400')
        .style('border', '1px solid red');
    }

    // prettier-ignore
    const xScale = d3.scaleLinear()
    .domain([0, 90])
    .range([0, 450]);

    // prettier-ignore
    const yScale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, 400])
    .paddingInner(0.2);

    // repositioning data
    // prettier-ignore
    const barAndLabel = svgD3Ref.current.selectAll('g')
    .data(data)
    .join('g')
      .attr('transform', d => `translate(0, ${yScale(d.name)})`)

    // data rects
    // prettier-ignore
    barAndLabel
    .append('rect')
      .attr('width', (d) => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("x", 100)
      .attr("y", 0)
      .attr("fill", d => d.name === "D" ? "yellowgreen" : "skyblue");

    // labels left
    // prettier-ignore
    barAndLabel
    .append("text")
      .text(d => d.name)
      .attr('x', 96)
      .attr('y', 30)
      .attr('text-anchor', 'end')
      .style('fill', 'whitesmoke');

    // labels right
    // prettier-ignore
    barAndLabel
    .append("text")
      .text(d => d.count)
      .attr('x', (d) => 100 + xScale(d.count) + 5)
      .attr('y', 30)
      .style('fill', 'whitesmoke')
      .style('font-size', '12px');
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%', // or fixed height
        display: 'flex',
        flexDirection: 'column',
        // margin: 1,
        // border: '1px solid #0a0',
      }}
    >
      {/* <svg ref={svgRef} width={size.width} height={size.height} /> */}
      <svg />
    </div>
  );
}
