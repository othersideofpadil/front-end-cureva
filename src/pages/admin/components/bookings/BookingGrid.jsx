import { AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import BookingCard from "./BookingCard";

const BookingGrid = ({
  bookings,
  search,
  statusFilter,
  onDetail,
  onQuickAction,
  onOpenStatus,
  onOpenDelete,
}) => {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium">
          {search || statusFilter !== "all"
            ? "Tidak ada booking yang sesuai filter"
            : "Belum ada booking"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onDetail={onDetail}
            onQuickAction={onQuickAction}
            onOpenStatus={onOpenStatus}
            onOpenDelete={onOpenDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BookingGrid;
