import {
  MapPin,
  Camera,
  Sparkles,
  MessageSquare,
  Truck,
  Clock,
} from "lucide-react";
export default function InfoSection() {
  const terms = [
    {
      icon: <Camera className="text-primary" size={24} />,
      title: "Kemiripan Produk",
      text: "Foto katalog adalah contoh. Kemiripan hingga 90% karena faktor cahaya dan ketersediaan warna kertas pembungkus (wrap).",
    },
    {
      icon: <Sparkles className="text-primary" size={24} />,
      title: "Kualitas Terjamin",
      text: "Kami selalu memberikan yang terbaik dan memaksimalkan kemampuan tim florist kami dalam merangkai setiap pesanan.",
    },
    {
      icon: <MessageSquare className="text-primary" size={20} />,
      title: "Custom Order",
      text: "Request buket sesuai keinginan & budget Anda melalui WA.",
    },
  ];

  const services = [
    {
      icon: <MapPin className="text-white" size={20} />,
      title: "Self Pick-up",
      text: "Ambil sendiri pesanan ke workshop kami (Konfirmasi via WA).",
    },
    {
      icon: <Truck className="text-white" size={24} />,
      title: "Info Pengiriman",
      text: "Menggunakan kurir Instant/Sameday. Harap stand by HP untuk memudahkan komunikasi kurir saat pengantaran.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* PROMO & SERVICE CARD */}
          <div className="w-full lg:w-1/3 bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20">
            <h2 className="text-2xl font-bold mb-6">Pickup / Pengiriman</h2>
            <div className="space-y-8">
              {services.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl h-fit">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Chat Admin Sekarang
            </button>
          </div>

          {/* TERMS & CONDITIONS GRID */}
          <div className="w-full lg:w-2/3 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Ketentuan Pemesanan
              </h2>
              <span className="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Syarat & Ketentuan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {terms.map((item, index) => (
                <div key={index} className="group">
                  <div className="mb-4 p-3 bg-primary/5 rounded-2xl w-fit transition-all duration-300">
                    <div className=" transition-colors">{item.icon}</div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
