"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug?: string;
};

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories] = useState(initialCategories); // Data awal dari server

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State Form (Dipakai untuk Create & Edit)
  const [editingId, setEditingId] = useState<string | null>(null); // Jika null = Mode Create
  const [name, setName] = useState("");

  // -- HANDLERS --

  // 1. Buka Modal untuk CREATE
  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setIsModalOpen(true);
  };

  // 2. Buka Modal untuk EDIT
  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setIsModalOpen(true);
  };

  // 3. Handle Simpan (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        // Mode UPDATE
        await updateCategory(editingId, name);
      } else {
        // Mode CREATE
        await createCategory(name);
      }

      // Sukses
      setIsModalOpen(false);
      setName("");
      router.refresh(); // Refresh data tabel
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${catName}"?`)) return;

    try {
      await deleteCategory(id);
      router.refresh();
    } catch (error: any) {
      alert(error.message); // Muncul jika kategori masih dipakai produk
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Produk</h1>
          <p className="text-gray-500 text-sm">
            Kelola label kategori untuk produkmu.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-shadow shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama Kategori</th>
              <th className="px-6 py-4 font-semibold">Slug (URL)</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialCategories.length > 0 ? (
              initialCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm italic">
                    {cat.slug || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  Belum ada kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Kategori" : "Kategori Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bloom Box"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !name}
                className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Simpan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
