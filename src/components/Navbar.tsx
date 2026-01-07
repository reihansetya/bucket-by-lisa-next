"use client"; // Wajib karena ada interaksi onClick dan useState

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react"; // Icon untuk mobile

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Produk", href: "/product" },
    { name: "Promo", href: "/promo" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary tracking-tight">
              Bucket by <span className="text-black">Lisa</span>
            </span>
          </Link>

          {/* DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE: Admin & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* MOBILE TOGGLE BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)} // Tutup menu setelah klik
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
