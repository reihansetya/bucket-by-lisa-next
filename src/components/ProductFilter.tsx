"use client";

import { Category } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

// Interface ProductFilterProps
interface ProductFilterProps {
  categories: Category[];
}
export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil value saat ini dari URL untuk set default value input
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" && key === "category") {
      params.delete(key); // Hapus param jika pilih 'Semua'
    } else {
      params.set(key, value);
    }

    // Push ke URL baru (scroll: false agar tidak loncat ke atas)
    router.push(`/product?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* FILTER KATEGORI */}
      <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <button
          onClick={() => handleFilterChange("category", "all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
            currentCategory === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            // Asumsi kategori punya field slug
            onClick={() => handleFilterChange("category", cat.slug || cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              currentCategory === (cat.slug || cat.id)
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* SORTING DROPDOWN */}
      <div className="w-full md:w-auto">
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="w-full md:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>
    </div>
  );
}
