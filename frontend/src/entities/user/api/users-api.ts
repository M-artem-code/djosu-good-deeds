import type { UserByTag } from "@/entities/friend";
import type { UserPublic } from "../model/types";
import { baseApi } from "@/shared/api";

export type UpdateMeBody = Partial<Pick<UserPublic, "displayName" | "tag">>;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserByTag: builder.query<UserByTag, string>({
      query: (tag) => `users/by-tag/${encodeURIComponent(tag)}`,
    }),
    getMe: builder.query<UserPublic, void>({
      query: () => "users/me",
      providesTags: [{ type: "User", id: "ME" }],
    }),
    updateMe: builder.mutation<UserPublic, UpdateMeBody>({
      query: (body) => ({
        url: "users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    deleteMe: builder.mutation<void, void>({
      query: () => ({
        url: "users/me",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserByTagQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
} = usersApi;
