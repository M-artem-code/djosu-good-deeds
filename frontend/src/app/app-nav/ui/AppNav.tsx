"use client";

import { LogoutConfirmModal } from "@/features/auth/logout";
import { useAppSelector } from "@/shared/api";
import { routes } from "@/shared/config";
import { useDisclosure } from "@/shared/lib";
import { TextButton, ThemeToggle } from "@/shared/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: routes.deeds, label: "Deeds" },
  { href: routes.friends, label: "Friends" },
  { href: routes.settings, label: "Settings" },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      )}
    </svg>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const menu = useDisclosure(false);
  const logoutModal = useDisclosure(false);

  const handleLogoutClick = () => {
    menu.close();
    logoutModal.open();
  };

  const linkClass = (href: string, mobile = false) => {
    const active = pathname === href;
    if (mobile) {
      return active
        ? "block rounded-lg bg-zinc-100 px-3 py-2 text-base font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        : "block rounded-lg px-3 py-2 text-base font-normal text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50";
    }
    return active
      ? "border-b-2 border-zinc-900 pb-1 text-base font-semibold text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
      : "text-base font-normal text-zinc-600 dark:text-zinc-400";
  };

  return (
    <header className="shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 md:px-6">
        <Link
          href={routes.deeds}
          className="shrink-0 text-base font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Djosu
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-4 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <span className="font-mono text-sm font-normal text-zinc-600 dark:text-zinc-400">
              @{user.tag}
            </span>
          ) : null}
          <ThemeToggle />
          <TextButton onClick={handleLogoutClick}>Log out</TextButton>
        </div>

        <div className="flex min-w-0 items-center gap-2 md:hidden">
          <ThemeToggle />
          {user ? (
            <span className="max-w-[6rem] truncate font-mono text-sm font-normal text-zinc-600 sm:max-w-[8rem] dark:text-zinc-400">
              @{user.tag}
            </span>
          ) : null}
          <TextButton onClick={handleLogoutClick}>Log out</TextButton>
          <button
            type="button"
            className="flex h-11 min-h-[44px] w-11 shrink-0 items-center justify-center rounded-lg text-zinc-900 dark:text-zinc-50"
            aria-expanded={menu.isOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menu.isOpen ? "Close menu" : "Open menu"}
            onClick={menu.toggle}
          >
            <MenuIcon open={menu.isOpen} />
          </button>
        </div>
      </div>

      {menu.isOpen ? (
        <div
          id="mobile-nav-menu"
          className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-700 dark:bg-zinc-900"
        >
          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href, true)}
                onClick={menu.close}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      {logoutModal.isOpen ? (
        <LogoutConfirmModal onClose={logoutModal.close} />
      ) : null}
    </header>
  );
}
