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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 2. Handle Submit Utama (Produk)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Wajib: Mencegah reload browser
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createProduct(formData);
      // Sukses -> Redirect akan ditangani oleh Server Action
    } catch (error: any) {
      if (
        error.message === "NEXT_REDIRECT" ||
        error.digest?.includes("NEXT_REDIRECT")
      ) {
        return; // Diamkan saja, biarkan Next.js melakukan redirect
      }
      console.error("Error submit:", error);
      alert("Gagal menyimpan produk! Pastikan semua data terisi.");
      setLoading(false); // Matikan loading jika gagal
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
          href="/admin"
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="text-gray-500 text-sm">
            Lengkapi detail produk bouquet cantikmu.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {/* PERBAIKAN 1: Gunakan onSubmit={handleSubmit} */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto Produk
            </label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-300" size={32} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="image"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-primary cursor-pointer transition-colors"
                >
                  <Upload size={16} /> Pilih Gambar
                </label>
              </div>
            </div>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
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
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-gray-50">
            {/* PERBAIKAN 2: Hapus onClick manual, biarkan form handler yang bekerja */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Kategori Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
