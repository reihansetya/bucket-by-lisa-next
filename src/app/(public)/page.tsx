// src/app/page.tsx
import { getProducts } from "@/actions/products";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import Link from "next/dist/client/link";
import Image from "next/image";

export default async function HomePage() {
  const products = await getProducts();

  console.log("Product: ", products);

  return (
    <main>
      <Hero />
      <InfoSection />
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-500 mt-2">
                Produk paling banyak dicari minggu ini
              </p>
            </div>
            <Link
              href="/product"
              className="text-primary font-bold hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          {/* Grid responsif: 1 kolom di HP, 3 di Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map produk Anda di sini */}
          </div>
        </div>
      </section>
    </main>
  );
}
