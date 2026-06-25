"use client";

import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";

import { ConvexProvider, ConvexReactClient } from "convex/react";

function ConvexSetupRequired() {
  const t = useTranslations("convex");

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-xl font-semibold">{t("notConfiguredTitle")}</h1>
      <p className="text-muted-foreground text-sm">
        {t.rich("notConfiguredDescription", {
          convexDev: () => (
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              pnpm convex:dev
            </code>
          ),
          dev: () => (
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              pnpm dev
            </code>
          ),
          envFile: () => (
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              .env.local
            </code>
          ),
          envVar: () => (
            <code className="font-mono text-xs">NEXT_PUBLIC_CONVEX_URL</code>
          ),
        })}
      </p>
    </main>
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const client = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [convexUrl],
  );

  if (!client) {
    return <ConvexSetupRequired />;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
