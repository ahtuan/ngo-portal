import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@@/theme-provider";

import { TooltipProvider } from "@@/ui/tooltip";
import SideBar from "@@/side-bar";
import Header from "@@/header";
import SWRConfigProvider from "@@/swr-config-provider";
import { Toaster } from "@@/ui/toaster";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Ngõ Gốm Portal",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SWRConfigProvider>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <TooltipProvider>
                <SideBar />
              </TooltipProvider>
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                  {children}
                </main>
              </div>
            </div>
          </SWRConfigProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
