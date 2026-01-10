import { getProductById } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import EditProductForm from "./EditProductForm";
import { notFound } from "next/navigation";

// 1. Ubah tipe props menjadi Promise
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 2. Await params terlebih dahulu
  const { id } = await params;

  // 3. Gunakan variable 'id' yang sudah di-await
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} categories={categories} />;
}
