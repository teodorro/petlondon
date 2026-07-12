/**
 * Downloads a snapshot of the TfL data the app uses into public/tfl-data/.
 * These files are served as static assets and used instead of the live API
 * when TfL is unreachable (see src/services/fetch-json.ts).
 *
 * Usage: npm run snapshot   (requires TfL to be reachable, i.e. VPN if needed)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TFL_URL = "https://api.tfl.gov.uk";
const TUBE = "tube";
const outDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "tfl-data",
);

const getJson = async (tflPath) => {
  const res = await fetch(`${TFL_URL}${tflPath}`);
  if (!res.ok) {
    throw new Error(`GET ${tflPath} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

const save = async (relativePath, data) => {
  const filePath = path.join(outDir, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  const json = JSON.stringify(data);
  await writeFile(filePath, json);
  console.log(`${relativePath} (${Math.round(json.length / 1024)} KB)`);
};

const lines = await getJson("/Line/Route");
await save("lines.json", lines);

const modes = await getJson("/Line/Meta/Modes");
await save("modes.json", modes);

const severityCodes = await getJson("/Line/Meta/Severity");
await save("severity-codes.json", severityCodes);

const modesWithLines = [...new Set(lines.map((line) => line.modeName))].filter(
  (modeName) => modes.some((mode) => mode.modeName === modeName),
);
for (const modeName of modesWithLines) {
  await save(
    `disruptions/${modeName}.json`,
    await getJson(`/Line/Mode/${modeName}/Disruption`),
  );
}

const tubeLineIds = lines
  .filter((line) => line.modeName === TUBE)
  .map((line) => line.id);
for (const lineId of tubeLineIds) {
  await save(
    `route-sequences/${lineId}.json`,
    await getJson(`/Line/${lineId}/Route/Sequence/inbound`),
  );
}

console.log(`\nSnapshot written to ${outDir}`);
