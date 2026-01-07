import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types"; // Pastikan path ini sesuai dengan file type Anda

interface CardProductProps {
  product: Product;
}

export default function CardProduct({ product }: CardProductProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Bagian Gambar */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]} // Pastikan URL gambar valid
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Image
              src="/images/heroImg.jpg"
              alt="No Image"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Label Kategori (Opsional) */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-700 rounded-full shadow-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Bagian Informasi */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            Rp {product.price.toLocaleString("id-ID")}
          </span>

          <Link
            href={`/product/${product.id}`}
            className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
