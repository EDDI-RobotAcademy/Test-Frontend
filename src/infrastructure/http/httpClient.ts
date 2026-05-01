import { env } from "@/infrastructure/config/env";

export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

export type QueryValue = string | number | boolean | null | undefined;

export interface HttpRequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, QueryValue>;
  json?: unknown;
  body?: BodyInit | null;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const baseUrl = env.client.apiBaseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalized}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function httpClient<T = unknown>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  const { query, json, headers, body, ...rest } = options;
  const url = buildUrl(path, query);

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  let finalBody: BodyInit | null | undefined = body;
  if (json !== undefined) {
    finalBody = JSON.stringify(json);
    finalHeaders["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(url, {
      credentials: "include",
      ...rest,
      headers: finalHeaders,
      body: finalBody,
    });
  } catch (cause) {
    throw new HttpError(
      0,
      cause instanceof Error ? cause.message : "Network error",
      cause,
    );
  }

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      try {
        payload = await response.text();
      } catch {
        payload = undefined;
      }
    }
    throw new HttpError(response.status, response.statusText || "Request failed", payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}
