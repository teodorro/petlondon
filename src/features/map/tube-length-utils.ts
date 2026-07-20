import { toLonLat } from "ol/proj";
import { distance } from "@turf/turf";

function closestPointIndex(
  points: [number, number][],
  target: [number, number],
  searchFrom: number,
): number {
  let bestIdx = Math.min(searchFrom, points.length - 1);
  let bestDist = Infinity;
  for (let i = bestIdx; i < points.length; i++) {
    const dx = points[i][0] - target[0];
    const dy = points[i][1] - target[1];
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function groupSmoothGeometryByStops(
  smoothGeometryMercator: [number, number][],
  stopPointsLonLat: [number, number][],
): [number, number][][] {
  const smoothLonLat = smoothGeometryMercator.map(
    (p) => toLonLat(p) as [number, number],
  );

  const stopIndices: number[] = [];
  let searchFrom = 0;
  for (const stop of stopPointsLonLat) {
    const idx = closestPointIndex(smoothLonLat, stop, searchFrom);
    smoothLonLat[idx] = stop;
    stopIndices.push(idx);
    searchFrom = idx + 1;
  }

  const groups: [number, number][][] = [];
  for (let i = 0; i < stopIndices.length - 1; i++) {
    groups.push(smoothLonLat.slice(stopIndices[i], stopIndices[i + 1] + 1));
  }

  return groups;
}

export function pathLengthKm(points: [number, number][]): number {
  let sum = 0;
  for (let i = 0; i < points.length - 1; i++) {
    sum += distance(points[i], points[i + 1], { units: "kilometers" });
  }
  return sum;
}
