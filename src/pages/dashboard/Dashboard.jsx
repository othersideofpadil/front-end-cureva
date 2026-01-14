import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { bookingService, layananService } from "../../services";
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
} from "../../components/common";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [layanan, setLayanan] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [upcomingRes, recentRes, layananRes] = await Promise.all([
        bookingService.getUpcoming(),
        bookingService.getMyBookings({ limit: 5 }),
        layananService.getAll(),
      ]);
      setUpcomingBookings(upcomingRes.data || []);
      setRecentBookings(recentRes.data || []);
      setLayanan(layananRes.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
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

  const stats = [
    {
      label: "Total Booking",
      value: recentBookings.length,
      icon: Calendar,
      color: "bg-sky-500",
      lightColor: "bg-sky-50",
    },
    {
      label: "Selesai",
      value: recentBookings.filter((b) => b.status === "selesai").length,
      icon: CheckCircle,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
    },
    {
      label: "Dibatalkan",
      value: recentBookings.filter(
        (b) => b.status?.includes("dibatalkan") || b.status === "ditolak"
      ).length,
      icon: XCircle,
      color: "bg-red-500",
      lightColor: "bg-red-50",
    },
    {
      label: "Menunggu",
      value: recentBookings.filter((b) => b.status === "menunggu_konfirmasi")
        .length,
      icon: AlertCircle,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-sky-500 to-indigo-500 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Halo, {user?.nama?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sky-100 mt-2">
              Selamat datang kembali di Cureva Fisioterapi
            </p>
          </div>
          <Link to="/bookings/new">
            <Button variant="secondary" size="lg">
              <Plus className="w-5 h-5" />
              Booking Baru
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                  <Icon
                    className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Booking Mendatang
          </h2>
          <Link
            to="/bookings"
            className="text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingBookings.slice(0, 2).map((booking) => (
              <Card
                key={booking.id}
                hover
                padding="none"
                className="overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {booking.nama_layanan || "Fisioterapi"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Kode: {booking.kode_booking}
                      </p>
                    </div>
                    <Badge status={booking.status} size="sm" />
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(booking.tanggal)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {formatTime(booking.waktu)} WIB
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{booking.alamat}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/bookings/${booking.id}`}
                  className="block px-5 py-3 bg-slate-50 text-center text-sky-500 font-medium hover:bg-sky-50 transition-colors"
                >
                  Lihat Detail
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={Calendar}
              title="Tidak ada booking mendatang"
              description="Anda belum memiliki jadwal booking. Yuk buat booking baru!"
              action={() => {}}
              actionLabel="Buat Booking"
            />
          </Card>
        )}
      </motion.div>

      {/* Available Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Layanan Tersedia</h2>
          <Link
            to="/layanan"
            className="text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {layanan.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="aspect-video bg-linear-to-br from-sky-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-sky-400" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {item.nama}
                </h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {item.deskripsi || "Layanan fisioterapi profesional"}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-sky-500">
                    Rp {item.harga?.toLocaleString("id-ID")}
                  </p>
                  <span className="text-sm text-slate-400">
                    {item.durasi} menit
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
