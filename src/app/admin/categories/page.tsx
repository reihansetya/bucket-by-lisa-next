import { getCategories } from "@/actions/categories";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  // Fetch data di server agar cepat & SEO friendly
  const categories = await getCategories();

  return (
    <div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
