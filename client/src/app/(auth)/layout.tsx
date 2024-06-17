import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";

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
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-center my-auto">
            <div className="w-full md:w-1/3  mx-auto border rounded-lg p-6 lg:p-8 ">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
