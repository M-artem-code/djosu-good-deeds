import { AppNav } from "@/app/app-nav";
import { AuthGuard } from "@/features/auth/guard";
import { Toaster } from "@/shared/ui";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <AppNav />
        <main className="mx-auto w-full max-w-3xl flex-1 p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </div>
    </AuthGuard>
  );
}
