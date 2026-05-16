import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminService, bookingService, paymentService } from "../../services";
import { Card, Button, LoadingSpinner, Badge } from "../../components/common";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [stats, setStats] = useState({
    overview: {},
    month_stats: {},
    recent_bookings: [],
  });
  const [payments, setPayments] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    fetchData();

    // Listen for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, paymentsRes] = await Promise.all([
        adminService.getDashboard(),
        bookingService.getAll({ limit: 10 }),
        paymentService.getAll(),
      ]);
      setStats(statsRes.data || { overview: {}, month_stats: {} });
      setRecentBookings(bookingsRes.data || []);
      const paymentRows = Array.isArray(paymentsRes?.data)
        ? paymentsRes.data
        : Array.isArray(paymentsRes?.data?.data)
          ? paymentsRes.data.data
          : Array.isArray(paymentsRes)
            ? paymentsRes
            : [];
      setPayments(paymentRows);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentDate = (payment) => {
    const rawDate =
      payment?.tanggal_pembayaran ||
      payment?.created_at ||
      payment?.createdAt ||
      payment?.tanggal;
    if (!rawDate) return null;
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getRangeStart = (range) => {
    const now = new Date();
    const start = new Date(now);

    if (range === "week") {
      start.setDate(now.getDate() - 6);
    } else if (range === "month") {
      start.setDate(now.getDate() - 29);
    } else if (range === "year") {
      start.setMonth(now.getMonth() - 11);
      start.setDate(1);
    } else {
      start.setDate(now.getDate() - 29);
    }

    start.setHours(0, 0, 0, 0);
    return start;
  };

  const buildRevenueData = (paymentList, period) => {
    const now = new Date();

    if (period === "daily") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const formatter = new Intl.DateTimeFormat("id-ID", { weekday: "short" });
      const buckets = [];
      const bucketMap = new Map();

      for (let i = 0; i < 7; i += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const key = date.getTime();
        const item = { name: formatter.format(date), revenue: 0, key };
        buckets.push(item);
        bucketMap.set(key, item);
      }

      paymentList.forEach((payment) => {
        const date = getPaymentDate(payment);
        if (!date) return;
        const key = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        ).getTime();
        const bucket = bucketMap.get(key);
        if (bucket) {
          bucket.revenue += Number(payment.jumlah) || 0;
        }
      });

      return buckets.map(({ name, revenue }) => ({ name, revenue }));
    }

    if (period === "weekly") {
      const startOfWeek = (dateValue) => {
        const date = new Date(dateValue);
        const day = date.getDay() || 7;
        date.setDate(date.getDate() - day + 1);
        date.setHours(0, 0, 0, 0);
        return date;
      };

      const thisWeekStart = startOfWeek(now);
      const buckets = [];
      const bucketMap = new Map();

      for (let i = 3; i >= 0; i -= 1) {
        const weekStart = new Date(thisWeekStart);
        weekStart.setDate(thisWeekStart.getDate() - i * 7);
        const key = weekStart.getTime();
        const item = { name: `Minggu ${4 - i}`, revenue: 0, key };
        buckets.push(item);
        bucketMap.set(key, item);
      }

      paymentList.forEach((payment) => {
        const date = getPaymentDate(payment);
        if (!date) return;
        const weekKey = startOfWeek(date).getTime();
        const bucket = bucketMap.get(weekKey);
        if (bucket) {
          bucket.revenue += Number(payment.jumlah) || 0;
        }
      });

      return buckets.map(({ name, revenue }) => ({ name, revenue }));
    }

    const formatter = new Intl.DateTimeFormat("id-ID", { month: "short" });
    const buckets = [];
    const bucketMap = new Map();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const item = { name: formatter.format(date), revenue: 0, key };
      buckets.push(item);
      bucketMap.set(key, item);
    }

    paymentList.forEach((payment) => {
      const date = getPaymentDate(payment);
      if (!date) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.revenue += Number(payment.jumlah) || 0;
      }
    });

    return buckets.map(({ name, revenue }) => ({ name, revenue }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const overview = stats.overview || {};
  const monthStats = stats.month_stats || {};
  const paidPayments = payments.filter(
    (payment) => payment.status === "dibayar",
  );
  const rangeStart = getRangeStart(dateRange);
  const filteredPayments = paidPayments.filter((payment) => {
    const date = getPaymentDate(payment);
    return date && date >= rangeStart;
  });
  const revenueData = buildRevenueData(filteredPayments, chartPeriod);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Laporan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Analisis dan statistik bisnis
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="week">7 Hari</option>
            <option value="month">30 Hari</option>
            <option value="year">Tahun Ini</option>
          </select>
          <Button variant="secondary" leftIcon={Download} size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-linear-to-br from-sky-500 to-indigo-500 text-white">
            <div>
              <p className="text-xs sm:text-sm text-sky-100">
                Total Pendapatan
              </p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {formatPrice(overview.total_pendapatan)}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sky-100 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Bulan ini: {formatPrice(monthStats.total_dibayar)}</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Total Booking
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">
                  {overview.total_pemesanan || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-emerald-600 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Bulan ini: {monthStats.total_pemesanan || 0}</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Total Pengguna
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">
                  {overview.total_users || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Layanan Aktif
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">
                  {overview.total_layanan || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Pendapatan</h3>
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
          height={windowWidth < 640 ? 280 : 350}
        >
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000000}jt`}
            />
            <Tooltip
              formatter={(value) => `Rp ${(value / 1000000).toFixed(1)} juta`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="p-2 sm:p-4 bg-amber-50 rounded-xl text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-amber-600">
            {overview.menunggu || 0}
          </p>
          <p className="text-xs text-amber-600 mt-1">Menunggu</p>
        </div>
        <div className="p-2 sm:p-4 bg-sky-50 rounded-xl text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-sky-600">
            {overview.booking_hari_ini || 0}
          </p>
          <p className="text-xs text-sky-600 mt-1">Hari Ini</p>
        </div>
        <div className="p-2 sm:p-4 bg-emerald-50 rounded-xl text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-emerald-600">
            {overview.selesai || 0}
          </p>
          <p className="text-xs text-emerald-600 mt-1">Selesai</p>
        </div>
        <div className="p-2 sm:p-4 bg-red-50 rounded-xl text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-red-600">
            {overview.dibatalkan || 0}
          </p>
          <p className="text-xs text-red-600 mt-1">Dibatalkan</p>
        </div>
      </div>

      {/* Rating Overview */}
      {overview.rata_rating > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Rating Layanan
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-4xl font-bold text-amber-500">
              {Number(overview.rata_rating || 0).toFixed(1)}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    star <= Math.round(overview.rata_rating || 0)
                      ? "text-amber-400"
                      : "text-slate-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-500">
              dari {overview.selesai || 0} booking selesai
            </p>
          </div>
        </Card>
      )}

      {/* Recent Bookings */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Booking Terbaru
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {recentBookings.length > 0 ? (
            recentBookings.slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                className="border border-slate-200 rounded-xl p-3 sm:p-4 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-sm text-sky-600 font-semibold">
                      {booking.kode_booking}
                    </p>
                    <p className="text-sm text-slate-700 mt-0.5">
                      {booking.nama_pasien || booking.nama_user}
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
                    <span className="text-slate-500">Tanggal:</span>
                    <span className="text-slate-700 font-medium">
                      {formatDate(booking.tanggal)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              Belum ada data booking
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
