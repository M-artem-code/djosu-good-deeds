"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { DeedCardReadOnlyView, DeedGroupedList } from "@/entities/deed";
import { ForbiddenDeedsView, FriendDeedsHeader } from "@/entities/friend";
import { DeedSkeletonCard, EmptyState, Loader } from "@/shared/ui";
import { ListQueryState, PageShell } from "@/shared/ui";
import { useFriendDeedsPage } from "../model/useFriendDeedsPage";

function FriendDeedsPageContent() {
  const params = useParams();
  const rawTag =
    params && typeof params.tag === "string" ? params.tag : "";
  const page = useFriendDeedsPage(rawTag);

  if (page.forbidden) {
    return <ForbiddenDeedsView />;
  }

  return (
    <PageShell>
      <FriendDeedsHeader tag={page.tag} displayName={page.displayName} />
      <ListQueryState
        isLoading={page.isLoading}
        isError={page.isError}
        onRetry={() => page.refetch()}
        loadingLabel="Loading deeds"
        errorTitle="Couldn't load deeds"
        skeleton={DeedSkeletonCard}
        skeletonCount={1}
      >
        {page.isEmpty ? (
          <EmptyState title="No deeds yet" />
        ) : (
          <DeedGroupedList
            deeds={page.deeds}
            renderCard={(deed) => <DeedCardReadOnlyView deed={deed} />}
          />
        )}
      </ListQueryState>
    </PageShell>
  );
}

export default function FriendDeedsPage() {
  return (
    <Suspense fallback={<Loader variant="inline" />}>
      <FriendDeedsPageContent />
    </Suspense>
  );
}
