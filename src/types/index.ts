export interface Product {
  id: string; // UUID dari Supabase
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[]; // Array nama file gambar
  is_best_seller: boolean;
  created_at?: string;
  category_id: string;
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
