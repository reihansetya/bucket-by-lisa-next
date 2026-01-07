// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 mengharapkan fungsi bernama 'proxy'
export function proxy(request: NextRequest) {
  // Untuk sementara, kita izinkan semua request lewat (seperti 'next' di middleware)
  return NextResponse.next();
}

// Opsi: Anda juga bisa menentukan rute mana yang diproses oleh proxy ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua request kecuali file statis (image, favicon, dll)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
