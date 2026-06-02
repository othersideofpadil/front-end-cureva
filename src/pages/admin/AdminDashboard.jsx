import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { adminService, bookingService } from "../../services";
import { LoadingSpinner } from "../../components/common";
import {
  quickStatsFromData,
  statCardsFromData,
} from "../../utils/constants/index.js";
import {
  BookingChart,
  BookingDetailModal,
  DashboardHeader,
  RecentBookings,
  StatCards,
  QuickStats,
  RejectBookingModal,
} from "./components/dashboard";

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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
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
    if (!booking) return;
    setActionLoading(true);
    try {
      await bookingService.updateStatus(booking.id, "ditolak", {
        alasan_penolakan: rejectReason.trim(),
      });
      toast.success("Booking ditolak");
      fetchDashboardData();
      setShowRejectModal(false);
      setSelectedBooking(null);
      setRejectReason("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menolak booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    handleQuickReject(selectedBooking);
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

  const statCards = statCardsFromData(stats);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader />

      <StatCards statCards={statCards} />

      <QuickStats items={quickStatsFromData(stats)} />

      <BookingChart
        chartPeriod={chartPeriod}
        onPeriodChange={setChartPeriod}
        chartData={chartData}
        windowWidth={windowWidth}
      />

      <RecentBookings
        bookings={sortedRecentBookings}
        pendingCount={pendingCount}
        onDetail={(booking) => {
          setSelectedBooking(booking);
          setShowDetailModal(true);
        }}
        onQuickConfirm={handleQuickConfirm}
        onQuickReject={handleOpenReject}
        actionLoading={actionLoading}
      />

      <BookingDetailModal
        isOpen={showDetailModal}
        selectedBooking={selectedBooking}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
        onQuickConfirm={handleQuickConfirm}
        onQuickReject={handleOpenReject}
        actionLoading={actionLoading}
      />

      <RejectBookingModal
        isOpen={showRejectModal}
        bookingCode={selectedBooking?.kode_booking}
        rejectReason={rejectReason}
        onRejectReasonChange={setRejectReason}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedBooking(null);
          setRejectReason("");
        }}
        onConfirm={handleConfirmReject}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;
