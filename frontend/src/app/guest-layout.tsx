import { GuestAuthGuard } from "@/features/auth/guard";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestAuthGuard>{children}</GuestAuthGuard>;
}
