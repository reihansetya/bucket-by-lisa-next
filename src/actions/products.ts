"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Search } from "lucide-react";

interface ProductFilter {
  name?: string;
  categorySlug?: string;
  sort?: string;
  search?: string;
}

interface CSVProductData {
  name: string;
  description: string;
  price: string | number;
  category: string;
  is_best_seller: string | boolean;
}

// --- HELPER: Upload File Single ---
async function uploadFile(file: File, supabase: SupabaseClient) {
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
function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ /g, "-") // Ganti spasi dengan strip
    .replace(/[^\w-]+/g, ""); // Hapus karakter aneh
}
// END HELPER

// --- GET ALL PRODUCTS ---
export async function getProducts(filter?: ProductFilter) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, categories!inner(name, slug)");

  if (filter?.categorySlug && filter.categorySlug !== "all") {
    query = query.eq("categories.slug", filter.categorySlug);
  }

  if (filter?.search) {
    query = query.ilike("name", `%${filter?.search}%`);
  }

  //Sorting
  switch (filter?.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    default:
      // Default: Newest (Terbaru)
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

export async function getProductBestSeller() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_best_seller", true)
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

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", slug) // 👈 Cari berdasarkan slug
    .single();

  if (error) return null;
  return data as Product;
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", categoryId) // 1. Filter Kategori Sama
    .neq("id", currentProductId) // 2. Jangan tampilkan produk yang sedang dibuka
    .limit(4); // 3. Batasi cuma 4 produk

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return data as Product[];
}
// END GET PRODUCTS

// --- CREATE PRODUCT (BULK) ---
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;

  let slug = createSlug(name);
  const { data: existingSlug } = await supabase
    .from("products")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existingSlug) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("category_id") as string;
  const isBestSeller = formData.get("is_best_seller") === "true";

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
        console.error("Skipped one file due to error", err);
      }
    }
  }

  const { error: dbError } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    category_id: categoryId,
    is_best_seller: isBestSeller,
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

// Create Product from Import CSV
export async function importProductsFromCSV(
  csvData: CSVProductData[],
  createMissingCategories: boolean = false // Parameter baru
) {
  const supabase = await createClient();

  // 1. Ambil Kategori Existing
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  // Map Name (lowercase) -> ID
  // Gunakan let agar bisa kita update nanti jika ada kategori baru
  const categoryMap = new Map(
    categories?.map((c) => [c.name.toLowerCase().trim(), c.id])
  );

  // 2. Scan CSV untuk cari kategori yang BELUM ADA di database
  const missingCategories = new Set<string>();

  for (const row of csvData) {
    if (row.category) {
      const catNameRaw = row.category.trim();
      const catNameLower = catNameRaw.toLowerCase();

      if (!categoryMap.has(catNameLower)) {
        // Simpan nama aslinya (Capital case) untuk di-insert nanti
        missingCategories.add(catNameRaw);
      }
    }
  }

  // 3. LOGIKA KONFIRMASI
  // Jika ada kategori hilang DAN user belum memberi izin buat baru
  if (missingCategories.size > 0 && !createMissingCategories) {
    return {
      success: false,
      requiresConfirmation: true, // Flag khusus
      missingCategories: Array.from(missingCategories), // Kirim list kategori yg hilang ke frontend
    };
  }

  // 4. BUAT KATEGORI BARU (Jika user setuju)
  if (missingCategories.size > 0 && createMissingCategories) {
    const newCatsToInsert = Array.from(missingCategories).map((name) => ({
      name: name,
      slug: createSlug(name), // Generate slug simpel
    }));

    const { data: createdCats, error: catError } = await supabase
      .from("categories")
      .insert(newCatsToInsert)
      .select();

    if (catError) {
      return {
        success: false,
        message: "Gagal membuat kategori baru: " + catError.message,
      };
    }

    // Update Map kita dengan kategori yang baru saja dibuat
    createdCats?.forEach((c) => {
      categoryMap.set(c.name.toLowerCase().trim(), c.id);
    });
  }

  // 5. INSERT PRODUK (Logika lama, tapi sekarang categoryMap sudah lengkap)
  const productsToInsert = [];
  const errors = [];

  for (const [index, row] of csvData.entries()) {
    if (!row.name) {
      errors.push(`Baris ${index + 1}: Nama produk kosong.`);
      continue;
    }

    let slug = createSlug(row.name);
    slug = `${slug}-${Math.floor(Math.random() * 10000)}`;

    const catName = row.category?.toLowerCase().trim();
    const categoryId = categoryMap.get(catName);

    if (!categoryId) {
      // Seharusnya tidak masuk sini jika logika di atas benar
      errors.push(`Baris ${index + 1}: Kategori "${row.category}" error.`);
      continue;
    }

    productsToInsert.push({
      name: row.name,
      slug: slug,
      description: row.description || "",
      price: Number(row.price) || 0,
      category_id: categoryId,
      is_best_seller: String(row.is_best_seller).toLowerCase() === "true",
      images: [],
    });
  }

  if (productsToInsert.length > 0) {
    const { error } = await supabase.from("products").insert(productsToInsert);
    if (error) {
      return {
        success: false,
        message: "Gagal simpan produk: " + error.message,
      };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/product");

  return {
    success: true,
    count: productsToInsert.length,
    errors: errors,
  };
}

// --- UPDATE PRODUCT (BULK + EXISTING) ---
export async function updateProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = createSlug(name);
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("category_id") as string;
  const isBestSeller = formData.get("is_best_seller") === "true";

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
      slug,
      description,
      price,
      category_id: categoryId,
      images: finalImages,
      is_best_seller: isBestSeller,
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
// --- DELETE PRODUCT ---
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
