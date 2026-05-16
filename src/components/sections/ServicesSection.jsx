import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "../common";

const ServicesSection = ({
  layanan,
  loading,
  isAuthenticated,
  formatPrice,
}) => {
  return (
    <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Layanan <span className="text-primary">Kami</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Berbagai layanan fisioterapi profesional untuk memenuhi kebutuhan
            kesehatan Anda
          </p>
        </motion.div>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : layanan.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {layanan
              .filter((l) => l.is_active)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all group overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-full h-40 bg-slate-100 overflow-hidden">
                    {item.gambar_url ? (
                      <img
                        src={item.gambar_url}
                        alt={item.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full items-center justify-center bg-slate-100"
                      style={{ display: item.gambar_url ? "none" : "flex" }}
                    >
                      <Heart className="w-8 h-8 text-slate-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {item.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">
                        {formatPrice(item.harga)}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {item.durasi} menit
                      </span>
                    </div>
                    {isAuthenticated && (
                      <Link
                        to={`/bookings/new?layanan=${item.id}`}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 text-primary font-medium rounded-lg hover:bg-sky-100 transition-colors text-sm"
                      >
                        Pesan Sekarang
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Belum ada layanan tersedia
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
