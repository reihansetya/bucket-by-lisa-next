"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { importProductsFromCSV } from "@/actions/products";
import { Download, Upload, Loader2, FileSpreadsheet } from "lucide-react";

export default function ProductImportExport() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle Download Template
  const handleDownloadTemplate = () => {
    // Header CSV
    const csvContent =
      "name,description,price,category,is_best_seller\n" +
      "Contoh Buket Mawar,Buket indah untuk wisuda,150000,Wisuda,TRUE\n" +
      "Contoh Buket Uang,Buket Uang 10K 5 lembar,130000,Uang,FALSE";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "template_import_produk.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Handle Upload & Parse
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const csvData = results.data as any;
          // Percobaan Pertama: createMissingCategories = FALSE
          let response = await importProductsFromCSV(csvData, false);

          // Cek apakah butuh konfirmasi
          if (response.requiresConfirmation) {
            const missingList = response.missingCategories.join(", ");

            const confirmCreate = window.confirm(
              `Kategori berikut tidak ditemukan di sistem:\n\n` +
                `👉 ${missingList}\n\n` +
                `Klik OK untuk membuat kategori ini secara OTOMATIS dan melanjutkan import.\n` +
                `Klik Cancel untuk membatalkan proses import.`
            );

            if (confirmCreate) {
              // Percobaan Kedua: User setuju, kirim TRUE

              response = await importProductsFromCSV(csvData, true);
            } else {
              alert("Proses import dibatalkan.");
              setIsLoading(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
              return;
            }
          }

          // Handle Response Akhir (Sukses/Gagal setelah konfirmasi)
          if (response.success) {
            let msg = `✅ Berhasil import ${response.count} produk!`;
            if (response.errors && response.errors.length > 0) {
              msg +=
                `\n\n⚠️ Namun ada ${response.errors.length} baris dilewati:\n` +
                response.errors.join("\n");
            }
            alert(msg);
            window.location.reload();
          } else {
            alert("❌ Gagal: " + response.message);
          }
        } catch (error) {
          console.error(error);
          alert("Terjadi kesalahan sistem.");
        } finally {
          setIsLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        setIsLoading(false);
        alert("Gagal membaca CSV: " + error.message);
      },
    });
  };

  return (
    <div className="flex gap-2">
      {/* Tombol Download Template */}
      <button
        onClick={handleDownloadTemplate}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        title="Download Template CSV"
      >
        <FileSpreadsheet size={18} />
        Template
      </button>

      {/* Input File Hidden + Tombol Trigger */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Upload size={18} />
        )}
        Import CSV
      </button>
    </div>
  );
}
