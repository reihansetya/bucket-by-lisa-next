"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images }: { images: string[] }) {
  // State untuk gambar yang sedang dipilih (Default: gambar pertama)
  const [selectedImage, setSelectedImage] = useState(
    images && images.length > 0 ? images[0] : "/images/heroImg.jpg"
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* 1. GAMBAR UTAMA (BESAR) */}
      <div className="relative w-full md:flex-1 h-[62.5vh] md:h-[75vh] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
        <Image
          src={selectedImage}
          alt="Product Image"
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="md:object-contain object-cover transition-all duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {/* 2. THUMBNAILS (KECIL) */}
      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-col md:pb-0 md:w-24 md:h-[70vh] md:overflow-y-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === img
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
