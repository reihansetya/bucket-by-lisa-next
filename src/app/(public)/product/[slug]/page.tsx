import {
  getProductById,
  getProductBySlug,
  getRelatedProducts,
} from "@/actions/products";
import ProductImageGallery from "@/components/ProductImageGallery";
import CardProduct from "@/components/CardProduct"; // 👈 Import CardProduct
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, ShoppingBag, ArrowLeft, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERATE METADATA (Untuk SEO & Share Link WA)
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  // const product = await getProductById(id);
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  return {
    title: `${product.name} | Bucket by Lisa`,
    description: product.description.substring(0, 160), // Ambil 160 karakter pertama
    openGraph: {
      images:
        product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

// 2. HALAMAN UTAMA
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // Await params (Wajib di Next.js 15)
  const { slug } = await params;
  // const product = await getProductById(id);
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound(); // Akan menampilkan halaman 404 default Next.js
  }

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  // Format pesan WhatsApp otomatis
  const waNumber = "6285156893702";
  const message = `Halo Ka,\nSaya mau pesan produk *${
    product.name
  }* seharga Rp ${product.price.toLocaleString(
    "id-ID"
  )}. Apakah masih available?
  \nLink Produk: https://bucket-by-lisa.vercel.app/product/${product.slug}
  `;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* BREADCRUMB / BACK BUTTON */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/product"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* KOLOM KIRI: GALERI GAMBAR */}
          <div>
            <ProductImageGallery images={product.images || []} />
          </div>

          {/* KOLOM KANAN: INFO PRODUK */}
          <div className="flex flex-col h-full">
            {/* Kategori Badge */}
            {product.categories?.name && (
              <span className="w-fit px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
                {product.categories.name}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-primary">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              {/* Stok Status (Opsional, hardcoded dulu) */}
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Ready Stock
              </span>
            </div>

            {/* Garis Pemisah */}
            <hr className="border-gray-100 mb-6" />

            <div className="prose prose-gray max-w-none mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Deskripsi Produk
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* TOMBOL AKSI (Fixed di bawah pada mobile agar UX bagus) */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Pesan Sekarang
              </a>

              {/* <a
                href={waLink} // Link yang sama atau link tanya-tanya
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Tanya Dulu
              </a> */}
            </div>

            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
              <Share2 size={12} /> Transaksi aman & terpercaya via WhatsApp
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 md:pt-32 pt-16">
            <h3 className="text-2xl  text-center font-bold text-gray-900 mb-6">
              Produk Terkait ✨
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <CardProduct key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
