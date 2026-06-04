"use client";

import { Suspense, type ReactNode } from "react";
import { Loader } from "@/shared/ui";

type AuthSuspenseLayoutProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function AuthSuspenseLayout({
  children,
  fallback = <Loader />,
}: AuthSuspenseLayoutProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
