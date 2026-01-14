import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  ArrowUp,
  ArrowDown,
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
import { adminService } from "../../services";
import { Card, LoadingSpinner, Badge } from "../../components/common";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("weekly");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    totalLayanan: 0,
    recentBookings: [],
    upcomingBookings: [],
  });

  useEffect(() => {
    fetchDashboardData();

    // Listen for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        recentBookings: data.recent_bookings || [],
        upcomingBookings: data.upcoming_bookings || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
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
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Booking",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Menunggu Konfirmasi",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Total Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      trend: "+15%",
      trendUp: true,
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
                        "text-"
                      )}`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                      stat.trendUp ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {stat.trendUp ? (
                      <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {stat.title}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="flex items-center gap-3 sm:gap-4">
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
        </Card>
        <Card className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-emerald-100 rounded-xl shrink-0">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {stats.completedBookings || 0}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">Booking Selesai</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-amber-100 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {stats.pendingBookings || 0}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">Perlu Tindakan</p>
          </div>
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
        <ResponsiveContainer
          width="100%"
          height={windowWidth < 640 ? 250 : 300}
        >
          <AreaChart
            data={
              chartPeriod === "daily"
                ? [
                    { name: "Sen", bookings: 12 },
                    { name: "Sel", bookings: 19 },
                    { name: "Rab", bookings: 15 },
                    { name: "Kam", bookings: 25 },
                    { name: "Jum", bookings: 22 },
                    { name: "Sab", bookings: 18 },
                    { name: "Min", bookings: 14 },
                  ]
                : chartPeriod === "weekly"
                ? [
                    { name: "Minggu 1", bookings: 45 },
                    { name: "Minggu 2", bookings: 52 },
                    { name: "Minggu 3", bookings: 48 },
                    { name: "Minggu 4", bookings: 61 },
                  ]
                : [
                    { name: "Jan", bookings: 180 },
                    { name: "Feb", bookings: 220 },
                    { name: "Mar", bookings: 195 },
                    { name: "Apr", bookings: 240 },
                    { name: "Mei", bookings: 265 },
                    { name: "Jun", bookings: 290 },
                  ]
            }
          >
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

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  Kode
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  Pasien
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  Layanan
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  Jadwal
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-sm text-sky-600">
                    {booking.kode_booking}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-800">
                    {booking.nama_pasien}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {booking.nama_layanan}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    <div>
                      <p className="font-medium text-slate-800">
                        {formatDate(booking.tanggal)}
                      </p>
                      <p className="text-slate-500">
                        {formatTime(booking.waktu)} WIB
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={booking.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {stats.recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono text-sm text-sky-600 font-semibold">
                    {booking.kode_booking}
                  </p>
                  <p className="text-sm text-slate-700 mt-0.5">
                    {booking.nama_pasien}
                  </p>
                </div>
                <Badge status={booking.status} size="sm" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Layanan:</span>
                  <span className="text-slate-700 font-medium">
                    {booking.nama_layanan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jadwal:</span>
                  <div className="text-right">
                    <p className="text-slate-800 font-medium">
                      {formatDate(booking.tanggal)}
                    </p>
                    <p className="text-slate-600 text-xs">
                      {formatTime(booking.waktu)} WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {stats.recentBookings.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Belum ada booking
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
