/** Centralised application route paths (no more hard-coded strings). */
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  deeds: "/deeds",
  friends: "/friends",
  friendDeeds: (tag: string) => `/friends/${tag}`,
  settings: "/settings",
} as const;

export type AuthRedirectReason = "session_expired" | "logged_out";

/** Builds the login URL carrying an optional `?reason=` banner hint. */
export function loginWithReason(reason: AuthRedirectReason): string {
  return `${routes.login}?reason=${reason}`;
}
