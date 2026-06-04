"use client";

import type { UserPublic } from "@/entities/user";
import { ProfileSettingsCard } from "./ProfileSettingsCard";
import { useProfileForm } from "../model/useProfileForm";

export function ProfileSettingsSection({ user }: { user: UserPublic }) {
  const form = useProfileForm(user);

  return <ProfileSettingsCard user={user} form={form} />;
}
