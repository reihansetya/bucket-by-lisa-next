"use client";

import { useState } from "react";
import { updateProduct } from "@/actions/products";
import { createCategory } from "@/actions/categories";
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

interface EditProductFormProps {
  product: any;
  categories: any[];
}

export default function EditProductForm({
  product,
  categories: initialCategories,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE GAMBAR (DIPERBAIKI) ---
  // Simpan array gambar yang sudah ada di DB
  const [existingImages, setExistingImages] = useState<string[]>(
    product.images || []
  );
  // Simpan preview gambar baru yang akan diupload
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // State Kategori
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(
    product.category_id || ""
  );

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // -- HANDLERS GAMBAR --

  // 1. Hapus Gambar Lama (Hanya hapus dari tampilan UI)
  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // 2. Tambah Gambar Baru (Preview)
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...urls]); // Append ke preview yg sudah ada (opsional)
      // Note: Karena input file sifatnya replace, cara terbaik sbnrnya replace state preview
      // Tapi untuk UX "Tambah", kita butuh trik khusus atau biarkan replace behaviour.
      // Di sini kita pakai replace behaviour untuk newPreviews agar konsisten dengan input file HTML.
      setNewPreviews(urls);
    }
  };

  // -- SUBMIT --
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append("id", product.id);

    // KIRIM LIST GAMBAR LAMA YANG TERSISA
    // (Gambar yg dihapus user tidak akan masuk ke sini, jadi nanti di server akan hilang)
    existingImages.forEach((url) => {
      formData.append("existing_images", url);
    });

    try {
      await updateProduct(formData);
    } catch (error: any) {
      if (
        error.message === "NEXT_REDIRECT" ||
        error.digest?.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      console.error("Error updating:", error);
      alert("Gagal memperbarui produk.");
      setLoading(false);
    }
  };

  // ... Logic handleAddCategory SAMA ...
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
          href="/admin/products"
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-500 text-sm">
            Perbarui informasi produk ini.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- BAGIAN GAMBAR --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Foto Produk
            </label>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* 1. RENDER GAMBAR LAMA */}
              {existingImages.map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <Image
                    src={url}
                    alt="Existing"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Tombol Hapus Gambar Lama */}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Hapus gambar ini"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && newPreviews.length === 0 && (
                    <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-1">
                      Utama
                    </div>
                  )}
                </div>
              ))}

              {/* 2. RENDER GAMBAR BARU (PREVIEW) */}
              {newPreviews.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/50"
                >
                  <Image
                    src={url}
                    alt="New Preview"
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full shadow-sm">
                      Baru
                    </span>
                  </div>
                </div>
              ))}

              {/* 3. INPUT UPLOAD (Kotak Tambah) */}
              <label className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-primary transition-all text-gray-400 hover:text-primary">
                <Plus size={24} />
                <span className="text-xs mt-1 font-medium">Tambah Foto</span>
                <input
                  type="file"
                  name="new_images" // Sesuai Server Action (updateProduct)
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleNewImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              Gambar yang dihapus akan hilang permanen setelah disimpan.
            </p>
          </div>

          {/* INPUT FORM LAINNYA (Sama) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                defaultValue={product.name}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (IDR)
              </label>
              <input
                type="number"
                name="price"
                defaultValue={product.price}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Best Seller
              </label>
              <select
                name="is_best_seller"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                defaultValue={product.is_best_seller}
              >
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <div className="flex gap-2">
                <select
                  name="category_id"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
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
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product.description}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL KATEGORI (Sama persis) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Kategori Baru</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama Kategori"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                disabled={isAddingCategory || !newCategoryName}
                className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
