import type { Metadata } from "next";
import { IBM_Plex_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/home/Header";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LipiMitraAI - Video to Blog/Tweet Converter",
  description:
    "Transform your videos into engaging blogs and tweet threads automatically with LipiMitraAI",
  icons: {
    icon: "/lipiMitra.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Header></Header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
