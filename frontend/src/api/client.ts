import type { ApiErrorDto } from "@/types/api";

const configuredBaseUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const baseUrl = configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:8080" : "");
const persistentTokenStorageKey = "supportops-auth-token";
const sessionTokenStorageKey = "supportops-auth-token:session";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorDto;

  constructor(message: string, status: number, payload?: ApiErrorDto) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(persistentTokenStorageKey) ?? window.sessionStorage.getItem(sessionTokenStorageKey);
}

export function storeToken(token: string, remember = true) {
  if (typeof window === "undefined") {
    return;
  }

  if (remember) {
    window.localStorage.setItem(persistentTokenStorageKey, token);
    window.sessionStorage.removeItem(sessionTokenStorageKey);
    return;
  }

  window.sessionStorage.setItem(sessionTokenStorageKey, token);
  window.localStorage.removeItem(persistentTokenStorageKey);
}

export function clearStoredToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(persistentTokenStorageKey);
  window.sessionStorage.removeItem(sessionTokenStorageKey);
}

function buildUrl(path: string, query?: QueryParams) {
  if (!baseUrl) {
    throw new ApiError(
      "SupportOps is missing a frontend API URL. Set VITE_API_URL before starting the app.",
      500,
    );
  }

  const url = new URL(path, baseUrl);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, query?: QueryParams) {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      "SupportOps could not reach the API. Check that the backend is running and VITE_API_URL points to the correct origin.",
      0,
    );
  }

  if (response.status === 401 && path !== "/api/auth/login") {
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("supportops:unauthorized", {
          detail: { message: "Your session expired. Sign in again to continue working in SupportOps." },
        }),
      );
    }
  }

  if (!response.ok) {
    let payload: ApiErrorDto | undefined;

    try {
      payload = (await response.json()) as ApiErrorDto;
    } catch {
      payload = undefined;
    }

    throw new ApiError(payload?.message ?? `Request failed with status ${response.status}.`, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
