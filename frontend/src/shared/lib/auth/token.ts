export const ACCESS_TOKEN_KEY = "djosu_access_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
