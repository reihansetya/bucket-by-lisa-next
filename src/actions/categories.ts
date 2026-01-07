"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Ambil semua kategori untuk Dropdown
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) return [];
  return data;
}

// 2. Buat kategori baru (Quick Add)
export async function createCategory(name: string) {
  const supabase = await createClient();
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select() // Penting: Return data agar bisa langsung masuk dropdown
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data; // Mengembalikan object kategori baru { id, name }
}
