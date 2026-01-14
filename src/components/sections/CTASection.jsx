import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = ({ isAuthenticated }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Siap Memulai Perjalanan Pemulihan Anda?
          </h2>
          <p className="text-lg text-sky-100 mb-8 max-w-xl mx-auto">
            {isAuthenticated
              ? "Buat booking sekarang dan dapatkan penanganan fisioterapi terbaik di rumah Anda"
              : "Daftar sekarang dan dapatkan konsultasi dengan fisioterapis kami"}
          </p>
          {isAuthenticated ? (
            <Link
              to="/bookings/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Buat Booking
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Daftar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
