"use client";

import { useState } from "react";
import { deleteProduct } from "@/actions/products";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProductButtonProps {
  id: string;
  imageUrl: string[] | null;
  productName: string;
}

export default function DeleteProductButton({
  id,
  imageUrl,
  productName,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Yakin ingin menghapus produk "${productName}"?`
    );

    if (confirm) {
      setIsDeleting(true);
      try {
        await deleteProduct(id, imageUrl);
        // Tidak perlu redirect, revalidatePath di server akan me-refresh tabel otomatis
      } catch (error) {
        alert("Gagal menghapus produk");
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Produk"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
