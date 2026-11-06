import { type User, type AuthToken, type LoginPayload, type NewTrailDig, type Tag, type TrailDig, type TrailDigDetail } from "./types/api";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;
  detail?: string;

  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    if (typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string") {
      this.detail = body.detail;
      this.fields = {};
    }
    else if (typeof body === "object" && body !== null) {
      this.fields = body as Record<string, string[]>;
    }
    else {
      this.fields = {};
    }
  }
}

interface ApiOptions {
  method?: string;     // defaults to GET
  body?: unknown;      // a JS object; apiFetch calls JSON.stringify on it
  token?: string;
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.token) {
        headers["Authorization"] = `Token ${options.token}`
    }

    const res = await fetch(path, {
        method: options.method ?? "GET",
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),

    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new ApiError(res.status, errorBody);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    const data = await res.json();
    return data as T;
 }

export const getTags = () => apiFetch<Tag[]>("/api/traildig/tags/");
export const getTrailDigs = () => apiFetch<TrailDig[]>("/api/traildig/traildigs/");
export const getTrailDig = (id: number) => apiFetch<TrailDigDetail>(`/api/traildig/traildigs/${id}/`);

export const createTrailDig = (payload: NewTrailDig, token: string) =>
    apiFetch<TrailDigDetail>(
        `/api/traildig/traildigs/`,
        {
            method: "POST",
            token,
            body: payload,
        });

export const login = (payload: LoginPayload) => apiFetch<AuthToken>(
    `/api/user/token/`,
    {
        method: "POST",
        body: payload,
    }
);

export const getMe = (token: string) => apiFetch<User>(
    "/api/user/me/",
    {
    token,
    }
);
