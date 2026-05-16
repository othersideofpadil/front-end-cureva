import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = ({ isAuthenticated }) => {
  return (
    <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Fisioterapi <span className="text-primary">Profesional</span> di
              Rumah Anda
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Cureva adalah platform layanan homecare fisioterapi bersama{" "}
              <strong className="text-primary font-semibold">
                Abbad Al Wafi, Amd. Kes, CDNP.
              </strong>{" "}
              seorang fisioterapis yang berpengalaman dan tersertifikasi.
              Nikmati perawatan berkualitas langsung di rumah Anda.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  to="/bookings/new"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-xl transition-all"
                >
                  Buat Booking Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-xl transition-all"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                Lihat Layanan
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center gap-6 sm:gap-8">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  100+
                </p>
                <p className="text-slate-500 text-sm">Pasien Puas</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  3+
                </p>
                <p className="text-slate-500 text-sm">Tahun Pengalaman</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  4.9
                </p>
                <p className="text-slate-500 text-sm">Rating</p>
              </div>
            </div>
          </motion.div>

          {/* ── Image column ── */}
          {/* Sebelumnya hidden di bawah lg; sekarang tampil di semua ukuran */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
                alt="Fisioterapi"
                className="w-full h-auto rounded-3xl shadow-2xl
                           max-h-60 object-cover
                           sm:max-h-80
                           lg:max-h-none lg:object-fill"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
