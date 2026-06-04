"use client";

import { DeleteAccountModal } from "@/features/account/delete";
import { ProfileSettingsSection } from "@/features/profile/update";
import { ProfileSkeletonCard, TextButton } from "@/shared/ui";
import { ListQueryState, PageHeader, PageShell } from "@/widgets";
import { useSettingsPage } from "../model/useSettingsPage";

export default function SettingsPage() {
  const page = useSettingsPage();

  return (
    <PageShell>
      <PageHeader title="Settings" />
      <ListQueryState
        isLoading={page.isLoading}
        isError={page.isError}
        onRetry={() => page.refetch()}
        loadingLabel="Loading profile"
        errorTitle="Couldn't load profile"
        skeleton={ProfileSkeletonCard}
        skeletonCount={1}
      >
        {page.user ? (
          <>
            <ProfileSettingsSection key={page.user.updatedAt} user={page.user} />
            <TextButton
              type="button"
              variant="destructive"
              onClick={page.openDeleteModal}
            >
              Delete account
            </TextButton>
          </>
        ) : null}
      </ListQueryState>

      {page.deleteModalOpen ? (
        <DeleteAccountModal onClose={page.closeDeleteModal} />
      ) : null}
    </PageShell>
  );
}
