"use client";

import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const router = useRouter();

  const [clickCount, setClickCount] = useState(0);

  const handleEasterEgg = () => {
    const newCount = clickCount + 1;
    console.log("newCount: ", newCount);

    setClickCount(newCount);

    if (clickCount == 2) {
      router.push("/admin");
      setClickCount(0);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* TEXT CONTENT */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            <span
              onClick={handleEasterEgg}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full"
            >
              Handmade with Love 🌸
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Abadikan Momen <br />
              Indahmu dengan <br />
              <span className="text-primary italic">Bucket by Lisa</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
              Kado terbaik untuk wisuda, ulang tahun, dan perayaan spesial
              lainnya. Bisa kustom sesuai budget dan keinginanmu.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/product"
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all text-center"
              >
                Lihat Katalog Produk
              </Link>
              <Link
                href="https://wa.me/6285156893702"
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:border-primary hover:text-primary transition-all text-center"
              >
                Order / Tanya via WA
              </Link>
            </div>

            {/* QUICK FEATURES (Mobile Friendly Icons) */}
            <div className="md:mt-6 mt-14 grid grid-cols-2 gap-x-4 gap-y-8 text-left border-t border-gray-50 pt-8">
              {/* Item 1: COD */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                  💵
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-relaxed">
                  COD Di Daerah Tangsel dan Ciledug
                </p>
              </div>

              {/* Item 2: Delivery */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                  🚚
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-relaxed">
                  Sameday Service
                </p>
              </div>

              {/* Item 3: Time */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                  ⏰
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-relaxed">
                  Pengerjaan 1 hari jadi
                </p>
              </div>

              {/* Item 4: Custom */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600 flex-shrink-0">
                  💐
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-relaxed">
                  Custom Bouquet Sesuai Keinginan
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="hidden md:block w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/images/heroImg.jpg"
                alt="Beautiful Bouquet"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
