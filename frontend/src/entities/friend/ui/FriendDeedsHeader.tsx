import { BackToFriendsLink } from "./BackToFriendsLink";

interface FriendDeedsHeaderProps {
  tag: string;
  displayName?: string;
}

export function FriendDeedsHeader({ tag, displayName }: FriendDeedsHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <BackToFriendsLink />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
          @{tag}&apos;s deeds
        </h1>
        {displayName ? (
          <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {displayName}
          </p>
        ) : null}
      </div>
    </div>
  );
}
