"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
