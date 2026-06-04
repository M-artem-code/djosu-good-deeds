"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/shared/ui";
import { useAppSelector } from "@/shared/api";

export default function HomePage() {
  const router = useRouter();
  const { accessToken, isHydrating } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isHydrating) return;
    router.replace(accessToken ? "/deeds" : "/login");
  }, [accessToken, isHydrating, router]);

  return <Loader variant="inline" />;
}
