import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import BookingCard from "./BookingCard";

const RecentBookings = ({
  bookings,
  pendingCount,
  onDetail,
  onQuickConfirm,
  onQuickReject,
  actionLoading,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-slate-800">
          Pemesanan Terbaru
        </h2>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {pendingCount} menunggu konfirmasi
          </span>
        )}
      </div>
      <a
        href="/admin/bookings"
        className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
      >
        Lihat Semua
        <ChevronRight className="w-3.5 h-3.5" />
      </a>
    </div>

    {bookings.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
          <Calendar className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-sm font-medium">Belum ada pemesanan</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence>
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <BookingCard
                booking={booking}
                onDetail={onDetail}
                onQuickConfirm={onQuickConfirm}
                onQuickReject={onQuickReject}
                actionLoading={actionLoading}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

export default RecentBookings;
