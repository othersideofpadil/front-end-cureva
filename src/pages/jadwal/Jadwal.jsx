import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Award,
  Star,
} from "lucide-react";
import { jadwalService } from "../../services";
import { Card, LoadingSpinner, Badge } from "../../components/common";

const FISIOTERAPIS = {
  nama: "Abbad Al Wafi",
  gelar: "S.Ft., M.Fis",
  spesialisasi: "Fisioterapi Muskuloskeletal",
  pengalaman: "5+ Tahun Pengalaman",
  rating: 4.9,
  totalPasien: 500,
  foto: "/images/fisioterapis.jpg",
  bio: "Fisioterapis profesional dengan spesialisasi dalam penanganan gangguan muskuloskeletal, rehabilitasi pasca stroke, dan terapi geriatri. Berdedikasi untuk memberikan perawatan terbaik langsung ke rumah Anda.",
  sertifikasi: [
    "STR Fisioterapis Aktif",
    "Certified Manual Therapy",
    "Dry Needling Certified",
  ],
};

const HARI_NAMES = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

const Jadwal = () => {
  const [loading, setLoading] = useState(true);
  const [defaultSchedule, setDefaultSchedule] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [scheduleRes, datesRes] = await Promise.all([
        jadwalService.getDefault(),
        jadwalService.getAvailableDates(),
      ]);
      setDefaultSchedule(scheduleRes.data || []);
      // Extract date strings from response objects
      const dates = (datesRes.data || []).map((d) =>
        typeof d === "string" ? d : d.tanggal
      );
      setAvailableDates(dates);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (date) => {
    setSlotsLoading(true);
    try {
      const response = await jadwalService.getAvailable(date);
      setSlots(response.data || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5) || "";
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

    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, date: null });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const isAvailable = availableDates.includes(dateStr);
      const isToday = dateStr === new Date().toISOString().split("T")[0];
      const isPast =
        new Date(dateStr) < new Date(new Date().toISOString().split("T")[0]);

      days.push({
        day: i,
        date: dateStr,
        isAvailable,
        isToday,
        isPast,
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Jadwal Fisioterapis
        </h1>
        <p className="text-slate-500">
          Lihat jadwal dan ketersediaan fisioterapis
        </p>
      </div>

      {/* Fisioterapis Profile */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-sky-100 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {FISIOTERAPIS.foto ? (
                <img
                  src={FISIOTERAPIS.foto}
                  alt={FISIOTERAPIS.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {FISIOTERAPIS.nama}, {FISIOTERAPIS.gelar}
                </h2>
                <p className="text-sky-500 font-medium">
                  {FISIOTERAPIS.spesialisasi}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-amber-700">
                  {FISIOTERAPIS.rating}
                </span>
              </div>
            </div>

            <p className="text-slate-600 mt-3">{FISIOTERAPIS.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Award className="w-4 h-4 text-sky-500" />
                <span>{FISIOTERAPIS.pengalaman}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4 text-sky-500" />
                <span>{FISIOTERAPIS.totalPasien}+ Pasien</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {FISIOTERAPIS.sertifikasi.map((sert, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sky-50 text-sky-600 text-sm font-medium rounded-full"
                >
                  {sert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Default Schedule */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Jam Praktik
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
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isActive ? "bg-slate-50" : "bg-slate-100"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      isActive ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {HARI_NAMES[hari]}
                  </span>
                  {isActive ? (
                    <span className="text-sky-600 font-medium">
                      {formatTime(schedule.waktu_mulai)} -{" "}
                      {formatTime(schedule.waktu_selesai)}
                    </span>
                  ) : (
                    <span className="text-slate-400">Libur</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Calendar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Pilih Tanggal
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="font-medium text-slate-700 min-w-35 text-center">
                {monthYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((item, index) => (
              <button
                key={index}
                disabled={!item.day || item.isPast || !item.isAvailable}
                onClick={() => item.isAvailable && setSelectedDate(item.date)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${!item.day ? "invisible" : ""}
                  ${item.isSelected ? "bg-sky-500 text-white" : ""}
                  ${
                    item.isToday && !item.isSelected
                      ? "ring-2 ring-sky-500"
                      : ""
                  }
                  ${
                    item.isAvailable && !item.isSelected
                      ? "bg-sky-50 text-sky-600 hover:bg-sky-100"
                      : ""
                  }
                  ${
                    item.isPast || !item.isAvailable
                      ? "text-slate-300 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {item.day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-50 rounded" />
              <span className="text-slate-600">Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 rounded" />
              <span className="text-slate-600">Tidak Tersedia</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Date Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Slot Waktu Tersedia
            </h3>
            <p className="text-slate-500 mb-4">{formatDate(selectedDate)}</p>

            {slotsLoading ? (
              <div className="py-8">
                <LoadingSpinner />
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot, index) => (
                  <div
                    key={slot.id || index}
                    className={`
                      p-3 rounded-xl text-center border-2 transition-all
                      ${
                        slot.status === "tersedia"
                          ? "border-sky-200 bg-sky-50 text-sky-600"
                          : "border-slate-200 bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-medium">
                      {formatTime(slot.waktu_mulai)}
                    </span>
                    {slot.status !== "tersedia" && (
                      <p className="text-xs mt-1">
                        {slot.status === "terpesan"
                          ? "Terpesan"
                          : "Tidak Tersedia"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Tidak ada slot tersedia untuk tanggal ini
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Jadwal;
