import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { adminService, bookingService } from "../../services";
import { Card, LoadingSpinner, Badge } from "../../components/common";

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
    upcomingBookings: [],
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();

    // Listen for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Refetch chart data when period changes
    fetchChartData(chartPeriod).catch((e) => console.error(e));
  }, [chartPeriod]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      const data = response.data || {};

      // Map backend response to frontend state
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
        upcomingBookings: data.upcoming_bookings || [],
      });
      // Fetch chart data after stats
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
        const tanggalFrom = toYMD(from);
        const tanggalTo = toYMD(today);

        const res = await bookingService.getAll({
          tanggalFrom,
          tanggalTo,
          limit: 10000,
        });
        const bookings = res.data || [];

        const data = [];
        for (let i = 0; i < days; i++) {
          const d = new Date(from);
          d.setDate(from.getDate() + i);
          const key = toYMD(d);
          const label = d.toLocaleDateString("id-ID", { weekday: "short" });
          const count = bookings.filter((b) => b.tanggal === key).length;
          data.push({ name: label, bookings: count });
        }
        setChartData(data);
        return;
      }

      if (period === "weekly") {
        const weeks = 4;
        const totalDays = weeks * 7;
        const from = new Date();
        from.setDate(today.getDate() - (totalDays - 1));
        const tanggalFrom = toYMD(from);
        const tanggalTo = toYMD(today);

        const res = await bookingService.getAll({
          tanggalFrom,
          tanggalTo,
          limit: 10000,
        });
        const bookings = res.data || [];

        const data = [];
        for (let w = 0; w < weeks; w++) {
          const weekStart = new Date(from);
          weekStart.setDate(from.getDate() + w * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          const count = bookings.filter((b) => {
            const t = b.tanggal;
            return t >= toYMD(weekStart) && t <= toYMD(weekEnd);
          }).length;
          data.push({ name: `Minggu ${w + 1}`, bookings: count });
        }
        setChartData(data);
        return;
      }

      // monthly
      const months = 6;
      const data = [];
      const start = new Date(
        today.getFullYear(),
        today.getMonth() - (months - 1),
        1,
      );
      const tanggalFrom = toYMD(start);
      const tanggalTo = toYMD(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
      );

      const res = await bookingService.getAll({
        tanggalFrom,
        tanggalTo,
        limit: 10000,
      });
      const bookings = res.data || [];

      for (let m = 0; m < months; m++) {
        const cur = new Date(start.getFullYear(), start.getMonth() + m, 1);
        const monthStart = toYMD(
          new Date(cur.getFullYear(), cur.getMonth(), 1),
        );
        const monthEnd = toYMD(
          new Date(cur.getFullYear(), cur.getMonth() + 1, 0),
        );
        const count = bookings.filter(
          (b) => b.tanggal >= monthStart && b.tanggal <= monthEnd,
        ).length;
        const label = cur.toLocaleDateString("id-ID", { month: "short" });
        data.push({ name: label, bookings: count });
      }
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setChartData([]);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5) || "";
  };

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
      caption: `Bulan ini: ${formatCurrency(
        stats.monthStats?.total_dibayar || 0,
      )}`,
      href: "/admin/payments",
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Dashboard Admin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
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
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color.replace(
                        "bg-",
                        "text-",
                      )}`}
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
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {stat.caption}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-sky-100 rounded-xl shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                {stats.todayBookings || 0}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Booking Hari Ini
              </p>
            </div>
          </div>
          <a
            href="/admin/bookings"
            className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Lihat
          </a>
        </Card>
        <Card className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-emerald-100 rounded-xl shrink-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                {stats.completedBookings || 0}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Booking Selesai
              </p>
            </div>
          </div>
          <a
            href="/admin/bookings"
            className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Lihat
          </a>
        </Card>
        <Card className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                {stats.pendingBookings || 0}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Perlu Tindakan
              </p>
            </div>
          </div>
          <a
            href="/admin/bookings"
            className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Lihat
          </a>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Tren Booking</h3>
          <div className="flex items-center gap-2">
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="daily">Harian (7 Hari)</option>
              <option value="weekly">Mingguan (4 Minggu)</option>
              <option value="monthly">Bulanan (6 Bulan)</option>
            </select>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-slate-500">
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
                  borderRadius: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Recent Bookings */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Booking Terbaru
          </h2>
          <a
            href="/admin/bookings"
            className="text-sky-500 hover:text-sky-600 text-sm font-medium"
          >
            Lihat Semua →
          </a>
        </div>

        {/* Bookings Grid (responsive cards for all viewports) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.recentBookings.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-500">
              Belum ada booking
            </div>
          ) : (
            stats.recentBookings.map((booking) => (
              <Card
                key={booking.id}
                className="p-3 sm:p-4 hover:bg-slate-50 h-full rounded-lg shadow-sm"
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs sm:text-sm text-sky-600 font-semibold truncate">
                        {booking.kode_booking}
                      </p>
                      <p className="text-sm sm:text-base text-slate-700 mt-0.5 truncate">
                        {booking.nama_pasien}
                      </p>
                    </div>
                    <div className="ml-3 shrink-0">
                      <Badge status={booking.status} size="sm" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500 text-xs sm:text-sm">
                        Layanan:
                      </span>
                      <span className="text-slate-700 font-medium text-sm sm:text-sm truncate ml-3 text-right">
                        {booking.nama_layanan}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500 text-xs sm:text-sm">
                        Jadwal:
                      </span>
                      <div className="text-right ml-3">
                        <p className="text-slate-800 font-medium text-sm sm:text-sm">
                          {formatDate(booking.tanggal)}
                        </p>
                        <p className="text-slate-600 text-xs sm:text-sm">
                          {formatTime(booking.waktu)} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
