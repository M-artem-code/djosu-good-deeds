import type { DeedPublic } from "@/entities/deed/@x/friend";
import type { AddFriendBody, FriendItem } from "../model/types";
import { baseApi } from "@/shared/api";

export const friendsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<FriendItem[], void>({
      query: () => "friends",
      providesTags: [{ type: "Friend", id: "LIST" }],
    }),
    addFriend: builder.mutation<FriendItem, AddFriendBody>({
      query: (body) => ({
        url: "friends",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Friend", id: "LIST" }],
    }),
    removeFriend: builder.mutation<void, string>({
      query: (friendshipId) => ({
        url: `friends/${friendshipId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Friend", id: "LIST" },
        { type: "FriendDeed" },
      ],
    }),
    getFriendDeeds: builder.query<DeedPublic[], string>({
      query: (tag) => `friends/${encodeURIComponent(tag)}/deeds`,
      providesTags: (_result, _error, tag) => [{ type: "FriendDeed", id: tag }],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useGetFriendDeedsQuery,
} = friendsApi;
