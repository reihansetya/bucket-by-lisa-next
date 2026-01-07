export interface Product {
  id: string; // UUID dari Supabase
  description: string;
  price: number;
  category: string;
  img: string[]; // Array nama file gambar
  is_best_seller: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
