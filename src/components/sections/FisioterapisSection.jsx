import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";

const FisioterapisSection = () => {
  return (
    <section
      id="fisioterapis"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Fisioterapis <span className="text-sky-500">Kami</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Ditangani langsung oleh fisioterapis profesional dan berpengalaman
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-linear-to-br from-sky-400 to-indigo-500 p-6 flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-white">AW</span>
              </div>
              <div className="text-white">
                <h3 className="text-lg font-bold">
                  Abbad Al Wafi, S.Ft., M.Fis
                </h3>
                <p className="text-sky-100 text-sm">
                  Fisioterapis Bersertifikat
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-amber-300 fill-amber-300"
                    />
                  ))}
                  <span className="text-sky-100 ml-1 text-xs">4.9</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-slate-600 text-sm">
                Fisioterapis profesional dengan spesialisasi penanganan gangguan
                muskuloskeletal, rehabilitasi pasca stroke, dan terapi geriatri.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2 py-1 bg-sky-50 text-sky-600 text-xs font-medium rounded-full">
                  STR Aktif
                </span>
                <span className="px-2 py-1 bg-sky-50 text-sky-600 text-xs font-medium rounded-full">
                  5+ Tahun
                </span>
                <span className="px-2 py-1 bg-sky-50 text-sky-600 text-xs font-medium rounded-full">
                  Manual Therapy
                </span>
              </div>
            </div>
          </motion.div>

          {/* Jadwal Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              Jadwal Praktik
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
                <span className="font-medium text-slate-700">
                  Senin - Kamis
                </span>
                <span className="text-sky-600 font-medium">18:00 - 22:00</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg text-sm">
                <span className="font-medium text-slate-700">
                  Jumat - Sabtu
                </span>
                <span className="text-emerald-600 font-medium">
                  08:00 - 22:00
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
                <span className="font-medium text-slate-700">Minggu</span>
                <span className="text-sky-600 font-medium">18:00 - 22:00</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              * Jadwal dapat berubah. Silakan booking untuk memastikan
              ketersediaan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FisioterapisSection;
