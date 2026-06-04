"use client";

import { AddDeedForm, useAddDeedForm } from "@/features/deed/create";
import { DeedGroupedList, type DeedPublic } from "@/entities/deed";
import { EditableDeedCard } from "@/features/deed/edit";
import { DeleteDeedModal } from "@/features/deed/delete";
import { useDeedListState } from "../model/useDeedListState";
import { useDeedsPage } from "../model/useDeedsPage";
import {
  DeedSkeletonCard,
  EmptyState,
} from "@/shared/ui";
import { ListQueryState, PageHeader, PageShell } from "@/widgets";

export default function DeedsPage() {
  const { deeds, isLoading, isError, isEmpty, refetch } = useDeedsPage();
  const addDeedForm = useAddDeedForm(deeds.length);
  const list = useDeedListState();

  function renderDeedCard(deed: DeedPublic) {
    return (
      <EditableDeedCard
        deed={deed}
        isEditing={list.editingId === deed._id}
        onStartEdit={() => list.startEdit(deed._id)}
        onCancelEdit={list.cancelEdit}
        onDelete={() => list.requestDelete(deed)}
      />
    );
  }

  return (
    <PageShell>
      <PageHeader title="My Deeds" />
      <ListQueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        loadingLabel="Loading deeds"
        errorTitle="Couldn't load your deeds"
        skeleton={DeedSkeletonCard}
      >
        {isEmpty ? (
          <EmptyState
            title="No deeds yet"
            description="Add your first good deed below."
          />
        ) : null}

        <AddDeedForm form={addDeedForm} />

        {!isEmpty ? (
          <DeedGroupedList deeds={deeds} renderCard={renderDeedCard} />
        ) : null}
      </ListQueryState>

      {list.deleteTarget ? (
        <DeleteDeedModal
          deedId={list.deleteTarget._id}
          deedTitle={list.deleteTarget.title}
          onClose={list.clearDelete}
        />
      ) : null}
    </PageShell>
  );
}
