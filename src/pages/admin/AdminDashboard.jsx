import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  FileText,
  MapPin,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { adminService, bookingService } from "../../services";
import { Card, LoadingSpinner, Modal, Button } from "../../components/common";

/* ─── helpers ─────────────────────────────────────────────────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (t) => t?.slice(0, 5) || "";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

/* ─── Status helpers (same as ManageBookings) ─────────────────── */
const STATUS_META = {
  menunggu_konfirmasi: { label: "Menunggu", color: "amber" },
  dikonfirmasi: { label: "Dikonfirmasi", color: "sky" },
  dijadwalkan: { label: "Dijadwalkan", color: "blue" },
  dalam_perjalanan: { label: "Dalam Perjalanan", color: "violet" },
  sedang_berlangsung: { label: "Berlangsung", color: "emerald" },
  selesai: { label: "Selesai", color: "green" },
  ditolak: { label: "Ditolak", color: "red" },
  dibatalkan_pasien: { label: "Dibatalkan", color: "slate" },
  dibatalkan_sistem: { label: "Dibatalkan", color: "slate" },
};

const statusBadgeClass = (status) => {
  const map = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    slate: "bg-slate-50 text-slate-500 border-slate-100",
  };
  return `text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
    map[STATUS_META[status]?.color || "slate"]
  }`;
};

const accentBar = (status) => {
  const map = {
    menunggu_konfirmasi: "bg-amber-400",
    dikonfirmasi: "bg-sky-400",
    dijadwalkan: "bg-blue-400",
    dalam_perjalanan: "bg-violet-400",
    sedang_berlangsung: "bg-emerald-400",
    selesai: "bg-green-400",
    ditolak: "bg-red-400",
    dibatalkan_pasien: "bg-slate-300",
    dibatalkan_sistem: "bg-slate-300",
  };
  return map[status] || "bg-slate-200";
};

/* ─── InfoBlock (same as ManageBookings) ──────────────────────── */
const InfoBlock = ({ icon: Icon, label, children }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
    {children}
  </div>
);

