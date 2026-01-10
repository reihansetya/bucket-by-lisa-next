import { getProductBestSeller } from "@/actions/products";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const products = await getProductBestSeller();
  console.log("Products: ", products);
  return (
    <main>
      <Hero />
      <InfoSection />

      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Best Sellers 🔥
              </h2>
              <p className="text-gray-500 mt-2">
                Produk favorit pilihan pelanggan kami.
              </p>
            </div>
            <Link
              href="/product"
              className="group flex items-center gap-1 text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Lihat Semua
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* GRID: 2 Kolom Mobile, 4 Kolom Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              // Fallback Image
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/images/heroImg.jpg";

              return (
                <Link
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* WRAPPER GAMBAR (Square & Full) */}
                  <div className="relative h-[400px] aspect-square w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge Kategori (Opsional) */}
                    {product.categories?.name && (
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-700 shadow-sm z-10">
                        {product.categories.name}
                      </div>
                    )}
                  </div>

                  {/* INFO PRODUK (Simpel: Nama & Harga) */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold mt-1 text-sm sm:text-base">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty State Jika Tidak Ada Data */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Belum ada produk Best Seller saat ini.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
