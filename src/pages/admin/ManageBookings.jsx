import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  Trash2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import {
  Card,
  Button,
  Input,
  Badge,
  LoadingSpinner,
  Modal,
  EmptyState,
} from "../../components/common";
import axios from "axios";

const ManageBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [alasan, setAlasan] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, search, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAll();
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
          b.nama_pasien?.toLowerCase().includes(searchLower) ||
          b.nama_layanan?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Pilih status terlebih dahulu");
      return;
    }

    setActionLoading(true);
    try {
      await bookingService.updateStatus(selectedBooking.id, newStatus, alasan);
      toast.success("Status booking berhasil diperbarui");
      fetchBookings();
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus("");
      setAlasan("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickAction = async (booking, status) => {
    setActionLoading(true);
    try {
      await bookingService.updateStatus(booking.id, status);
      toast.success(
        `Booking berhasil ${
          status === "dikonfirmasi" ? "dikonfirmasi" : "ditolak"
        }`,
      );
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await bookingService.delete(selectedBooking.id);
      toast.success("Booking berhasil dihapus");
      fetchBookings();
      setShowDeleteModal(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus booking");
    } finally {
      setActionLoading(false);
    }
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

  // Valid status transitions based on backend rules
  const getValidStatusTransitions = (currentStatus) => {
    const transitions = {
      menunggu_konfirmasi: [
        { value: "dikonfirmasi", label: "Dikonfirmasi" },
        { value: "ditolak", label: "Ditolak" },
      ],
      dikonfirmasi: [
        { value: "dijadwalkan", label: "Dijadwalkan" },
        { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
        { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
        { value: "selesai", label: "Selesai" },
        { value: "dibatalkan_sistem", label: "Dibatalkan" },
      ],
      dijadwalkan: [
        { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
        { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
        { value: "selesai", label: "Selesai" },
        { value: "dibatalkan_sistem", label: "Dibatalkan" },
      ],
      dalam_perjalanan: [
        { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
        { value: "selesai", label: "Selesai" },
        { value: "dibatalkan_sistem", label: "Dibatalkan" },
      ],
      sedang_berlangsung: [{ value: "selesai", label: "Selesai" }],
      selesai: [],
      ditolak: [],
      dibatalkan_pasien: [],
      dibatalkan_sistem: [],
    };

    return transitions[currentStatus] || [];
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kelola Pemesanan</h1>
        <p className="text-slate-500">Kelola semua pemesanan fisioterapi</p>
      </div>

      {/* Search & Filter */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari kode booking, pasien, atau layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
            />
          </div>
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
      </Card>

      {/* Bookings Cards (responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full py-8">
            <EmptyState
              icon={Calendar}
              title="Tidak ada booking"
              description="Tidak ada booking yang sesuai dengan filter"
            />
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="p-5 sm:p-6 hover:bg-slate-50 h-full rounded-lg shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-sm sm:text-base font-semibold text-slate-800 truncate">
                      {booking.kode_booking}
                    </p>
                    <p className="font-medium text-base sm:text-lg text-slate-700 truncate">
                      {booking.nama_pasien}
                    </p>
                  </div>
                  <div className="ml-3 shrink-0">
                    <Badge status={booking.status} size="sm" />
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Layanan</span>
                    <span className="text-slate-700 font-semibold ml-3 text-right truncate">
                      {booking.nama_layanan}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-sm text-slate-500 mb-1">
                      Keluhan
                    </p>
                    <p
                      className="text-sm sm:text-base text-slate-700 leading-relaxed"
                      title={booking.keluhan}
                    >
                      {booking.keluhan || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-sm text-slate-500 mb-1">
                      Alamat
                    </p>
                    <p
                      className="text-sm sm:text-base text-slate-700 leading-relaxed"
                      title={booking.alamat}
                    >
                      {booking.alamat || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500 font-medium">Jadwal</span>
                    <div className="text-right">
                      <p className="font-semibold text-base sm:text-lg text-slate-800">
                        {formatDate(booking.tanggal)}
                      </p>
                      <p className="text-sm sm:text-sm text-slate-500">
                        {formatTime(booking.waktu)} WIB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetailModal(true);
                  }}
                  className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                  title="Lihat Detail"
                >
                  <Eye className="w-5 h-5" />
                </button>

                {booking.status === "menunggu_konfirmasi" && (
                  <>
                    <button
                      onClick={() => handleQuickAction(booking, "dikonfirmasi")}
                      className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Konfirmasi"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setNewStatus("ditolak");
                        setShowStatusModal(true);
                      }}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Tolak"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}

                {booking.status !== "selesai" &&
                  booking.status !== "ditolak" &&
                  !booking.status.includes("dibatalkan") && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowStatusModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                    >
                      Update
                    </button>
                  )}

                {(booking.status === "ditolak" ||
                  booking.status.includes("dibatalkan")) && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDeleteModal(true);
                    }}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
        title="Detail Booking"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-slate-800">
                {selectedBooking.kode_booking}
              </span>
              <Badge status={selectedBooking.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Pasien</span>
                </div>
                <p className="font-medium text-slate-800">
                  {selectedBooking.nama_pasien}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedBooking.email_pasien}
                </p>
                {selectedBooking.telepon_pasien && (
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedBooking.telepon_pasien}
                  </p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Jadwal</span>
                </div>
                <p className="font-medium text-slate-800">
                  {formatDate(selectedBooking.tanggal)}
                </p>
                <p className="text-sm text-slate-500">
                  {formatTime(selectedBooking.waktu)} WIB
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Layanan</span>
              </div>
              <p className="font-medium text-slate-800">
                {selectedBooking.nama_layanan}
              </p>
              {selectedBooking.harga_layanan && (
                <p className="text-sm text-slate-500 mt-1">
                  Rp {selectedBooking.harga_layanan?.toLocaleString("id-ID")}
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Alamat</span>
              </div>
              <p className="font-medium text-slate-800">
                {selectedBooking.alamat}
              </p>
              {selectedBooking.koordinat && (
                <a
                  href={selectedBooking.koordinat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-sky-600 hover:text-sky-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka di Google Maps
                </a>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Keluhan</p>
              <p className="text-slate-800">{selectedBooking.keluhan}</p>
            </div>

            {selectedBooking.catatan_tambahan && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Catatan Tambahan</p>
                <p className="text-slate-800">
                  {selectedBooking.catatan_tambahan}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-slate-600">Total Biaya</span>
              <span className="text-xl font-bold text-sky-500">
                Rp{" "}
                {(selectedBooking.harga_layanan || 0).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedBooking(null);
          setNewStatus("");
          setAlasan("");
        }}
        title="Update Status"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowStatusModal(false);
                setNewStatus("");
                setAlasan("");
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateStatus} loading={actionLoading}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status Baru
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Pilih Status</option>
              {selectedBooking &&
                getValidStatusTransitions(selectedBooking.status).map(
                  (option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ),
                )}
            </select>
            {selectedBooking &&
              getValidStatusTransitions(selectedBooking.status).length ===
                0 && (
                <p className="mt-2 text-sm text-slate-500">
                  Status tidak dapat diubah lagi
                </p>
              )}
          </div>

          {newStatus === "ditolak" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alasan Penolakan
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={3}
                placeholder="Masukkan alasan penolakan..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBooking(null);
        }}
        title="Hapus Booking"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBooking(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={actionLoading}
            >
              Hapus
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          {selectedBooking && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-mono text-sm font-medium text-slate-800">
                {selectedBooking.kode_booking}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {selectedBooking.nama_pasien} - {selectedBooking.nama_layanan}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageBookings;
