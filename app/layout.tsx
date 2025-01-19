import type { Metadata } from "next";
import { IBM_Plex_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/home/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bol Mitra - Your AI companion to master communication",
  description:
    "Transform raw audio into personalized intelligence and actionable feedback with BolMita AI.",
  icons: {
    icon: "/bolMitra.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const { isPro } = await getUserSubscriptionStatus(user?.id || "");

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9d5ff,transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ddd6fe,transparent)]" />
          </div>
          <Header isPro={isPro} />
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
