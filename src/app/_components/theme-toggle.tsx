"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "~/lib/utils";

const themes = ["light", "dark", "system"] as const;

type Theme = (typeof themes)[number];

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

function emptySubscribe() {
  return () => undefined;
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="border-border h-7 w-19 rounded-md border" aria-hidden />
    );
  }

  const currentTheme = (theme ?? "light") as Theme;

  return (
    <div
      className="border-border flex items-center rounded-md border p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {themes.map((value) => {
        const Icon = themeIcons[value];

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "rounded p-1.5 transition-colors",
              currentTheme === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={currentTheme === value}
            aria-label={t("switchTo", { theme: t(value) })}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
