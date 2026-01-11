import React from "react";

interface IconProps {
  className?: string;
}

export function ShopeeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.1 8.8h-1.4c.1-3-2.1-5.3-4.9-5.3-2.9 0-5 2.5-4.9 5.3H6.5c-1 0-2.4.3-2.6 1.8l-.8 7.3c-.1 1.2.6 2.6 2.3 2.6h13.3c1.6 0 2.4-1.3 2.3-2.6l-.8-7.3c-.2-1.5-1.6-1.8-2.6-1.8zM9.8 8.8c0-1.8 1.4-3.3 3-3.3 1.7 0 3 1.6 3 3.3H9.8zm5.5 5.8c-1.3 1.1-2.2.8-2.2.8.6-.1.8-.6.5-1-.4-.6-1.5-.4-2 .2-.6.7.1 2.2 2 2.1 1.6-.1 2.9-1.5 2.7-2.7-.2-1-1.3-1.6-2.5-1.3-1 .2-1.7 1-1.6 1.9.1.7.9.6 1.1.5.3-.2.3-.6.6-.5.4.1.4.8.1 1-.3.2-.8 0-.9-.6-.2-1.1 1-1.8 1.9-1.5.6.2 1.1.9 1 1.6-.1.6-.4 1.1-.7 1.3z" />
    </svg>
  );
}

export function TokopediaIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.2 8.4c.5-2.7-.9-5.3-3.6-6-2.6-.6-5.2.7-6.2 3.2-1-2.4-3.6-3.8-6.1-3.2-2.7.6-4.2 3.3-3.6 6 .2.8.6 1.6 1.2 2.2l8.5 8.5 8.5-8.5c.6-.6 1-1.4 1.3-2.2zM12 17.6L5.1 10.7c-.8-.8-.8-2.1 0-2.9.8-.8 2.1-.8 2.9 0L12 11.8l4-4c.8-.8 2.1-.8 2.9 0 .8.8.8 2.1 0 2.9L12 17.6z" />
      {/* Note: Tokopedia logo aslinya Burung Hantu, tapi sering disimplifikasi jadi tas belanja hijau atau bentuk unik. 
           Ini path simplifikasi visual keranjang belanja/logo umum. 
           Jika ingin logo Burung Hantu spesifik, path-nya sangat kompleks. 
           Biasanya user cukup pakai inisial/warna hijau khas. */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"
        fill="none"
        opacity="0"
      />
      <path d="M17.85 8.16l-4.7-4.7c-.57-.57-1.48-.6-2.09-.08L4.62 9.24c-.45.38-.57 1.02-.29 1.53l4.63 8.24c.28.49.88.74 1.44.59l6.6-1.76c.56-.15.93-.7.89-1.28L17.85 8.16z" />
    </svg>
  );
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
