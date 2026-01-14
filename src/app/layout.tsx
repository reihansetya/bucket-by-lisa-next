import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. Definisi Base URL (Wajib ada untuk SEO Next.js App Router)
  metadataBase: new URL("https://bucketbylisa.vercel.app"),

  title: {
    template: "%s | Bucket by Lisa - Bintaro & Tangsel",
    default: "Bucket by Lisa | Jasa Buket Pondok Aren, Tangsel & Jakarta",
  },
  applicationName: "Bucket by Lisa",
  description:
    "Pesan buket bunga, uang, dan snack wisuda terbaik di Bintaro, Pondok Aren, Tangerang Selatan (Tangsel), dan Jakarta Selatan. Pengiriman cepat & harga terjangkau.",
  keywords: [
    "buket Bintaro",
    "buket Pondok Aren",
    "buket Bunga Bintaro",
    "buket Uang Tangsel",
    "buket Wisuda Jakarta",
    "buket Wisuda",
    "Florist Bintaro",
    "Toko Bunga Tangerang Selatan",
    "Hadiah Wisuda Jakarta Selatan",
  ],

  // 2. Konfigurasi Logo di Tab Browser (Favicon)
  // Pastikan file 'logobucketlisa.png' ada di folder 'public'
  icons: {
    icon: "/logobucketlisa.png",
    apple: "/logobucketlisa.png", // Untuk icon di iPhone/iPad
  },

  openGraph: {
    title: "Bucket by Lisa | Jasa Buket Bunga Pondok Aren & Tangsel",
    description: "Jasa pembuatan buket bunga, uang, dan snack wisuda.",
    url: "https://bucketbylisa.vercel.app",
    siteName: "Bucket by Lisa",
    locale: "id_ID",
    type: "website",
  },

  // 3. Canonical URL (Mencegah konten duplikat di mata Google)
  alternates: {
    canonical: "/",
  },

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
        {/* HAPUS Navbar & Footer dari sini (Sudah benar karena pakai Route Groups) */}
        {children}

        {/* JSON-LD Script untuk SEO Lokal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Bucket by Lisa",
              image: "https://bucketbylisa.vercel.app/logobucketlisa.png", // Tambahkan link logo disini
              description:
                "Jasa pembuatan bucket bunga, uang, dan snack di Bintaro, Pondok Aren, dan Tangerang Selatan.",
              url: "https://bucketbylisa.vercel.app",
              telephone: "+6281234567890", // Ganti dengan nomor WA Anda jika mau
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

        {/* JSON-LD untuk Nama Website (Brand Signal) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Bucket by Lisa",
              url: "https://bucketbylisa.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://bucketbylisa.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
