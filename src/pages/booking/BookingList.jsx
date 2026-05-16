import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  ChevronDown,
  X,
  FileX,
} from "lucide-react";
import { bookingService } from "../../services";
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  Input,
} from "../../components/common";

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dijadwalkan", label: "Dijadwalkan" },
  { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
  { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan_pasien", label: "Dibatalkan" },
];

const BookingList = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, search, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.kode_booking?.toLowerCase().includes(searchLower) ||
          b.nama_layanan?.toLowerCase().includes(searchLower) ||
          b.alamat?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const formatPrice = (price) => `Rp ${(price || 0).toLocaleString("id-ID")}`;

  const activeFilterLabel =
    statusOptions.find((o) => o.value === statusFilter)?.label ||
    "Semua Status";

  const hasActiveFilter = statusFilter !== "all" || search !== "";

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky top bar on mobile ── */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-200 px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Booking Saya
            </h1>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              {filteredBookings.length} booking
            </p>
          </div>
          <Link to="/bookings/new">
            <Button size="sm" leftIcon={Plus}>
              Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-4 py-5 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* ── Header — desktop only ── */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Booking Saya
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Kelola semua pemesanan fisioterapi Anda
              </p>
            </div>
            <Link to="/bookings/new">
              <Button className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm text-sm font-semibold">
                <Plus className="w-4 h-4" />
                <span>Booking Baru</span>
              </Button>
            </Link>
          </div>

          {/* ── Search & Filter bar ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 space-y-3">
            {/* Row: search + filter toggle */}
            <div className="flex gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari kode, layanan…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0
                  ${
                    showFilters
                      ? "bg-sky-50 border-sky-300 text-sky-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {statusFilter !== "all" && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold leading-none">
                    1
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Filter chips (animated) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setShowFilters(false);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                          ${
                            statusFilter === opt.value
                              ? "bg-sky-500 border-sky-500 text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Active filter summary ── */}
          {hasActiveFilter && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">
                  {filteredBookings.length}
                </span>{" "}
                hasil
                {statusFilter !== "all" && (
                  <span className="text-sky-600"> · {activeFilterLabel}</span>
                )}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-slate-400 hover:text-sky-600 transition-colors underline underline-offset-2 text-xs"
              >
                Reset filter
              </button>
            </div>
          )}

          {/* ── Booking Cards ── */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-3">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200">
                    {/* Card body */}
                    <div className="p-4 sm:p-5">
                      {/* Top row: nama layanan + badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base leading-snug truncate">
                            {booking.nama_layanan || "Fisioterapi"}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono tracking-wide mt-0.5">
                            {booking.kode_booking}
                          </p>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          <Badge status={booking.status} />
                        </div>
                      </div>

                      {/* Meta info — stacked on mobile, row on sm+ */}
                      <div className="grid grid-cols-1 gap-1.5 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formatDate(booking.tanggal)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formatTime(booking.waktu)} WIB
                        </span>
                        <span className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{booking.alamat}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card footer — harga + tombol detail */}
                    <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                      {/* Harga */}
                      <div>
                        <span className="text-[11px] text-slate-400 block leading-none mb-0.5">
                          Total Biaya
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {formatPrice(booking.harga_layanan)}
                        </span>
                      </div>

                      {/* Tombol detail */}
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="secondary" size="sm" leftIcon={Eye}>
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <FileX className="w-7 h-7" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">
                  {search || statusFilter !== "all"
                    ? "Tidak ada hasil ditemukan"
                    : "Belum ada booking"}
                </p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs">
                  {search || statusFilter !== "all"
                    ? "Coba ubah kata kunci atau filter yang digunakan."
                    : "Anda belum memiliki riwayat booking fisioterapi."}
                </p>
              </div>
              {search || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors min-h-10"
                >
                  Reset Filter
                </button>
              ) : (
                <Link to="/bookings/new">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors min-h-10">
                    <Plus className="w-4 h-4" />
                    Buat Booking Pertama
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingList;
