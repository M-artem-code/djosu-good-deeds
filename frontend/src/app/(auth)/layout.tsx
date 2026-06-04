import { GuestAuthGuard } from "@/features/auth/guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestAuthGuard>{children}</GuestAuthGuard>;
}
