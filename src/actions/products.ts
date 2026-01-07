"use server";

import { createClient } from "@/lib/supabase/server"; // 👈 Ganti import ke server
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProducts() {
  // 1. Inisialisasi client server (wajib pakai await di Next.js 15/16)
  const supabase = await createClient();

  // 2. Query data seperti biasa
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // 1. Ambil data dari Form
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("category_id") as string;
  const imageFile = formData.get("image") as File;

  let imageUrl = null;

  // 2. Proses Upload Gambar (Jika ada)
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload ke Bucket 'products'
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      throw new Error("Gagal upload gambar");
    }

    // Dapatkan URL Public
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    imageUrl = urlData.publicUrl;
  }

  const { error: dbError } = await supabase.from("products").insert({
    name,
    description,
    price,
    category_id: categoryId, // 👈 Pakai ID Relasi
    images: imageUrl ? [imageUrl] : [], // Simpan sebagai array
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    throw new Error("Gagal menyimpan data produk");
  }

  revalidatePath("/admin");
  revalidatePath("/product");
  redirect("/admin");
}

export async function deleteProduct(id: string, imageUrl: string | null) {
  const supabase = await createClient();

  // 1. Hapus Gambar dari Storage (Jika ada)
  if (imageUrl) {
    // Ekstrak nama file dari URL
    // URL biasanya: .../storage/v1/object/public/products/nama-file.jpg
    const fileName = imageUrl.split("/").pop();

    if (fileName) {
      await supabase.storage.from("products").remove([fileName]);
    }
  }

  // 2. Hapus Data dari Database
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Gagal menghapus produk");
  }

  // 3. Refresh Halaman
  revalidatePath("/admin");
  revalidatePath("/product");
}
