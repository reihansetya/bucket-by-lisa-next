import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Plus, Pencil, Star } from "lucide-react";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductImportExport from "@/components/admin/ProductImportExport";
export default async function AdminProducts() {
  const products = await getProducts();
  // tes
  return (
    <div>
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Produk</h1>
          <p className="text-gray-500 text-sm">
            Manage Produk kamu disini bub.
          </p>
        </div>
      </div>

      {/* BUTTON SECTION - Updated */}
      <div className="pb-5 w-full flex flex-col items-end gap-3 md:flex-row md:justify-end md:items-center">
        <ProductImportExport />
        <Link
          href="/admin/products/add"
          className="bg-primary text-white md:px-6 px-18.5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-fit md:w-auto justify-center"
        >
          <Plus size={18} /> Tambah Produk
        </Link>
      </div>
      {/* DATA TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Gambar</th>
                <th className="px-6 py-4 font-semibold">Nama Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-right pr-7.5 md:pr-12">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* KOLOM GAMBAR */}
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] md:text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>

                    {/* KOLOM NAMA PRODUK - Font Kecil di Mobile */}
                    <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-900 text-sm md:text-base">
                      <div className="flex items-center flex-wrap gap-1">
                        <span>{product.name}</span>
                        {product.is_best_seller && (
                          <Star
                            size={14} // Icon lebih kecil di mobile (default biasanya 16/18)
                            className="text-red-400 md:w-[18px] md:h-[18px]"
                          />
                        )}
                      </div>
                    </td>

                    {/* KOLOM KATEGORI */}
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap">
                        {product.categories?.name || "Umum"}
                      </span>
                    </td>

                    {/* KOLOM HARGA - Font Kecil di Mobile */}
                    <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-600 text-sm md:text-base whitespace-nowrap">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>

                    {/* KOLOM ACTION */}
                    <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Link
                          href={`/admin/products/edit/${product.slug}`}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          imageUrl={product.images}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm md:text-base text-gray-400"
                  >
                    Belum ada data produk. Silakan tambah produk baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
