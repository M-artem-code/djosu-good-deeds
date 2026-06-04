import { AuthGuard } from "@/features/auth/guard";
import { ErrorBanner } from "@/shared/ui";
import { AppNav } from "@/widgets";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <AppNav />
        <ErrorBanner />
        <main className="mx-auto w-full max-w-3xl flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
