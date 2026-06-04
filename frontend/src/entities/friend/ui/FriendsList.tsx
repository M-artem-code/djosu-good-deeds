import { EmptyState } from "@/shared/ui";
import type { FriendItem } from "../model/types";
import { FriendCard } from "./FriendCard";

interface FriendsListProps {
  friends: FriendItem[];
  onRemove: (item: FriendItem) => void;
}

export function FriendsList({ friends, onRemove }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <EmptyState
        title="No friends yet"
        description="Add someone by tag to see their deeds."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {friends.map((item) => (
        <FriendCard key={item._id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}
