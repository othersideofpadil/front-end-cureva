import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calendar, CalendarOff, Plus } from "lucide-react";
import { Card, Button, LoadingSpinner } from "../../../../components/common";
import SlotCard from "./SlotCard";
import SlotSummary from "./SlotSummary";

const SlotsPanel = ({
  selectedDate,
  selectedDateFormatted,
  isSelectedHoliday,
  slots,
  slotsLoading,
  onToggleHoliday,
  onOpenCreate,
  onBlock,
  onUnblock,
  onEdit,
  onDelete,
  isPastDate,
  isPastSlot,
  formatTime,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
  >
    <Card className="min-h-90 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Slot Waktu</h3>
          {selectedDate && (
            <p className="text-xs text-slate-500 mt-0.5 capitalize">
              {selectedDateFormatted}
            </p>
          )}
        </div>
        {selectedDate && (
          <button
            onClick={onToggleHoliday}
            className={[
              "self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border",
              isSelectedHoliday
                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
            ].join(" ")}
          >
            <CalendarOff className="w-3.5 h-3.5" />
            {isSelectedHoliday ? "Batalkan Libur" : "Tandai Libur"}
          </button>
        )}
      </div>

      {!selectedDate ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm">Pilih tanggal untuk melihat slot</p>
        </div>
      ) : slotsLoading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : slots.length > 0 ? (
        <>
          <SlotSummary slots={slots} />
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {slots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  pastSlot={
                    isPastDate(selectedDate) ||
                    isPastSlot(selectedDate, formatTime(slot.waktu_mulai))
                  }
                  onBlock={onBlock}
                  onUnblock={onUnblock}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-slate-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Belum ada slot</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Belum ada slot untuk tanggal ini
            </p>
          </div>
          <Button size="sm" onClick={onOpenCreate} leftIcon={Plus}>
            Tambah Slot
          </Button>
        </div>
      )}
    </Card>
  </motion.div>
);

export default SlotsPanel;
