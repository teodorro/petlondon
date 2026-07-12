import { HttpError } from "./http-error";
import { baseUrl, dataSource, localDataUrl } from "./services-config";

// Needed if querying TfL from Russia with no VPN
const fetchJson = async <T>(url: string, emptyValue: T): Promise<T> => {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const ra = res.headers.get("retry-after");
    const retryAfterMs = ra ? Number(ra) * 1000 : undefined;
    throw new HttpError(res.status, res.statusText, text, retryAfterMs);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : emptyValue;
};

export const fetchTflJson = async <T>(
  tflPath: string,
  localPath: string,
  emptyValue: T,
): Promise<T> => {
  const localUrl = `${localDataUrl}/${localPath}`;
  if (dataSource === "local") {
    return fetchJson(localUrl, emptyValue);
  }
  try {
    return await fetchJson(`${baseUrl}${tflPath}`, emptyValue);
  } catch (err) {
    if (dataSource === "tfl") throw err;
    console.warn(`TfL unreachable, using snapshot ${localPath}`, err);
    return fetchJson(localUrl, emptyValue);
  }
};
