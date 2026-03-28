import type { ApiErrorDto } from "@/types/api";
import { storageKeys } from "@/app/config/storage";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "@/lib/browserStorage";

const configuredBaseUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const baseUrl = configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:8080" : "");

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
  return getLocalStorageItem(storageKeys.authTokenPersistent) ?? getSessionStorageItem(storageKeys.authTokenSession);
}

export function storeToken(token: string, remember = true) {
  if (remember) {
    setLocalStorageItem(storageKeys.authTokenPersistent, token);
    removeSessionStorageItem(storageKeys.authTokenSession);
    return;
  }

  setSessionStorageItem(storageKeys.authTokenSession, token);
  removeLocalStorageItem(storageKeys.authTokenPersistent);
}

export function clearStoredToken() {
  removeLocalStorageItem(storageKeys.authTokenPersistent);
  removeSessionStorageItem(storageKeys.authTokenSession);
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

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
