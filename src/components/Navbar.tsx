// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            Bucket by Lisa
          </Link>

          {/* Menu Navigasi */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition"
            >
              Home
            </Link>
            <Link
              href="/product"
              className="text-gray-600 hover:text-primary transition"
            >
              Katalog
            </Link>
            <Link
              href="/promo"
              className="text-gray-600 hover:text-primary transition"
            >
              Promo
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-primary transition"
            >
              Kontak
            </Link>
          </div>

          {/* Admin Link */}
          {/* <Link
            href="/admin"
            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition"
          >
            Dashboard Admin
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
