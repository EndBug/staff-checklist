"use client";

import { NextIntlClientProvider } from "next-intl";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

import { defaultLocale, type Locale } from "~/i18n/config";
import enMessages from "~/messages/en.json";
import itMessages from "~/messages/it.json";
import { langParser } from "~/lib/search-params";

const messagesByLocale = {
  it: itMessages,
  en: enMessages,
} as const;

type I18nProviderProps = {
  children: React.ReactNode;
};

type I18nProviderShellProps = I18nProviderProps & {
  lang: Locale;
};

export function I18nProviderShell({ lang, children }: I18nProviderShellProps) {
  const messages = messagesByLocale[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

function I18nProviderWithSearchParams({ children }: I18nProviderProps) {
  const [lang] = useQueryState("lang", langParser);

  return <I18nProviderShell lang={lang}>{children}</I18nProviderShell>;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nProviderWithSearchParams>{children}</I18nProviderWithSearchParams>;
}

export function I18nProviderFallback({ children }: I18nProviderProps) {
  return (
    <I18nProviderShell lang={defaultLocale}>{children}</I18nProviderShell>
  );
}
