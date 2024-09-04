import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@@/theme-provider";

import { TooltipProvider } from "@@/ui/tooltip";
import SideBar from "@@/side-bar";
import Header from "@@/header";
import SWRConfigProvider from "@@/swr-config-provider";
import { Toaster } from "@@/ui/toaster";
import NavigationBar from "@@/navigation-bar";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Ngõ Portal",
  icons: [
    {
      sizes: "32x32",
      url: "/fav/favicon-32x32.png",
      rel: "icon",
    },
    {
      sizes: "16x16",
      url: "/fav/favicon-16x16.png",
      rel: "icon",
    },
    {
      rel: "apple-touch-icon",
      url: "/fav/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "mask-icon",
      url: "/fav/safari-pinned-tab.svg",
      color: "#f2ae72",
    },
  ],
  manifest: "/fav/site.webmanifest",
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

                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                  <Header />
                  <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                    <div className="grid flex-1 items-start gap-4 p-4 pt-2 sm:px-6 sm:py-0 ">
                      {children}
                    </div>
                  </main>
                  <NavigationBar />
                </div>
              </TooltipProvider>
            </div>
          </SWRConfigProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
