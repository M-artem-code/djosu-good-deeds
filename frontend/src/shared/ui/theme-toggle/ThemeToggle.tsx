"use client";

import { useTheme, type Theme } from "@/shared/lib";

const NEXT_THEME: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICON: Record<Theme, string> = {
  light: "☀",
  dark: "☾",
  system: "◐",
};

const LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/** Cycles the colour theme: light → dark → system. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT_THEME[theme])}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
      title={`Theme: ${LABEL[theme]}`}
      className="flex h-11 min-h-[44px] w-11 shrink-0 items-center justify-center rounded-lg text-base text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
    >
      <span aria-hidden="true">{ICON[theme]}</span>
    </button>
  );
}
