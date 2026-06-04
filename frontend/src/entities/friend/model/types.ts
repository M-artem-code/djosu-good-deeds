import type { UserByTag } from "@/entities/user/@x/friend";

export interface FriendItem {
  _id: string;
  friend: UserByTag;
  createdAt: string;
}

/** Used by Plan 02 add-friend mutation */
export interface AddFriendBody {
  tag: string;
}
