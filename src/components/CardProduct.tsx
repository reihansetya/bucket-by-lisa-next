import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface CardProductProps {
  product: Product;
}

export default function CardProduct({ product }: CardProductProps) {
  // Fallback gambar jika kosong
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/heroImg.jpg";

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* --- WRAPPER GAMBAR --- */}
      {/* UBAH DISINI: Ganti aspect-square menjadi fixed height h-[400px] (atau h-[250px] sm:h-[400px] agar mobile tidak terlalu panjang) */}
      <div className="relative h-[275px] w-full bg-gray-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          // UBAH DISINI:
          // 1. object-cover: Agar gambar mengisi penuh area (full) tanpa sisa background
          // 2. Hapus class 'p-2': Agar tidak ada jarak (padding) antara gambar dan tepi kartu
          className="object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Label Kategori */}
        {product.categories?.name && (
          <div className="absolute top-2 left-2 bg-primary backdrop-blur-lg px-4 py-1.5 rounded text-[10px] font-bold text-white shadow-lg z-10">
            {product.categories.name}
          </div>
        )}
      </div>

      {/* --- INFO PRODUK --- */}
      <div className="p-3 flex flex-col flex-grow">
        <h3
          className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 mb-1 leading-tight"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-2 hidden sm:block">
          {product.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto gap-2">
          <span className="text-primary font-bold text-sm sm:text-lg">
            Rp {product.price.toLocaleString("id-ID")}
          </span>

          <Link
            href={`/product/${product.slug}`}
            className="w-full sm:w-auto text-center px-3 py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-colors active:scale-95"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
