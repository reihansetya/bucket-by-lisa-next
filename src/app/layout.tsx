import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bucket by Lisa",
  description: "Katalog Bouquet Terlengkap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <Navbar /> {/* Taruh di atas {children} agar muncul paling atas */}
        <main>{children}</main>
        {/* Anda juga bisa menaruh Footer di sini nanti */}
      </body>
    </html>
  );
}
