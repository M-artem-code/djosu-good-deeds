import type { UserPublic } from "@/entities/user";
import type { AppDispatch } from "./store";
import { baseApi } from "./base-api";
import { clearSession, setCredentials } from "./auth-slice";
import { clearBannerMessage } from "./ui-slice";

export function clearAuthSession(dispatch: AppDispatch): void {
  dispatch(clearSession());
  dispatch(clearBannerMessage());
  dispatch(baseApi.util.resetApiState());
}

export function establishAuthSession(
  dispatch: AppDispatch,
  payload: { accessToken: string; user: UserPublic },
): void {
  dispatch(baseApi.util.resetApiState());
  dispatch(
    setCredentials({
      accessToken: payload.accessToken,
      user: payload.user,
    }),
  );
}
