import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Check, X, FileText, MapPin } from "lucide-react";
import {
  STATUS_META,
  formatDate,
  formatTime,
  accentBar,
  statusBadgeClass,
} from "../../../../utils/constants/index.js";

const BookingCard = ({
  booking,
  onDetail,
  onQuickConfirm,
  onQuickReject,
  actionLoading,
}) => {
  const isWaiting = booking.status === "menunggu_konfirmasi";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className={`h-1 w-full ${accentBar(booking.status)}`} />

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              {booking.kode_booking}
            </span>
            <p className="font-bold text-slate-800 text-sm sm:text-base leading-snug truncate mt-0.5">
              {booking.nama_pasien}
            </p>
          </div>
          <span className={statusBadgeClass(booking.status)}>
            {STATUS_META[booking.status]?.label || booking.status}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileText className="w-3.5 h-3.5 shrink-0 text-slate-300" />
          <span className="truncate">{booking.nama_layanan}</span>
        </div>

        <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <span className="truncate">{formatDate(booking.tanggal)}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(booking.waktu)} WIB</span>
          </div>
        </div>

        {booking.alamat && (
          <div className="flex items-start gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-300" />
            <span className="line-clamp-1">{booking.alamat}</span>
          </div>
        )}
      </div>

      <div className="flex items-center divide-x divide-slate-100 border-t border-slate-100">
        <button
          onClick={() => onDetail(booking)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Detail
        </button>

        {isWaiting && (
          <>
            <button
              onClick={() => onQuickConfirm(booking)}
              disabled={actionLoading}
              className="px-4 py-2.5 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
              title="Konfirmasi"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onQuickReject(booking)}
              disabled={actionLoading}
              className="px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Tolak"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default BookingCard;
