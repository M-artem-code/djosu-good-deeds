import type {
  CreateDeedBody,
  DeedPublic,
  UpdateDeedBody,
} from "../model/types";
import { baseApi } from "@/shared/api";

export const deedsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeeds: builder.query<DeedPublic[], void>({
      query: () => "deeds",
      providesTags: [{ type: "Deed", id: "LIST" }],
    }),
    createDeed: builder.mutation<DeedPublic, CreateDeedBody>({
      query: (body) => ({
        url: "deeds",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
    updateDeed: builder.mutation<
      DeedPublic,
      { id: string; body: UpdateDeedBody }
    >({
      query: ({ id, body }) => ({
        url: `deeds/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
    deleteDeed: builder.mutation<void, string>({
      query: (id) => ({
        url: `deeds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Deed", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDeedsQuery,
  useCreateDeedMutation,
  useUpdateDeedMutation,
  useDeleteDeedMutation,
} = deedsApi;
