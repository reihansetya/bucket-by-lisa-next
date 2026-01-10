import { getProducts } from "@/actions/products";
import CardProduct from "@/components/CardProduct";
import { Search } from "lucide-react";

// Metadata untuk SEO
export const metadata = {
  title: "Katalog Produk | Bucket by Lisa",
  description: "Temukan koleksi bouquet terbaik untuk momen spesialmu.",
};

export default async function ProductPage() {
  // 1. Fetch Data dari Supabase (Server Side)
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Katalog <span className="text-primary">Koleksi Kami</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Pilih bouquet favoritmu dari koleksi terbaik kami yang dibuat dengan
            sepenuh hati.
          </p>

          {/* SEARCH BAR (Visual Only untuk saat ini) */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Cari bouquet..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* GRID PRODUCT SECTION */}
      <div className="container mx-auto px-4 mt-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // EMPTY STATE (Jika Supabase kosong/error)
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm inline-block max-w-sm">
              <p className="text-gray-500 font-medium">
                Belum ada produk yang tersedia.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Silakan cek kembali nanti atau hubungi admin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
