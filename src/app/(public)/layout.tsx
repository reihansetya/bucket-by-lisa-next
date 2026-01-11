// src/app/(public)/layout.tsx
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
        <Footer isAdmin={false} />
      </main>
    </>
  );
}
