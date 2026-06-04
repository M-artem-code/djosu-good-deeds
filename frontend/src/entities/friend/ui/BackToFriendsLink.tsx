import Link from "next/link";
import { TextButton } from "@/shared/ui";

export function BackToFriendsLink() {
  return (
    <Link href="/friends" className="inline-flex self-start">
      <TextButton type="button">← Back to friends</TextButton>
    </Link>
  );
}
