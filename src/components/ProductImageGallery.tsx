"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const selectedImage =
    images && images.length > 0 ? images[currentIndex] : "/images/heroImg.jpg";

  const totalImages = images?.length || 0;

  // Navigasi Prev
  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages]);

  // Navigasi Next
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 50; // Minimum swipe distance (px)

    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
    touchDeltaX.current = 0;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* 1. GAMBAR UTAMA DENGAN SLIDER */}
      <div
        ref={sliderRef}
        className="relative w-full md:flex-1 h-[62.5vh] md:h-[75vh] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gambar dengan transisi */}
        <Image
          key={currentIndex}
          src={selectedImage}
          alt={`Product Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="md:object-contain object-cover transition-opacity duration-500 animate-fade-in"
          priority
        />

        {/* Prev/Next Buttons (muncul saat hover, selalu visible di mobile) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              aria-label="Gambar selanjutnya"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {totalImages > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
            {currentIndex + 1} / {totalImages}
          </div>
        )}

        {/* Dot Indicators */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 h-2 bg-white shadow-md"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Lihat gambar ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. THUMBNAILS (KECIL) */}
      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-col md:pb-0 md:w-24 md:h-[70vh] md:overflow-y-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === index
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
