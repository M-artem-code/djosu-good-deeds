"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader } from "@/shared/ui";
import { useAppSelector } from "@/shared/api";
import { routes } from "@/shared/config";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { accessToken, isHydrating } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isHydrating && !accessToken) {
      router.replace(routes.login);
    }
  }, [accessToken, isHydrating, router]);

  if (isHydrating) {
    return <Loader variant="inline" />;
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
