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
import ImageCropper from "@/components/admin/ImageCropper";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EditProductFormProps {
  product: any;
  categories: any[];
}


interface ProductImage {
  id: string;
  type: "existing" | "new";
  url: string;
  file?: File;
}

// --- KOMPONEN ITEM SORTABLE ---
function SortableImage({
  image,
  onRemove,
}: {
  image: ProductImage;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square rounded-xl overflow-hidden border bg-white group touch-none ${
        image.type === "new" ? "border-primary/50" : "border-gray-200"
      }`}
    >
      <Image
        src={image.url}
        alt="Product Image"
        fill
        className="object-cover"
        unoptimized={image.type === "existing"} // Gambar lama biasanya URL external/supabase
      />

      {/* Badge Utama (Index 0) - check di parent map nya saja biar gampang, atau pass props isFirst */}
      
      {/* Badge Baru */}
      {image.type === "new" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full shadow-sm">
            Baru
          </span>
        </div>
      )}

      {/* Tombol Hapus */}
      <button
        type="button"
        onClick={(e) => {
            e.stopPropagation(); // Mencegah drag saat klik hapus
            onRemove();
        }}
        // className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer pointer-events-auto"
        // Ubah jadi selalu visible di mobile jika perlu, atau tetap hover d desktop
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 cursor-pointer pointer-events-auto"
        title="Hapus gambar ini"
        onPointerDown={(e) => e.stopPropagation()} // Supaya tidak men-trigger drag
      >
        <X size={12} />
      </button>
    </div>
  );
}

export default function EditProductForm({
  product,
  categories: initialCategories,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE GAMBAR (DND) ---
  // Inisialisasi gambar lama ke format ProductImage
  const [images, setImages] = useState<ProductImage[]>(() => {
    const existing: ProductImage[] = (product.images || []).map(
      (url: string) => ({
        id: url, // Gunakan URL sebagai ID unik untuk gambar lama
        type: "existing",
        url,
      })
    );
    return existing;
  });

  // State Kategori
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(
    product.category_id || ""
  );

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // State Cropper
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperFileName, setCropperFileName] = useState("");
  // Queue untuk crop multiple gambar
  const [cropQueue, setCropQueue] = useState<{ src: string; name: string }[]>([]);

  // -- SENSORS DND --
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // Harus geser 8px baru dianggap drag (supaya klik biasa tetap jalan)
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // -- HANDLERS GAMBAR --

  // 1. Hapus Gambar
  const removeImage = (idToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  // 2. Tambah Gambar Baru — Buka cropper dulu sebelum menambahkan
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      // Buat queue untuk semua file yang dipilih
      const queue = fileArray.map((file) => ({
        src: URL.createObjectURL(file),
        name: file.name,
      }));

      // Set file pertama ke cropper, sisanya ke queue
      if (queue.length > 0) {
        setCropperImage(queue[0].src);
        setCropperFileName(queue[0].name);
        setCropQueue(queue.slice(1));
      }
      
      // Reset input value
      e.target.value = ""; 
    }
  };

  // Handle crop selesai
  const handleCropComplete = (croppedFile: File) => {
    // Tambahkan gambar yang sudah di-crop
    const newImage: ProductImage = {
      id: `new-${Date.now()}-${Math.random()}`,
      type: "new",
      url: URL.createObjectURL(croppedFile),
      file: croppedFile,
    };
    setImages((prev) => [...prev, newImage]);

    // Proses queue berikutnya
    if (cropQueue.length > 0) {
      const next = cropQueue[0];
      setCropperImage(next.src);
      setCropperFileName(next.name);
      setCropQueue((prev) => prev.slice(1));
    } else {
      // Semua selesai, tutup cropper
      setCropperImage(null);
      setCropperFileName("");
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    // Bersihkan semua queue
    setCropperImage(null);
    setCropperFileName("");
    setCropQueue([]);
  };

  // 3. Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // -- SUBMIT --
  // -- SUBMIT --
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append("id", product.id);

    // KITA PERLU MENYUSUN ULANG DATA GAMBAR
    // 1. existing_images: list URL gambar lama yang masih ada (sesuai urutan)
    // 2. new_images: list File gambar baru (ini akan diupload di server)
    // 3. image_order: JSON string yang memberi tahu server urutan akhir
    
    // Namun untuk simplifikasi di server action yang sudah kita rencanakan:
    // Kita kirim "image_order" yang berisi array object: { type: 'existing' | 'new', value: url | new_file_index }
    
    const imageOrderPayload = images.map((img) => {
        if (img.type === "existing") {
            return { type: "existing", url: img.url };
        } else {
             // Untuk gambar baru, kita perlu tahu dia index ke berapa dari semua file baru yang dikirim
             // Cari index relatif di antara gambar-gambar baru saja
             const newImagesOnly = images.filter(i => i.type === "new");
             const newIndex = newImagesOnly.findIndex(i => i.id === img.id);
             return { type: "new", index: newIndex };
        }
    });

    formData.append("image_order", JSON.stringify(imageOrderPayload));

    // Append Existing Images (hanya untuk referensi/backup jika perlu, tapi logic utama pakai image_order)
    // Tapi server action 'updateProduct' yang lama menharap 'existing_images'. 
    // Kita tetap kirim untuk compatibility atau diubah di server.
    // Sesuai plan, server akan baca image_order.
    
    // Append New Images Files
    // Kita filter dulu yang type 'new'
    const newImageItems = images.filter(img => img.type === "new");
    newImageItems.forEach(img => {
        if (img.file) {
            formData.append("new_images", img.file);
        }
    });
    
    // Existing images array string (untuk kebutuhan validasi server jika perlu)
    const existingItems = images.filter(img => img.type === "existing");
    existingItems.forEach(img => {
        formData.append("existing_images", img.url);
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
              Foto Produk (Drag untuk mengatur urutan)
            </label>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {images.map((img, i) => (
                    <div key={img.id} className="relative group">
                       <SortableImage 
                        image={img} 
                        onRemove={() => removeImage(img.id)}
                       />
                       {/* Label Utama jika index 0 */}
                       {i === 0 && (
                         <div className="absolute bottom-0 left-0 right-0 w-full bg-black/60 text-white text-[10px] text-center py-1 rounded-b-xl z-20 pointer-events-none">
                            Utama
                         </div>
                       )}
                    </div>
                  ))}

                  {/* 3. INPUT UPLOAD (Kotak Tambah) */}
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-primary transition-all text-gray-400 hover:text-primary">
                    <Plus size={24} />
                    <span className="text-xs mt-1 font-medium">Tambah Foto</span>
                    <input
                      type="file"
                      name="new_images_input" // Ganti nama agar tidak auto-bind ke formData secara raw (kita handle manual)
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleNewImageChange}
                    />
                  </label>
                </div>
              </SortableContext>
            </DndContext>
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

      {/* MODAL CROP GAMBAR */}
      {cropperImage && (
        <ImageCropper
          imageSrc={cropperImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          originalFileName={cropperFileName}
        />
      )}
    </div>
  );
}
