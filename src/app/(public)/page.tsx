// src/app/page.tsx
import { getProducts } from "@/actions/products";

export default async function HomePage() {
  const products = await getProducts();

  console.log("Product: ", products);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-primary">Katalog Bouquet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-primary font-bold">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
