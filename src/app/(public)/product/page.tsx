import Link from "next/link";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import CardProduct from "@/components/CardProduct";
import ProductFilter from "@/components/ProductFilter";
import ProductSearch from "@/components/ProductSearch";
import { Search, ArrowLeft } from "lucide-react";

interface ProductPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Metadata untuk SEO
export const metadata = {
  title: "Katalog Produk | Bucket by Lisa",
  description: "Temukan koleksi bouquet terbaik untuk momen spesialmu.",
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
  // 1. Ambil Params dari URL (Async di Next.js 15)
  const params = await searchParams;
  console.log("params: ", params);

  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  // 2. Fetch Data Paralel (Product + Categories)
  const [products, categories] = await Promise.all([
    getProducts({ categorySlug, sort, search }),
    getCategories(),
  ]);

  console.log("Products: ", products);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-100 shadow-sm z-30">
        <div className="container mx-auto px-4 py-8 md:py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Katalog <span className="text-primary">Koleksi Kami</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8 hidden md:block">
            Pilih bucket favoritmu dari koleksi terbaik kami.
          </p>
          {/* Search Bar */}
          <ProductSearch />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* --- FILTER & SORT SECTION --- */}
        {/* Kita render komponen Filter disini */}
        <ProductFilter categories={categories || []} />

        {/* GRID PRODUCT SECTION */}
        <div className="mt-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.map((product) => (
                <CardProduct key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // EMPTY STATE (Jika hasil filter kosong)
            <div className="text-center py-20">
              <div className="bg-white p-8 rounded-2xl shadow-sm inline-block max-w-sm border border-gray-100">
                <div className="text-5xl mb-4">🥀</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {search || "Produk"} Tidak Ditemukan
                </h3>
                <p className="text-gray-500 font-medium text-sm">
                  Coba cari kata kunci lain atau reset filter.
                </p>
                <Link
                  href="/product"
                  className="mt-4 inline-block text-primary font-bold text-sm hover:underline"
                >
                  Lihat Semua Produk
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
