import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { jadwalService } from "../../services";
import { Card, Button, LoadingSpinner, Badge } from "../../components/common";

const ManageJadwal = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date) => {
    setSlotsLoading(true);
    try {
      const response = await jadwalService.getSlots(date);
      setSlots(response.data || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBlockSlot = async (slotId) => {
    try {
      await jadwalService.blockSlot(slotId);
      toast.success("Slot berhasil diblokir");
      fetchSlots(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memblokir slot");
    }
  };

  const handleUnblockSlot = async (slotId) => {
    try {
      await jadwalService.unblockSlot(slotId);
      toast.success("Slot berhasil dibuka");
      fetchSlots(selectedDate);
    } catch (error) {
      toast.error("Gagal membuka slot");
    }
  };

  const handleSetHoliday = async (date) => {
    if (!date) {
      toast.error("Pilih tanggal terlebih dahulu");
      return;
    }
    try {
      await jadwalService.setHoliday(date);
      toast.success("Tanggal ditandai sebagai libur");
      fetchSlots(date);
    } catch (error) {
      toast.error("Gagal menandai libur");
    }
  };

  const handleCancelHoliday = async (date) => {
    if (!date) {
      toast.error("Pilih tanggal terlebih dahulu");
      return;
    }
    try {
      await jadwalService.cancelHoliday(date);
      toast.success("Libur dibatalkan untuk tanggal ini");
      fetchSlots(date);
    } catch (error) {
      toast.error("Gagal membatalkan libur");
    }
  };

  const handleGenerateSlots = async () => {
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    setGenerating(true);
    try {
      await jadwalService.generateSlots({ startDate, endDate });
      toast.success("Slot jadwal berhasil di-generate untuk 30 hari ke depan");
      if (selectedDate) {
        fetchSlots(selectedDate);
      }
    } catch (error) {
      toast.error("Gagal generate slot jadwal");
    } finally {
      setGenerating(false);
    }
  };

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const getTodayDateStr = () => new Date().toISOString().split("T")[0];

  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const todayStr = getTodayDateStr();
    return dateStr < todayStr;
  };

  const isPastSlot = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const date = new Date(`${dateStr}T${timeStr}`);
    return !Number.isNaN(date.getTime()) && date < new Date();
  };

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, date: null });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i,
      ).padStart(2, "0")}`;
      const isToday = dateStr === new Date().toISOString().split("T")[0];
      days.push({
        day: i,
        date: dateStr,
        isToday,
        isSelected: selectedDate === dateStr,
      });
    }
    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const monthYear = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const isSelectedHoliday =
    selectedDate &&
    slots.length > 0 &&
    slots.every((slot) => slot.status === "libur");

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Jadwal</h1>
          <p className="text-slate-500">Atur jadwal praktik fisioterapis</p>
        </div>
        <Button
          onClick={handleGenerateSlots}
          loading={generating}
          leftIcon={RefreshCw}
        >
          Generate Slot 30 Hari
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-500" />
              Kelola Slot Harian
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="font-medium text-slate-700 min-w-36 text-center">
                {monthYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-slate-500">Tanggal terpilih</p>
              <p className="text-sm font-medium text-slate-800">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Belum dipilih"}
              </p>
            </div>
            <Button
              variant={isSelectedHoliday ? "primary" : "secondary"}
              size="sm"
              onClick={() =>
                isSelectedHoliday
                  ? handleCancelHoliday(selectedDate)
                  : handleSetHoliday(selectedDate)
              }
              disabled={!selectedDate}
              className="text-xs px-2.5 py-1 leading-tight"
            >
              {isSelectedHoliday
                ? "Batalkan Libur Tanggal Ini"
                : "Tandai Libur Tanggal Ini"}
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-medium text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((item, index) => (
              <button
                key={index}
                disabled={!item.day}
                onClick={() => item.date && setSelectedDate(item.date)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${!item.day ? "invisible" : ""}
                  ${item.date && isPastDate(item.date) && !item.isSelected ? "text-slate-300" : ""}
                  ${item.isSelected ? "bg-sky-500 text-white" : ""}
                  ${
                    item.isToday && !item.isSelected
                      ? "ring-2 ring-sky-500"
                      : ""
                  }
                  ${item.day && !item.isSelected ? "hover:bg-slate-100" : ""}
                `}
              >
                {item.day}
              </button>
            ))}
          </div>
        </Card>

        {/* Slots for Selected Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Slot Waktu
                {selectedDate
                  ? ` - ${new Date(selectedDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : ""}
              </h3>
              <Button
                variant={isSelectedHoliday ? "primary" : "secondary"}
                size="sm"
                onClick={() =>
                  isSelectedHoliday
                    ? handleCancelHoliday(selectedDate)
                    : handleSetHoliday(selectedDate)
                }
                disabled={!selectedDate}
                className="text-xs px-2.5 py-1 leading-tight"
              >
                {isSelectedHoliday
                  ? "Batalkan Libur Tanggal Ini"
                  : "Tandai Libur Tanggal Ini"}
              </Button>
            </div>

            {!selectedDate ? (
              <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-slate-300" />
                <p>Pilih tanggal untuk melihat slot</p>
              </div>
            ) : slotsLoading ? (
              <div className="py-8">
                <LoadingSpinner />
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {slots.map((slot) => {
                  const pastSlot =
                    isPastDate(selectedDate) ||
                    isPastSlot(selectedDate, formatTime(slot.waktu_mulai));
                  const statusLabel =
                    slot.status === "tersedia"
                      ? "Tersedia"
                      : slot.status === "dipesan"
                        ? "Terpesan"
                        : slot.status === "diblock_admin"
                          ? "Diblokir"
                          : "Libur";
                  const statusClass =
                    slot.status === "tersedia"
                      ? "bg-emerald-100 text-emerald-700"
                      : slot.status === "dipesan"
                        ? "bg-sky-100 text-sky-700"
                        : slot.status === "diblock_admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600";

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 sm:p-4 rounded-lg text-center border min-h-26 ${
                        slot.status === "tersedia"
                          ? "border-emerald-200"
                          : slot.status === "dipesan"
                            ? "border-sky-200"
                            : slot.status === "diblock_admin"
                              ? "border-red-200"
                              : "border-slate-200"
                      } ${pastSlot ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-lg sm:text-xl">
                          {formatTime(slot.waktu_mulai)}
                        </span>
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusClass}`}
                        >
                          {statusLabel}
                        </div>
                        {slot.status === "tersedia" && (
                          <button
                            onClick={() => handleBlockSlot(slot.id)}
                            className="inline-flex items-center justify-center gap-1 text-sm sm:text-base text-red-600 hover:bg-red-100 rounded-md px-3.5 py-1.5"
                          >
                            <Lock className="w-3 h-3" />
                            Blokir
                          </button>
                        )}
                        {slot.status === "diblock_admin" && (
                          <button
                            onClick={() => handleUnblockSlot(slot.id)}
                            className="inline-flex items-center justify-center gap-1 text-sm sm:text-base text-emerald-600 hover:bg-emerald-100 rounded-md px-3.5 py-1.5"
                          >
                            <Unlock className="w-3 h-3" />
                            Buka
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-slate-300" />
                <p>Belum ada slot untuk tanggal ini</p>
                <Button size="sm" onClick={handleGenerateSlots}>
                  Generate Slot
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageJadwal;
