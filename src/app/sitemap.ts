import { MetadataRoute } from "next";
import { getProducts } from "@/actions/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bucketbylisa.vercel.app";

  // 1. Ambil semua produk untuk generate URL dinamis
  const products = await getProducts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.created_at || new Date()), // Sesuaikan field tanggal
  }));

  // 2. Return URL statis + URL dinamis
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/product`,
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}
