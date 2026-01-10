"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  // 1. Hitung Total Produk
  const { count: productCount, error: productError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true }); // head: true artinya cuma hitung, gak ambil data

  // 2. Hitung Total Kategori
  const { count: categoryCount, error: categoryError } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  // 3. Ambil 5 Produk Terbaru
  const { data: recentProducts, error: recentError } = await supabase
    .from("products")
    .select(
      "id, name, price, created_at, images, category_id, categories(name)"
    ) // Join kategori
    .order("created_at", { ascending: false })
    .limit(5);

  if (productError || categoryError || recentError) {
    console.error("Error fetching dashboard stats");
  }

  return {
    totalProducts: productCount || 0,
    totalCategories: categoryCount || 0,
    recentProducts: recentProducts || [],
  };
}
