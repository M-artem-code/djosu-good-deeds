"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAppSelector } from "@/shared/api";

interface GuestAuthGuardProps {
  children: ReactNode;
}

export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const { accessToken, user, isHydrating } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isHydrating && accessToken && user) {
      router.replace("/deeds");
    }
  }, [accessToken, user, isHydrating, router]);

  if (isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500 dark:text-zinc-400">
        Loading…
      </div>
    );
  }

  if (accessToken && user) {
    return null;
  }

  return <>{children}</>;
}