/* ─── Booking Card (same style as ManageBookings) ─────────────── */
const BookingCard = ({
  booking,
  onDetail,
  onQuickConfirm,
  onQuickReject,
  actionLoading,
}) => {
  const isDone =
    booking.status === "selesai" ||
    booking.status === "ditolak" ||
    booking.status?.includes("dibatalkan");
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
      {/* accent bar */}
      <div className={`h-1 w-full ${accentBar(booking.status)}`} />

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        {/* top row */}
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

        {/* service */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileText className="w-3.5 h-3.5 shrink-0 text-slate-300" />
          <span className="truncate">{booking.nama_layanan}</span>
        </div>

        {/* schedule */}
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

        {/* address snippet */}
        {booking.alamat && (
          <div className="flex items-start gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-300" />
            <span className="line-clamp-1">{booking.alamat}</span>
          </div>
        )}
      </div>

      {/* action bar */}
      <div className="flex items-center divide-x divide-slate-100 border-t border-slate-100">
        {/* detail */}
        <button
          onClick={() => onDetail(booking)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Detail
        </button>

        {/* quick confirm / reject if waiting */}
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

/* ─── Main Component ─────────────────────────────────────────── */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("weekly");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    totalLayanan: 0,
    monthStats: {},
    recentBookings: [],
  });
  const [chartData, setChartData] = useState([]);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchChartData(chartPeriod).catch((e) => console.error(e));
  }, [chartPeriod]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      const data = response.data || {};
      setStats({
        totalUsers: data.overview?.total_users || 0,
        totalBookings: data.overview?.total_pemesanan || 0,
        pendingBookings: data.overview?.menunggu || 0,
        completedBookings: data.overview?.selesai || 0,
        totalRevenue: data.overview?.total_pendapatan || 0,
        avgRating: data.overview?.rata_rating || 0,
        todayBookings: data.overview?.booking_hari_ini || 0,
        totalLayanan: data.overview?.total_layanan || 0,
        monthStats: data.month_stats || {},
        recentBookings: data.recent_bookings || [],
      });
      fetchChartData(chartPeriod).catch((e) => console.error(e));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (period = "weekly") => {
    try {
      const today = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const toYMD = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      if (period === "daily") {
        const days = 7;
        const from = new Date();
        from.setDate(today.getDate() - (days - 1));
        const res = await bookingService.getAll({
          tanggalFrom: toYMD(from),
          tanggalTo: toYMD(today),
          limit: 10000,
        });
        const bookings = res.data || [];
        const data = [];
        for (let i = 0; i < days; i++) {
          const d = new Date(from);
          d.setDate(from.getDate() + i);
          const key = toYMD(d);
          data.push({
            name: d.toLocaleDateString("id-ID", { weekday: "short" }),
            bookings: bookings.filter((b) => b.tanggal === key).length,
          });
        }
        setChartData(data);
        return;
      }

      if (period === "weekly") {
        const weeks = 4;
        const from = new Date();
        from.setDate(today.getDate() - (weeks * 7 - 1));
        const res = await bookingService.getAll({
          tanggalFrom: toYMD(from),
          tanggalTo: toYMD(today),
          limit: 10000,
        });
        const bookings = res.data || [];
        const data = [];
        for (let w = 0; w < weeks; w++) {
          const weekStart = new Date(from);
          weekStart.setDate(from.getDate() + w * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          data.push({
            name: `Minggu ${w + 1}`,
            bookings: bookings.filter(
              (b) =>
                b.tanggal >= toYMD(weekStart) && b.tanggal <= toYMD(weekEnd),
            ).length,
          });
        }
        setChartData(data);
        return;
      }

      // monthly
      const months = 6;
      const start = new Date(
        today.getFullYear(),
        today.getMonth() - (months - 1),
        1,
      );
      const res = await bookingService.getAll({
        tanggalFrom: toYMD(start),
        tanggalTo: toYMD(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
        ),
        limit: 10000,
      });
      const bookings = res.data || [];
      const data = [];
      for (let m = 0; m < months; m++) {
        const cur = new Date(start.getFullYear(), start.getMonth() + m, 1);
        const monthStart = toYMD(
          new Date(cur.getFullYear(), cur.getMonth(), 1),
        );
        const monthEnd = toYMD(
          new Date(cur.getFullYear(), cur.getMonth() + 1, 0),
        );
        data.push({
          name: cur.toLocaleDateString("id-ID", { month: "short" }),
          bookings: bookings.filter(
            (b) => b.tanggal >= monthStart && b.tanggal <= monthEnd,
          ).length,
        });
      }
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setChartData([]);
    }
  };

  /* ── Quick Actions ── */
  const handleQuickConfirm = async (booking) => {
    setActionLoading(true);
    try {
      await bookingService.updateStatus(booking.id, "dikonfirmasi");
      toast.success("Booking berhasil dikonfirmasi");
      fetchDashboardData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal mengkonfirmasi booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickReject = async (booking) => {
    setActionLoading(true);
    try {
      await bookingService.updateStatus(
        booking.id,
        "ditolak",
        "Ditolak oleh admin",
      );
      toast.success("Booking ditolak");
      fetchDashboardData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menolak booking");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Sort: always show most recent, waiting on top ── */
  const sortedRecentBookings = [...(stats.recentBookings || [])].sort(
    (a, b) => {
      // menunggu_konfirmasi selalu paling atas
      if (
        a.status === "menunggu_konfirmasi" &&
        b.status !== "menunggu_konfirmasi"
      )
        return -1;
      if (
        b.status === "menunggu_konfirmasi" &&
        a.status !== "menunggu_konfirmasi"
      )
        return 1;
      // lalu urutkan by created_at atau tanggal terbaru
      const aTime = a.created_at
        ? new Date(a.created_at).getTime()
        : new Date(`${a.tanggal}T${a.waktu}`).getTime();
      const bTime = b.created_at
        ? new Date(b.created_at).getTime()
        : new Date(`${b.tanggal}T${b.waktu}`).getTime();
      return bTime - aTime;
    },
  );

  const pendingCount = sortedRecentBookings.filter(
    (b) => b.status === "menunggu_konfirmasi",
  ).length;

  const statCards = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-sky-500",
      lightColor: "bg-sky-50",
      caption: `Total layanan: ${stats.totalLayanan || 0}`,
      href: "/admin/users",
    },
    {
      title: "Total Booking",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      caption: `Bulan ini: ${stats.monthStats?.total_pemesanan || 0}`,
      href: "/admin/bookings",
    },
    {
      title: "Menunggu Konfirmasi",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      caption: `Bulan ini: ${stats.monthStats?.menunggu || 0}`,
      href: "/admin/bookings",
    },
    {
      title: "Total Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      caption: `Bulan ini: ${formatCurrency(stats.monthStats?.total_dibayar || 0)}`,
      href: "/admin/payments",
    },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Selamat datang di panel admin Cureva
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
                <a
                  href={stat.href}
                  className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  Lihat
                </a>
              </div>
              <div className="mt-4">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  {stat.title}
                </p>
                {stat.caption && (
                  <p className="text-xs text-slate-400 mt-1">{stat.caption}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: Calendar,
            bg: "bg-sky-100",
            iconColor: "text-sky-500",
            value: stats.todayBookings || 0,
            label: "Booking Hari Ini",
          },
          {
            icon: CheckCircle,
            bg: "bg-emerald-100",
            iconColor: "text-emerald-500",
            value: stats.completedBookings || 0,
            label: "Booking Selesai",
          },
          {
            icon: AlertCircle,
            bg: "bg-amber-100",
            iconColor: "text-amber-500",
            value: stats.pendingBookings || 0,
            label: "Perlu Tindakan",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 ${item.bg} rounded-xl shrink-0`}>
                <item.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`}
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  {item.label}
                </p>
              </div>
            </div>
            <a
              href="/admin/bookings"
              className="text-xs font-medium text-sky-600 hover:text-sky-700"
            >
              Lihat
            </a>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base font-semibold text-slate-800">
            Tren Booking
          </h3>
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          >
            <option value="daily">Harian (7 Hari)</option>
            <option value="weekly">Mingguan (4 Minggu)</option>
            <option value="monthly">Bulanan (6 Bulan)</option>
          </select>
        </div>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
            Tidak ada data untuk periode ini
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={windowWidth < 640 ? 250 : 300}
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        {/* Section header */}
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

        {/* Cards Grid */}
        {sortedRecentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm font-medium">Belum ada pemesanan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <AnimatePresence>
              {sortedRecentBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <BookingCard
                    booking={booking}
                    onDetail={(b) => {
                      setSelectedBooking(b);
                      setShowDetailModal(true);
                    }}
                    onQuickConfirm={handleQuickConfirm}
                    onQuickReject={handleQuickReject}
                    actionLoading={actionLoading}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
        title={
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Detail Booking
            </h2>
            {selectedBooking?.kode_booking && (
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedBooking.kode_booking}
              </p>
            )}
          </div>
        }
        size="lg"
        responsive
        footer={
          selectedBooking?.status === "menunggu_konfirmasi" ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={async () => {
                  await handleQuickReject(selectedBooking);
                  setShowDetailModal(false);
                  setSelectedBooking(null);
                }}
                loading={actionLoading}
              >
                Tolak
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  await handleQuickConfirm(selectedBooking);
                  setShowDetailModal(false);
                  setSelectedBooking(null);
                }}
                loading={actionLoading}
              >
                Konfirmasi
              </Button>
            </div>
          ) : null
        }
      >
        {selectedBooking && (
          <div className="space-y-3">
            {/* status */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-slate-400 font-medium">
                Status saat ini
              </span>
              <span className={statusBadgeClass(selectedBooking.status)}>
                {STATUS_META[selectedBooking.status]?.label ||
                  selectedBooking.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <InfoBlock icon={User} label="Pasien">
                <p className="font-semibold text-slate-800 text-sm">
                  {selectedBooking.nama_pasien}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedBooking.email_pasien}
                </p>
                {selectedBooking.telepon_pasien && (
                  <p className="text-xs text-slate-500">
                    {selectedBooking.telepon_pasien}
                  </p>
                )}
              </InfoBlock>

              <InfoBlock icon={Calendar} label="Jadwal">
                <p className="font-semibold text-slate-800 text-sm">
                  {formatDate(selectedBooking.tanggal)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatTime(selectedBooking.waktu)} WIB
                </p>
              </InfoBlock>
            </div>

            <InfoBlock icon={FileText} label="Layanan">
              <p className="font-semibold text-slate-800 text-sm">
                {selectedBooking.nama_layanan}
              </p>
              {selectedBooking.harga_layanan && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Rp {selectedBooking.harga_layanan?.toLocaleString("id-ID")}
                </p>
              )}
            </InfoBlock>

            <InfoBlock icon={MapPin} label="Alamat">
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedBooking.alamat}
              </p>
              {selectedBooking.koordinat && (
                <a
                  href={selectedBooking.koordinat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka di Google Maps
                </a>
              )}
            </InfoBlock>

            <InfoBlock icon={AlertCircle} label="Keluhan">
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedBooking.keluhan || "-"}
              </p>
            </InfoBlock>

            {selectedBooking.catatan_tambahan && (
              <InfoBlock icon={FileText} label="Catatan Tambahan">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedBooking.catatan_tambahan}
                </p>
              </InfoBlock>
            )}

            <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
              <span className="text-sm text-slate-500 font-medium">
                Total Biaya
              </span>
              <span className="text-xl font-bold text-sky-600">
                Rp{" "}
                {(selectedBooking.harga_layanan || 0).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
