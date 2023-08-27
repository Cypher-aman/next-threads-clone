import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/shared/Header";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "This is Next.js 13 Threads clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
        </head>
        <body className={inter.className}>
          <Header />

          <main className="flex">
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <RightSidebar />
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
