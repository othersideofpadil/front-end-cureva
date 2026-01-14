import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Plus,
  Eye,
  ChevronDown,
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
          b.alamat?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5) || "";
  };

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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Saya</h1>
          <p className="text-slate-500">
            Kelola semua pemesanan fisioterapi Anda
          </p>
        </div>
        <Link to="/bookings/new">
          <Button>
            <Plus className="w-5 h-5" />
            Booking Baru
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari kode booking, layanan, atau alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filter
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10"
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                          statusFilter === option.value
                            ? "text-sky-600 bg-sky-50"
                            : "text-slate-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover padding="none" className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {booking.nama_layanan || "Fisioterapi"}
                          </p>
                          <p className="text-sm text-slate-400">
                            {booking.kode_booking}
                          </p>
                        </div>
                        <Badge status={booking.status} />
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(booking.tanggal)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {formatTime(booking.waktu)} WIB
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="truncate max-w-50">
                            {booking.alamat}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="secondary" size="sm">
                          <Eye className="w-4 h-4" />
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Biaya</span>
                  <span className="font-bold text-slate-800">
                    Rp {(booking.harga_layanan || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Calendar}
            title="Tidak ada booking"
            description={
              search || statusFilter !== "all"
                ? "Tidak ada booking yang sesuai dengan filter"
                : "Anda belum memiliki riwayat booking"
            }
            action={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            actionLabel="Reset Filter"
          />
        </Card>
      )}
    </div>
  );
};

export default BookingList;
