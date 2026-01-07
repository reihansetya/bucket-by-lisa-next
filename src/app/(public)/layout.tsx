// src/app/(public)/layout.tsx
import Navbar from "@/components/Navbar"; // Pastikan path import sesuai

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* pt-20 ditambahkan agar konten tidak tertutup Navbar fixed */}
        {children}
      </main>
    </>
  );
}
