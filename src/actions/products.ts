"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/types";

// --- HELPER: Upload File Single ---
async function uploadFile(file: File, supabase: any) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file);

  if (error) throw new Error("Gagal upload gambar");

  const { data } = supabase.storage.from("products").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, price, created_at, images, category_id, categories(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// --- CREATE PRODUCT (BULK) ---
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("category_id") as string;

  // Ambil semua file dengan key 'images'
  const imageFiles = formData.getAll("images") as File[];

  const uploadedUrls: string[] = [];

  // Loop upload semua gambar
  for (const file of imageFiles) {
    if (file.size > 0) {
      try {
        const url = await uploadFile(file, supabase);
        uploadedUrls.push(url);
      } catch (err) {
        console.error("Skipped one file due to error");
      }
    }
  }

  const { error: dbError } = await supabase.from("products").insert({
    name,
    description,
    price,
    category_id: categoryId,
    images: uploadedUrls, // Simpan array URL
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    throw new Error("Gagal menyimpan data produk");
  }

  revalidatePath("/admin");
  revalidatePath("/product");
  redirect("/admin/products");
}

// --- UPDATE PRODUCT (BULK + EXISTING) ---
export async function updateProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("category_id") as string;

  // 1. Ambil URL gambar lama yang DIPERTAHANKAN (dikirim sebagai string array)
  const existingImages = formData.getAll("existing_images") as string[];

  // 2. Ambil File gambar BARU
  const newImageFiles = formData.getAll("new_images") as File[];

  const newUploadedUrls: string[] = [];

  // Upload gambar baru
  for (const file of newImageFiles) {
    if (file.size > 0) {
      const url = await uploadFile(file, supabase);
      newUploadedUrls.push(url);
    }
  }

  // Gabungkan: Gambar Lama + Gambar Baru
  // Urutan: User biasanya ingin gambar lama tetap di depan, atau bisa diatur di frontend.
  // Di sini kita taruh gambar lama dulu, baru gambar baru.
  const finalImages = [...existingImages, ...newUploadedUrls];

  const { error: dbError } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      category_id: categoryId,
      images: finalImages,
    })
    .eq("id", id);

  if (dbError) {
    console.error("Update Error:", dbError);
    throw new Error("Gagal update produk");
  }

  revalidatePath("/admin");
  revalidatePath("/product");
  redirect("/admin/products");
}

export async function deleteProduct(id: string, imageUrls: string[] | null) {
  // Logic delete tetap sama, tapi nanti bisa diupdate untuk loop hapus semua gambar di storage
  const supabase = await createClient();

  if (imageUrls && imageUrls.length > 0) {
    const fileNames = imageUrls
      .map((url) => url.split("/").pop())
      .filter((n) => n !== undefined) as string[];
    if (fileNames.length > 0) {
      await supabase.storage.from("products").remove(fileNames);
    }
  }

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin");
}
