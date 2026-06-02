import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Calendar } from "lucide-react";
import { jadwalService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common";

const dayOrder = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
  "minggu",
];

const dayLabels = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

const FisioterapisSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [todaySlots, setTodaySlots] = useState([]);
  const [todayLoading, setTodayLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await jadwalService.getDefault();
        setSchedule(response.data || []);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchTodaySlots = async () => {
      const today = selectedDate;
      try {
        const response = await jadwalService.getSlotsPublic(today);
        if (isMounted) {
          setTodaySlots(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch today's slots:", error);
        if (isMounted) {
          setTodaySlots([]);
        }
      } finally {
        if (isMounted) {
          setTodayLoading(false);
        }
      }
    };

    fetchTodaySlots();
    const intervalId = setInterval(fetchTodaySlots, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedDate]);

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hour, minute] = timeStr.split(":").map(Number);
    return hour * 60 + minute;
  };

  const toTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  const generateSlots = (start, end, duration = 60) => {
    if (!start || !end) return [];
    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);
    const slots = [];
    for (
      let current = startMinutes;
      current + duration <= endMinutes;
      current += duration
    ) {
      slots.push(toTime(current));
    }
    return slots;
  };

  const scheduleByDay = dayOrder.map((day) => {
    const entry = schedule.find((item) => item.hari?.toLowerCase() === day);
    const start = formatTime(entry?.waktu_mulai);
    const end = formatTime(entry?.waktu_selesai);
    return {
      day,
      label: dayLabels[day],
      isActive: Boolean(entry?.is_active),
      start,
      end,
      slots: entry?.is_active ? generateSlots(start, end) : [],
    };
  });

  const getRangeLabel = (startIndex, endIndex) => {
    if (startIndex === endIndex) return dayLabels[dayOrder[startIndex]];
    return `${dayLabels[dayOrder[startIndex]]} - ${dayLabels[dayOrder[endIndex]]}`;
  };

  const groupedSchedule = scheduleByDay.reduce((groups, item, index) => {
    if (!item.isActive || !item.start || !item.end) return groups;

    const lastGroup = groups[groups.length - 1];
    const sameTime =
      lastGroup &&
      lastGroup.start === item.start &&
      lastGroup.end === item.end &&
      lastGroup.endIndex === index - 1;

    if (sameTime) {
      lastGroup.endIndex = index;
      return groups;
    }

    groups.push({
      startIndex: index,
      endIndex: index,
      start: item.start,
      end: item.end,
    });
    return groups;
  }, []);

  const todayLabel = new Date(selectedDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const todayValue = selectedDate;

  const minDate = new Date().toLocaleDateString("en-CA");
  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString("en-CA");
  })();

  const handleSlotSelect = (slot) => {
    const waktu = formatTime(slot.waktu_mulai);
    const bookingTarget = `/bookings/new?tanggal=${todayValue}&waktu=${waktu}`;

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(bookingTarget)}`);
      return;
    }

    navigate(bookingTarget);
  };

  const normalizeTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const addMinutesToTime = (timeStr, minutesToAdd) => {
    const [hour, minute] = normalizeTime(timeStr).split(":").map(Number);
    const totalMinutes = hour * 60 + minute + minutesToAdd;

    if (Number.isNaN(totalMinutes) || totalMinutes < 0) return null;

    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getBufferTimes = (slots) => {
    const bufferTimes = new Set();
    slots
      .filter((slot) => slot.status === "dipesan")
      .forEach((slot) => {
        const nextTime = addMinutesToTime(slot.waktu_mulai, 60);
        if (nextTime) bufferTimes.add(nextTime);
      });
    return bufferTimes;
  };

  const isSameDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const isSlotPast = (slot) => {
    if (!isSameDate(selectedDate)) return false;
    const waktu = formatTime(slot.waktu_mulai);
    const slotTime = new Date(`${selectedDate}T${waktu}:00`);
    return slotTime <= new Date();
  };

  const getSlotStatus = (status) => {
    if (status === "dipesan")
      return { label: "Terpesan", className: "bg-sky-100 text-sky-700" };
    if (status === "diblock_admin")
      return { label: "Diblokir", className: "bg-red-100 text-red-700" };
    if (status === "libur")
      return { label: "Libur", className: "bg-slate-100 text-slate-600" };
    return { label: "Tersedia", className: "bg-emerald-100 text-emerald-700" };
  };

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
            Fisioterapis <span className="text-primary">Kami</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Ditangani langsung oleh fisioterapis profesional dan berpengalaman
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* ── Profile Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-5 sm:p-8">
              {/*
                Mobile  (<sm) : foto + rating di atas, teks di bawah → flex-col
                Tablet+ (sm+) : foto + rating di kiri, teks di kanan  → flex-row
              */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start">
                {/* Foto + rating */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/pp.jpeg"
                      alt="Fisioterapis"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-slate-900">
                      4.9
                    </span>
                    <span className="text-xs text-slate-400">
                      · 120+ ulasan
                    </span>
                  </div>
                </div>

                {/* Info teks */}
                <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                  <p className="text-[11px] tracking-widest text-slate-400 uppercase mb-1.5">
                    Fisioterapis bersertifikat
                  </p>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight mb-0.5">
                    Abbad Al Wafi Amd. Kes, CDNP.
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mt-2 mb-5">
                    Lulusan D3 Fisioterapi dengan pengalaman lebih dari 3 tahun
                    menangani kasus muskuloskeletal, nyeri punggung, cedera
                    olahraga, dan gangguan gerak.
                  </p>

                  {/* Grid info — 2 kolom di semua ukuran, teks lebih fleksibel */}
                  <div className="grid grid-cols-2 rounded-xl border border-slate-200 overflow-hidden mb-5">
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-r border-b border-slate-200">
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        Spesialisasi
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-800">
                        Muskuloskeletal
                      </p>
                    </div>
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200">
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        Teknik
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-800">
                        Manual Therapy
                      </p>
                    </div>
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-r border-slate-200">
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        Layanan khusus
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-800">
                        Dry Needling
                      </p>
                    </div>
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        Kunjungan
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-800">
                        Klinik & Homecare
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col xs:flex-row sm:flex-col md:flex-row items-center gap-3">
                    <Button
                      onClick={() => {
                        const bookingTarget = "/bookings/new";
                        if (isAuthenticated) {
                          navigate(bookingTarget);
                          return;
                        }
                        navigate(
                          `/login?redirect=${encodeURIComponent(bookingTarget)}`,
                        );
                      }}
                      leftIcon={Calendar}
                      size="sm"
                      className="w-full xs:w-auto"
                    >
                      {isAuthenticated
                        ? "Booking sekarang"
                        : "Login"}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-slate-400 text-center sm:text-left">
                        Anda perlu login untuk memesan jadwal.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Schedule Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Jadwal Praktik
            </h3>

            {scheduleLoading || todayLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((row) => (
                  <div
                    key={row}
                    className="h-10 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Jadwal mingguan */}
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="space-y-2 text-sm">
                    {groupedSchedule.length > 0 ? (
                      groupedSchedule.map((group) => (
                        <div
                          key={`${group.startIndex}-${group.endIndex}`}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="font-medium text-slate-700 min-w-0 truncate">
                            {getRangeLabel(group.startIndex, group.endIndex)}
                          </span>
                          <span className="font-semibold text-primary whitespace-nowrap shrink-0">
                            {group.start} - {group.end}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">
                        Belum ada jadwal praktik.
                      </p>
                    )}
                  </div>
                </div>

                {/* Slot tanggal */}
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-700">
                      Slot Tanggal
                    </span>
                    <span className="text-xs text-slate-500">{todayLabel}</span>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs text-slate-500 mb-2">
                      Pilih tanggal
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {todaySlots.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(() => {
                        const bufferTimes = getBufferTimes(todaySlots);
                        return todaySlots.map((slot) => {
                          const past = isSlotPast(slot);
                          const slotStart = normalizeTime(slot.waktu_mulai);
                          const buffered = bufferTimes.has(slotStart);
                          const status = past
                            ? {
                                label: "Lewat",
                                className: "bg-slate-100 text-slate-500",
                              }
                            : buffered
                              ? {
                                  label: "Buffer 1 jam",
                                  className: "bg-amber-100 text-amber-700",
                                }
                              : getSlotStatus(slot.status);
                          const waktu = formatTime(slot.waktu_mulai);
                          const disabled =
                            past || buffered || slot.status !== "tersedia";

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleSlotSelect(slot)}
                              disabled={disabled}
                              className={`rounded-lg border p-2 text-center transition-colors ${
                                disabled
                                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                  : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50"
                              }`}
                            >
                              <div className="text-sm font-semibold">
                                {waktu}
                              </div>
                              <div
                                className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${status.className}`}
                              >
                                {status.label}
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      Tidak ada slot tersedia hari ini.
                    </p>
                  )}
                </div>
              </div>
            )}

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
