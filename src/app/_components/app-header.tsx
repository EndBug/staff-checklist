"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { LanguageToggle } from "~/app/_components/language-toggle";
import { ThemeToggle } from "~/app/_components/theme-toggle";

export function AppHeader({
  showLanguageToggle = true,
}: {
  showLanguageToggle?: boolean;
}) {
  const t = useTranslations("header");

  return (
    <header className="bg-background/95 sticky top-0 z-20 border-b border-border backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          href="/instructors"
          className="text-foreground flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold tracking-wide sm:gap-4 sm:text-base"
        >
          <Image
            src="/logo_dark.png"
            alt=""
            height={28}
            width={102}
            className="h-7 w-auto shrink-0 object-contain dark:hidden"
            priority
          />
          <Image
            src="/logo_light.png"
            alt=""
            height={28}
            width={102}
            className="hidden h-7 w-auto shrink-0 object-contain dark:block"
            priority
          />
          <span className="hidden truncate sm:inline">{t("title")}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {showLanguageToggle ? <LanguageToggle /> : null}
        </div>
      </div>
    </header>
  );
}
