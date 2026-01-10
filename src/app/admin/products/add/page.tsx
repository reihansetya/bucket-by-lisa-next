"use client";

import { useState, useEffect } from "react";
import { createProduct } from "@/actions/products";
import { getCategories, createCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";
import {
  Upload,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Multiple Files
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // State Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // 1. Load Kategori
  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0].id);
    };
    fetchCats();
  }, []);

  // -- LOGIC GAMBAR --
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create previews
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(newPreviews);
    }
  };

  // 2. Handle Submit Utama (Produk)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createProduct(formData);
      // Sukses -> Redirect handled by Server Action
    } catch (error: any) {
      if (
        error.message === "NEXT_REDIRECT" ||
        error.digest?.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      console.error("Error submit:", error);
      alert("Gagal menyimpan produk! Pastikan semua data terisi.");
      setLoading(false);
    }
  };

  // 3. Handle Tambah Kategori (Modal)
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);

    try {
      const newCat = await createCategory(newCategoryName);
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat.id);
      setNewCategoryName("");
      setIsModalOpen(false);
    } catch (error) {
      alert("Gagal menambah kategori");
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products" // Kembali ke list produk, bukan dashboard utama
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="text-gray-500 text-sm">Lengkapi detail produk.</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- BAGIAN GAMBAR (MULTIPLE UPLOAD) --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Foto Produk (Bisa pilih banyak sekaligus)
            </label>

            {/* A. AREA PREVIEW GRID (Jika ada gambar) */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Badge Thumbnail */}
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-medium text-center py-1">
                        Thumbnail Utama
                      </div>
                    )}
                  </div>
                ))}

                {/* Tombol "Ganti" Kecil */}
                <label
                  htmlFor="images-input"
                  className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-primary hover:text-primary transition-all text-gray-400 bg-white"
                >
                  <ImageIcon size={24} />
                  <span className="text-xs mt-1 font-medium">Ganti Foto</span>
                </label>
              </div>
            )}

            {/* B. AREA UPLOAD BESAR (Hanya muncul jika BELUM ada gambar) */}
            {previewUrls.length === 0 && (
              <label
                htmlFor="images-input"
                className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group"
              >
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="text-primary" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Klik untuk upload foto
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Bisa pilih banyak gambar sekaligus
                </span>
              </label>
            )}

            {/* C. INPUT FILE ASLI (HIDDEN) */}
            {/* Input tunggal ini mengontrol kedua area di atas */}
            <input
              type="file"
              name="images" // Sesuai Server Action (formData.getAll('images'))
              id="images-input"
              accept="image/*"
              multiple // WAJIB: Agar bisa pilih banyak file
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NAME */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (IDR)
              </label>
              <input
                type="number"
                name="price"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <div className="flex gap-2">
                <select
                  name="category_id"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors border border-primary/20"
                  title="Tambah Kategori Baru"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                "Simpan Produk"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL ADD CATEGORY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Kategori Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Misal: Bloom Box"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  autoFocus
                />
              </div>

              <button
                onClick={handleAddCategory}
                disabled={isAddingCategory || !newCategoryName}
                className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
              >
                {isAddingCategory ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Tambah & Pilih"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
