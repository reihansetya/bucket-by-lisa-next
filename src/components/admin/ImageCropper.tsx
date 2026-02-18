"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check, RotateCcw } from "lucide-react";

interface ImageCropperProps {
  /** URL gambar yang akan di-crop (biasanya dari URL.createObjectURL) */
  imageSrc: string;
  /** Callback saat user selesai crop, mengembalikan File hasil crop */
  onCropComplete: (croppedFile: File) => void;
  /** Callback saat user menutup/cancel modal */
  onCancel: () => void;
  /** Nama file asli (untuk penamaan file output) */
  originalFileName?: string;
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  originalFileName = "cropped-image.jpg",
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  // State crop - default crop area
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset crop ke default
  const handleReset = () => {
    setCrop({
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });
  };

  // Generate canvas dari crop lalu convert ke File
  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // Hitung scale ratio antara natural size dan displayed size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size ke ukuran crop area (dalam pixel asli)
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Draw bagian yang di-crop ke canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas ke Blob lalu ke File
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], originalFileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          onCropComplete(file);
        }
        setIsProcessing(false);
      },
      "image/jpeg",
      0.92 // Quality 92%
    );
  }, [completedCrop, onCropComplete, originalFileName]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Crop Gambar</h3>
            <p className="text-xs text-gray-500">
              Seret area untuk memilih bagian yang penting
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              style={{ maxHeight: "60vh", maxWidth: "100%" }}
              onLoad={() => {
                // Set default crop saat gambar loaded
                setCrop({
                  unit: "%",
                  x: 10,
                  y: 10,
                  width: 80,
                  height: 80,
                });
              }}
            />
          </ReactCrop>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={generateCroppedImage}
              disabled={isProcessing || !completedCrop}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
            >
              <Check size={14} />
              {isProcessing ? "Memproses..." : "Crop & Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
