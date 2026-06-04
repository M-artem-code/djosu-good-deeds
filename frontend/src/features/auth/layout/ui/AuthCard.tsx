import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-[420px] rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 lg:p-8">
      <h1 className="mb-6 text-[28px] font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {children}
    </div>
  );
}
