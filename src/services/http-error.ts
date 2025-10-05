export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: string,
    public retryAfterMs?: number,
  ) {
    super(`HTTP ${status} ${statusText}${body ? ` — ${body}` : ""}`);
    this.name = "HttpError";
  }
}
