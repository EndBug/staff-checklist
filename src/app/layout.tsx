import "~/styles/globals.css";

import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { AppHeader } from "~/app/_components/app-header";
import { ConvexClientProvider } from "~/components/convex-client-provider";
import { ThemeProvider } from "~/components/theme-provider";
import { I18nProvider, I18nProviderFallback } from "~/i18n/provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Staff Checklist",
  description: "Checklist di apertura e chiusura per AeroGravity",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`font-sans ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="text-foreground flex min-h-screen flex-col">
        <ThemeProvider>
          <NuqsAdapter>
            <Suspense
              fallback={
                <I18nProviderFallback>
                  <ConvexClientProvider>
                    <AppHeader showLanguageToggle={false} />
                    {children}
                  </ConvexClientProvider>
                </I18nProviderFallback>
              }
            >
              <I18nProvider>
                <ConvexClientProvider>
                  <AppHeader />
                  {children}
                </ConvexClientProvider>
              </I18nProvider>
            </Suspense>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
