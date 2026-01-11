"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Footer from "@/components/Footer";
import { Menu } from "lucide-react";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* HEADER MOBILE (Hanya muncul di layar kecil) */}
      <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <span className="text-lg font-bold text-primary">Bucket by Lisa</span>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* SIDEBAR COMPONENT */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* KONTEN KANAN */}
      <div className="flex-1 flex flex-col relative min-h-screen">
        {/* MAIN CONTENT */}
        {/* lg:pb-24 -> Padding bawah besar HANYA di desktop (supaya tidak ketutup footer fixed) */}
        {/* Di mobile padding bawah standar saja */}
        <main className="flex-1 p-4 lg:p-8 w-full lg:pb-24">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* FOOTER WRAPPER */}
        {/* Default (Mobile): Static (biasa) */}
        {/* lg (Desktop): Fixed di bawah */}
        <div className="w-full bg-gray-50 lg:fixed lg:bottom-0 lg:right-0 lg:pl-64 lg:z-10 transition-all duration-300">
          {/* lg:pl-64 disesuaikan dengan lebar Sidebar Anda agar tidak tertutup */}
          <Footer isAdmin={true} />
        </div>
      </div>
    </div>
  );
}
