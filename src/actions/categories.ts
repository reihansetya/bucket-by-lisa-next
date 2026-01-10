"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Get All (Sudah ada)
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) return [];
  return data;
}

// 2. Create (Sudah ada - kita rapikan sedikit)
export async function createCategory(name: string) {
  const supabase = await createClient();
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories"); // Refresh halaman kategori
  return data;
}

// 3. Update (BARU)
export async function updateCategory(id: string, name: string) {
  const supabase = await createClient();
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const { error } = await supabase
    .from("categories")
    .update({ name, slug })
    .eq("id", id);

  if (error) throw new Error("Gagal update kategori");
  revalidatePath("/admin/categories");
}

// 4. Delete (BARU)
export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    // Biasanya error karena Foreign Key (kategori masih dipakai produk)
    console.error(error);
    throw new Error(
      "Gagal menghapus. Pastikan kategori tidak sedang dipakai oleh produk apapun."
    );
  }
  revalidatePath("/admin/categories");
}
