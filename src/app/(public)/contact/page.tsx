import { MapPin, MessageCircle, ShoppingBag } from "lucide-react";
import { ShopeeIcon, TokopediaIcon, TiktokIcon } from "@/components/BrandIcons";
import Link from "next/link";

export const metadata = {
  title: "Hubungi Kami | Bucket by Lisa",
  description:
    "Hubungi Bucket by Lisa via WhatsApp atau kunjungi toko kami di Shopee, Tokopedia, dan TikTok Shop.",
};

const marketplaces = [
  {
    name: "Shopee",
    handle: "@bucketbylisa.id",
    href: "https://shopee.co.id/bucketbylisa.id",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
        <ShopeeIcon className="w-7 h-7 text-orange-500" />
      </div>
    ),
  },
  {
    name: "Tokopedia",
    handle: "Bucket by Lisa",
    href: "https://www.tokopedia.com/bucketbylisa",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
        <TokopediaIcon className="w-7 h-7 text-green-600" />
      </div>
    ),
  },
  {
    name: "TikTok Shop",
    handle: "@bucketbylisa",
    href: "https://www.tiktok.com/@bucketbylisa",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
        <TiktokIcon className="w-6 h-6 text-white" />
      </div>
    ),
  },
  {
    name: "Instagram",
    handle: "@bucketbylisa",
    badge: "DM for Custom",
    badgeColor: "bg-pink-100 text-pink-600",
    href: "https://www.instagram.com/bucketbylisa",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
        {/* Instagram icon via lucide */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-white"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </div>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HERO SECTION */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Hubungi Kami 🌸
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-8 text-sm md:text-base">
            Pilih cara paling nyaman untuk memesan hadiah spesialmu. Kami siap
            membantu mewujudkan kreasi floral impianmu.
          </p>

          {/* WhatsApp CTA */}
          <Link
            href="https://wa.me/6285156893702"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all"
          >
            <MessageCircle size={20} />
            Hubungi via WhatsApp
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* MARKETPLACE SECTION */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Kunjungi Marketplace Kami
            </h2>
          </div>

          {/* Mobile: stacked cards | Desktop: 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketplaces.map((mp) => (
              <Link
                key={mp.name}
                href={mp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-100 p-5 flex flex-row lg:flex-col items-center lg:items-start gap-4 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                {/* Icon */}
                <div className="flex-shrink-0">{mp.icon}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm md:text-base">
                    {mp.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{mp.handle}</p>
                </div>

                {/* Badge */}
                <span
                  className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${mp.badgeColor}`}
                >
                  {mp.badgeDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {mp.badge}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* LOCATION SECTION */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Text info */}
              <div className="p-8 lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Lokasi Workshop
                  </h2>
                </div>

                <p className="text-gray-700 font-semibold text-base mb-1">
                  Tangerang Selatan &amp; Ciledug
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  (Hanya melayani pengiriman online dan pick-up dengan janji
                  temu)
                </p>

                <Link
                  href="https://maps.app.goo.gl/rbdyem9ZD8j9jVHb7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all w-fit text-sm"
                >
                  <MapPin size={16} />
                  Dapatkan Arah
                </Link>
              </div>

              {/* Right: Google Maps iframe */}
              <div className="lg:w-3/5 min-h-[320px] lg:min-h-[360px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9863279090673!2d106.72846067531209!3d-6.265527793723112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f11f9d8572db%3A0x163a02b345fa808e!2sBucket%20by%20Lisa!5e0!3m2!1sid!2sid!4v1778814066819!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "320px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Workshop Bucket by Lisa"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
