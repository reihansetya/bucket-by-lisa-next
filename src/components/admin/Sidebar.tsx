"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Package, LogOut, X, Tags } from "lucide-react"; // 1. Import Icon Tags

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/login");
  };

  // 2. Tambahkan menu 'Kategori' disini
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Kategori", href: "/admin/categories", icon: Tags },
  ];

  return (
    <>
      {/* OVERLAY / BACKDROP (Mobile Only) */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:h-auto lg:flex-shrink-0
      `}
      >
        {/* HEADER SIDEBAR */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          {/* Sesuaikan Judul dengan screenshot Anda 'Bubub Page' atau 'Admin Panel' */}
          <span className="text-xl font-bold text-primary">Bubub Page</span>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Logic agar submenu aktif jika URL diawali href menu (misal: /admin/products/add tetap aktifkan menu Produk)
            // Kecuali Dashboard (/admin) yang harus exact match agar tidak selalu menyala
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </div>
    </>
  );
}
