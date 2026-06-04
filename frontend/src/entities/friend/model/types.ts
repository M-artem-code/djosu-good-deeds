export interface UserByTag {
  _id: string;
  displayName: string;
  tag: string;
}

export interface FriendItem {
  _id: string;
  friend: UserByTag;
  createdAt: string;
}

/** Used by Plan 02 add-friend mutation */
export interface AddFriendBody {
  tag: string;
}
