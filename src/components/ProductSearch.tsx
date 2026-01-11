"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
export default function ProductSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const defaultSearch = searchParams.get("search")?.toString();
  const [search, setsearch] = useState(defaultSearch || "");

  // Ambil value search dari URL saat ini (agar kalau direfresh tetap ada)

  // Fungsi handle search dengan debounce manual
  // Agar tidak request ke server setiap kali ketik 1 huruf
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    // Update URL tanpa refresh halaman
    replace(`/product?${params.toString()}`);
  };

  const handleClear = () => {
    setsearch("");
    handleSearch("");
  };

  return (
    <div className="max-w-md mx-auto relative md:block">
      <input
        type="text"
        placeholder="Cari bucket..."
        value={search}
        onChange={(e) => {
          // Debounce simpel: Tunggu 500ms setelah user stop ngetik baru search
          const value = e.target.value;
          setsearch(value);

          setTimeout(() => {
            if (value === e.target.value) handleSearch(value);
          }, 500);
        }}
        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50 focus:bg-white"
      />
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          title="Hapus pencarian"
        >
          <X className="text-primary" size={16} />
        </button>
      )}
    </div>
  );
}
