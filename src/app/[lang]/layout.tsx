import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import type { Locale } from "~/i18n-config";
import Navbar from "~/components/navbar";
import { getDictionary } from "~/get-dictionary";
import DictionaryProvider from "~/components/dictionary-provider";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: Locale }> }>) {
  const p = await params;

  const dictionary = await getDictionary(p.lang);

  return (
    <html
      className={`${geist.variable}`}
      suppressHydrationWarning
      lang={p.lang}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <DictionaryProvider dictionary={dictionary}>
              <div className="bg-background min-h-[100vh]">
                <Navbar />
                <main className="border-border border-dashed px-3 py-2 lg:mx-32 lg:border-r-2 lg:border-l-2">
                  {children}
                </main>
              </div>
            </DictionaryProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
