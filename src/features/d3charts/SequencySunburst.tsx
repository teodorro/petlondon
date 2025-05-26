import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function SequencySunburst() {
  const breadcrumbHeight = 30;
  const breadcrumbWidth = 75;

  const containerRef = useRef<HTMLDivElement>(null);
  const csv = useRef<string[][]>([]);
  // const data = useRef<{ name: string; children: unknown[] }>(null);
  const svgD3Ref =
    useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [radius, setRadius] = useState<number>(0);
  const [data, setData] = useState<{
    name: string;
    children: unknown[];
  } | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    sequence: d3.HierarchyRectangularNode<unknown>[];
    percentage: string | number;
  }>({ sequence: [], percentage: 0 });

  const handleMouseOver = (e) => {
    setHoverInfo({ sequence: e.path, percentage: e.value });
  };

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

    loadData();

    return () => resizeObserver.disconnect();
  }, []);

  const partition = (data: unknown) =>
    d3.partition().size([2 * Math.PI, radius * radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value)
    );

  const color = d3
    .scaleOrdinal()
    .domain(['home', 'product', 'search', 'account', 'other', 'end'])
    .range(['#5d85cf', '#7c6561', '#da7847', '#6fb971', '#9e70cf', '#bbbbbb']);

  // D3 rendering
  useEffect(() => {
    if (!size.width || !size.height) return;
    if (data == null) return;
    const root = partition(data);

    const margin = { top: 2, right: 2, bottom: 2, left: 2 };
    const innerWidth =
      Math.min(size.width, size.height) - margin.left - margin.right;
    const innerHeight =
      Math.min(size.width, size.height) - margin.top - margin.bottom;
    setRadius(innerWidth / 2);

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
      .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`);

    // const element = svgD3Ref.current.node();
    // if (element == null) return;
    // element.value = { sequence: [], percentage: 0.0 };

    const label = innerChart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .style('visibility', 'hidden');

    label
      .append('tspan')
      .attr('class', 'percentage')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '-0.1em')
      .attr('font-size', '2em')
      .text('');

    label
      .append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '1.5em')
      .attr('font-size', '0.75em')
      .text('of visits begin with this sequence');

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius((d) => Math.sqrt(d.y1) - 1);

    const mousearc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => Math.sqrt(d.y0))
      .outerRadius(radius);

    const path = innerChart
      .append('g')
      .selectAll('path')
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        })
      )
      .join('path')
      .attr('fill', (d) => color(d.data.name))
      .attr('d', arc);

    innerChart
      .append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseleave', () => {
        path.attr('fill-opacity', 1);
        label.style('visibility', 'hidden');
        // Update the value of this view
        setHoverInfo({ sequence: [], percentage: 0.0 });
      })
      .selectAll('path')
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        })
      )
      .join('path')
      .attr('d', mousearc)
      .on('mouseenter', (event, d) => {
        // Get the ancestors of the current segment, minus the root
        const sequence = d.ancestors().reverse().slice(1);
        // Highlight the ancestors
        path.attr('fill-opacity', (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3
        );
        const percentage = ((100 * d.value) / root.value).toPrecision(3);
        label
          .style('visibility', null)
          .select('.percentage')
          .text(percentage + '%');
        // Update the value of this view with the currently hovered sequence and percentage
        setHoverInfo({ sequence, percentage });
      });
  }, [size, data]);

  const loadData = async () => {
    const response = await fetch('/visit-sequences@1.csv');
    const text = await response.text();
    csv.current = d3.csvParseRows(text);
    setData(buildHierarchy(csv.current));
    console.log(data);
  };

  const buildHierarchy = (csvData: string[][]) => {
    // Helper function that transforms the given CSV into a hierarchical format.
    // const root = { name: 'root', children: [] };
    const root: { name: string; children: unknown[] } = {
      name: 'root',
      children: [],
    };
    for (let i = 0; i < csvData.length; i++) {
      const sequence = csvData[i][0];
      const size = +csvData[i][1];
      if (isNaN(size)) {
        // e.g. if this is a header row
        continue;
      }
      const parts = sequence.split('-');
      let currentNode = root;
      for (let j = 0; j < parts.length; j++) {
        if (currentNode == null) continue;
        const children = currentNode.children;
        if (children == null) continue;
        const nodeName = parts[j];
        let childNode = null;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          let foundChild = false;
          for (let k = 0; k < children.length; k++) {
            const child = children[k] as { name: string; children: unknown[] };
            if (child['name'] == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = { name: nodeName, children: [] };
            children.push(childNode);
          }
          currentNode = childNode as { name: string; children: unknown[] };
        } else {
          // Reached the end of the sequence; create a leaf node.
          childNode = { name: nodeName, value: size };
          children.push(childNode);
        }
      }
    }
    return root;
  };

  function breadcrumbPoints(d, i) {
    const tipWidth = 10;
    const points = [];
    points.push('0,0');
    points.push(`${breadcrumbWidth},0`);
    points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
    points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
    points.push(`0,${breadcrumbHeight}`);
    if (i > 0) {
      // Leftmost breadcrumb; don't include 6th vertex.
      points.push(`${tipWidth},${breadcrumbHeight / 2}`);
    }
    return points.join(' ');
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '600px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--theme-background-color)',
      }}
    ></div>
  );
}
