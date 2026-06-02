import { motion } from "framer-motion";
import {
  Clock,
  Edit2,
  FileText,
  Layers,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const LayananCard = ({ item, onEdit, onToggle, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.22 }}
    className={`group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
      !item.is_active ? "opacity-55" : ""
    }`}
  >
    <div
      className={`h-1 w-full ${
        item.is_active
          ? "bg-linear-to-r from-sky-400 to-sky-500"
          : "bg-slate-200"
      }`}
    />

    <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {item.gambar_url ? (
            <img
              src={item.gambar_url}
              alt={item.nama}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center ring-2 ring-sky-100">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug truncate">
            {item.nama}
          </h3>
          {item.kategori && (
            <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              <Layers className="w-3 h-3" />
              {item.kategori}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            item.is_active
              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
              : "text-slate-400 bg-slate-50 border-slate-100"
          }`}
        >
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
        {item.deskripsi || "Tidak ada deskripsi"}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold text-sky-600 tracking-tight">
          {formatPrice(item.harga)}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          {item.durasi} mnt
        </span>
      </div>
    </div>

    <div className="flex items-center divide-x divide-slate-100 border-t border-slate-100">
      <button
        onClick={() => onToggle(item)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
      >
        {item.is_active ? (
          <ToggleRight className="w-4 h-4 text-emerald-500" />
        ) : (
          <ToggleLeft className="w-4 h-4" />
        )}
        {item.is_active ? "Nonaktifkan" : "Aktifkan"}
      </button>

      <button
        onClick={() => onEdit(item)}
        className="px-4 py-2.5 text-sky-600 hover:bg-sky-50 transition-colors"
        aria-label="Edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDelete(item)}
        className="px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default LayananCard;
