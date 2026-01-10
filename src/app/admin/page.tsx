import Link from "next/link";
import Image from "next/image";
import { getDashboardStats } from "@/actions/dashboard";
import { Package, Tags, ArrowRight, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const { totalProducts, totalCategories, recentProducts } =
    await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">
          Selamat datang kembali, Bubub! 👋
        </p>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Produk */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Produk
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalProducts}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
        </div>

        {/* Card 2: Total Kategori */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Kategori
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalCategories}
            </h3>
          </div>
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <Tags size={24} />
          </div>
        </div>

        {/* Card 3: Status Toko (Placeholder) */}
        {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Status Toko
            </p>
            <h3 className="text-lg font-bold text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Aktif
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div> */}
      </div>

      {/* RECENT PRODUCTS SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">
            Produk Terbaru Ditambahkan
          </h3>
          <Link
            href="/admin/products"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentProducts.length > 0 ? (
                recentProducts.map((product: any) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                            No Img
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {product.categories?.name || "Umum"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-400">
                      {new Date(product.created_at).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short" }
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400 text-sm"
                  >
                    Belum ada data produk.
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
