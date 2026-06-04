"use client";

import { AddFriendForm, useAddFriendForm } from "@/features/friend/add";
import { FriendsList } from "@/entities/friend";
import { RemoveFriendModal } from "@/features/friend/remove";
import { useFriendsPage } from "../model/useFriendsPage";
import { FriendSkeletonCard } from "@/shared/ui";
import { ListQueryState, PageHeader, PageShell } from "@/shared/ui";

const FRIENDS_SUBTITLE =
  "Adding someone lets you see their deeds. They won't see yours unless they add you.";

export default function FriendsPage() {
  const page = useFriendsPage();
  const addFriendForm = useAddFriendForm(page.friends.length);

  return (
    <PageShell spacing={page.spacing}>
      <PageHeader title="Friends" subtitle={FRIENDS_SUBTITLE} />
      <ListQueryState
        isLoading={page.isLoading}
        isError={page.isError}
        onRetry={() => page.refetch()}
        loadingLabel="Loading friends"
        errorTitle="Couldn't load friends"
        skeleton={FriendSkeletonCard}
      >
        <AddFriendForm form={addFriendForm} />

        <FriendsList friends={page.friends} onRemove={page.setRemoveTarget} />
      </ListQueryState>

      {page.removeTarget ? (
        <RemoveFriendModal
          friendshipId={page.removeTarget._id}
          friendTag={page.removeTarget.friend.tag}
          onClose={page.clearRemoveTarget}
        />
      ) : null}
    </PageShell>
  );
}
