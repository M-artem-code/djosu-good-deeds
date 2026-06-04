import { BackToFriendsLink } from "./BackToFriendsLink";

export function ForbiddenDeedsView() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {"You can't view this user's deeds"}
      </h2>
      <div className="flex justify-center">
        <BackToFriendsLink />
      </div>
    </div>
  );
}
