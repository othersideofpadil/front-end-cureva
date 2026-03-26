import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { jadwalService } from "../../services";
import { Card, Button, LoadingSpinner, Badge } from "../../components/common";

const HARI_NAMES = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

const ManageJadwal = () => {
  const [loading, setLoading] = useState(true);
  const [defaultSchedule, setDefaultSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDefaultSchedule();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchDefaultSchedule = async () => {
    try {
      const response = await jadwalService.getDefault();
      setDefaultSchedule(response.data || []);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      toast.error("Gagal memuat jadwal default");
    } finally {
      setLoading(false);
    }
  };

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

  const handleToggleDay = async (hari, currentStatus) => {
    try {
      await jadwalService.updateDefault(hari, { is_active: !currentStatus });
      toast.success(
        `Jadwal ${HARI_NAMES[hari]} ${
          currentStatus ? "dinonaktifkan" : "diaktifkan"
        }`
      );
      fetchDefaultSchedule();
    } catch (error) {
      toast.error("Gagal mengubah status jadwal");
    }
  };

  const handleUpdateTime = async (hari, waktu_mulai, waktu_selesai) => {
    try {
      await jadwalService.updateDefault(hari, { waktu_mulai, waktu_selesai });
      toast.success("Jadwal berhasil diperbarui");
      fetchDefaultSchedule();
    } catch (error) {
      toast.error("Gagal memperbarui jadwal");
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
    try {
      await jadwalService.setHoliday(date);
      toast.success("Tanggal ditandai sebagai libur");
      fetchSlots(date);
    } catch (error) {
      toast.error("Gagal menandai libur");
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
        i
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
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthYear = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

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
        {/* Default Schedule */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" />
            Jadwal Default Mingguan
          </h3>
          <div className="space-y-3">
            {Object.keys(HARI_NAMES).map((hari) => {
              const schedule = defaultSchedule.find(
                (s) => s.hari?.toLowerCase() === hari
              );
              const isActive = schedule?.is_active;

              return (
                <div
                  key={hari}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl ${
                    isActive ? "bg-slate-50" : "bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleDay(hari, isActive)}
                      className={`p-1 rounded-lg transition-colors ${
                        isActive
                          ? "text-emerald-500 hover:bg-emerald-50"
                          : "text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {isActive ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                    <span
                      className={`font-medium ${
                        isActive ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {HARI_NAMES[hari]}
                    </span>
                  </div>
                  {isActive ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        defaultValue={formatTime(schedule?.waktu_mulai)}
                        onBlur={(e) => {
                          if (
                            e.target.value !== formatTime(schedule?.waktu_mulai)
                          ) {
                            handleUpdateTime(
                              hari,
                              e.target.value,
                              formatTime(schedule?.waktu_selesai)
                            );
                          }
                        }}
                        className="px-2 py-1 border border-slate-200 rounded-lg text-sm w-24"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="time"
                        defaultValue={formatTime(schedule?.waktu_selesai)}
                        onBlur={(e) => {
                          if (
                            e.target.value !==
                            formatTime(schedule?.waktu_selesai)
                          ) {
                            handleUpdateTime(
                              hari,
                              formatTime(schedule?.waktu_mulai),
                              e.target.value
                            );
                          }
                        }}
                        className="px-2 py-1 border border-slate-200 rounded-lg text-sm w-24"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Libur</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Calendar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
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
              <span className="font-medium text-slate-700 min-w-35 text-center">
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
      </div>

      {/* Slots for Selected Date */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Slot Waktu -{" "}
                {new Date(selectedDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSetHoliday(selectedDate)}
              >
                Tandai Libur
              </Button>
            </div>

            {slotsLoading ? (
              <div className="py-8">
                <LoadingSpinner />
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-xl text-center border-2 ${
                      slot.status === "tersedia"
                        ? "border-emerald-200 bg-emerald-50"
                        : slot.status === "dipesan"
                        ? "border-sky-200 bg-sky-50"
                        : slot.status === "diblock_admin"
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-slate-100"
                    }`}
                  >
                    <span className="font-medium text-sm">
                      {formatTime(slot.waktu_mulai)}
                    </span>
                    <Badge
                      variant={
                        slot.status === "tersedia"
                          ? "success"
                          : slot.status === "dipesan"
                          ? "info"
                          : "danger"
                      }
                      className="mt-1 text-xs"
                    >
                      {slot.status === "tersedia" && "Tersedia"}
                      {slot.status === "dipesan" && "Terpesan"}
                      {slot.status === "diblock_admin" && "Diblokir"}
                      {slot.status === "libur" && "Libur"}
                    </Badge>
                    {slot.status === "tersedia" && (
                      <button
                        onClick={() => handleBlockSlot(slot.id)}
                        className="mt-2 flex items-center justify-center gap-1 w-full text-xs text-red-600 hover:bg-red-100 rounded-lg py-1"
                      >
                        <Lock className="w-3 h-3" />
                        Blokir
                      </button>
                    )}
                    {slot.status === "diblock_admin" && (
                      <button
                        onClick={() => handleUnblockSlot(slot.id)}
                        className="mt-2 flex items-center justify-center gap-1 w-full text-xs text-emerald-600 hover:bg-emerald-100 rounded-lg py-1"
                      >
                        <Unlock className="w-3 h-3" />
                        Buka
                      </button>
                    )}
                  </div>
                ))}
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
      )}
    </div>
  );
};

export default ManageJadwal;
