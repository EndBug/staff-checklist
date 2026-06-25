"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { locales } from "~/i18n/config";
import { langParser } from "~/lib/search-params";
import { cn } from "~/lib/utils";

export function LanguageToggle() {
  const t = useTranslations("language");
  const [lang, setLang] = useQueryState("lang", langParser);

  return (
    <div
      className="border-border flex items-center rounded-md border p-0.5"
      role="group"
      aria-label={t("switchTo", { language: t(lang) })}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => void setLang(locale)}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium transition-colors",
            lang === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={lang === locale}
          aria-label={t("switchTo", { language: t(locale) })}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  );
}
