export function getLocalStorageItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function setLocalStorageItem(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function removeLocalStorageItem(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getSessionStorageItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(key);
}

export function setSessionStorageItem(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, value);
}

export function removeSessionStorageItem(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(key);
}
