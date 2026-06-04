import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getApiMessage } from "../errors";
import { getStoredToken } from "@/shared/lib";
import { clearAuthSession } from "./clear-auth-session";
import { setBannerMessage } from "./ui-slice";
import type { RootState } from "./store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ?? getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

function isPublicAuthRequest(args: string | FetchArgs): boolean {
  const url = typeof args === "string" ? args : args.url;
  return url.includes("auth/login") || url.includes("auth/register");
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && !isPublicAuthRequest(args)) {
    const status = result.error.status;

    if (status === 401) {
      clearAuthSession(api.dispatch);
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=session_expired";
      }
    } else if (
      status === "FETCH_ERROR" ||
      status === "PARSING_ERROR" ||
      (typeof status === "number" && status >= 500)
    ) {
      const message =
        getApiMessage(result.error) ??
        "Something went wrong. Try again or sign in again.";
      api.dispatch(setBannerMessage(message));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Deed", "Friend", "FriendDeed"],
  endpoints: () => ({}),
});
