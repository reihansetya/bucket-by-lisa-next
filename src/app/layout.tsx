import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Bucket by Lisa - Bintaro & Tangsel",
    default: "Bucket by Lisa | Jasa Buket Bunga Pondok Aren, Tangsel & Jakarta",
  },
  description:
    "Pesan buket bunga, uang, dan snack wisuda terbaik di Bintaro, Pondok Aren, Tangerang Selatan (Tangsel), dan Jakarta Selatan. Pengiriman cepat & harga terjangkau.",
  keywords: [
    "Bucket Bintaro",
    "Bucket Pondok Aren",
    "Bucket Bunga Bintaro",
    "Bucket Uang Tangsel",
    "Bucket Wisuda Jakarta",
    "Florist Bintaro",
    "Toko Bunga Tangerang Selatan",
    "Hadiah Wisuda Jakarta Selatan",
  ],
  verification: {
    google: "pYX3aDZGcytaw2tdefMJf51qlZe12jy9Ac3OlsCARPw",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* HAPUS Navbar & Footer dari sini */}
        {children}

        {/* JSON-LD Script untuk SEO Lokal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Bucket by Lisa",
              description:
                "Jasa pembuatan bucket bunga, uang, dan snack di Bintaro, Pondok Aren, dan Tangerang Selatan.",
              url: "https://bucketbylisa.vercel.app",
              areaServed: [
                "Pondok Aren",
                "Bintaro",
                "Tangerang Selatan",
                "Jakarta Selatan",
              ],
              priceRange: "$$",
            }),
          }}
        />
      </body>
    </html>
  );
}
