import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
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
  Filter,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import {
  Badge,
  LoadingSpinner,
  EmptyState,
  Modal,
  Button,
} from "../../components/common";

/* ─── helpers ────────────────────────────────────────────────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (t) => t?.slice(0, 5) || "";

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

const getValidStatusTransitions = (current) => {
  const t = {
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
  return t[current] || [];
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

/* ─── InfoBlock ──────────────────────────────────────────────── */
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

/* ─── Booking Card ───────────────────────────────────────────── */
const BookingCard = ({
  booking,
  onDetail,
  onQuickAction,
  onOpenStatus,
  onOpenDelete,
}) => {
  const isDone =
    booking.status === "selesai" ||
    booking.status === "ditolak" ||
    booking.status.includes("dibatalkan");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* accent */}
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
        <div className="grid gap-2 mt-1 sm:flex sm:items-center sm:justify-between">
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

        {/* quick confirm/reject */}
        {booking.status === "menunggu_konfirmasi" && (
          <>
            <button
              onClick={() => onQuickAction(booking, "dikonfirmasi")}
              className="px-4 py-2.5 text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Konfirmasi"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenStatus(booking, "ditolak")}
              className="px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
              title="Tolak"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        {/* update status */}
        {!isDone && booking.status !== "menunggu_konfirmasi" && (
          <button
            onClick={() => onOpenStatus(booking, "")}
            className="px-4 py-2.5 text-sky-600 hover:bg-sky-50 text-xs font-semibold transition-colors"
          >
            Update
          </button>
        )}

        {/* delete */}
        {isDone && (
          <button
            onClick={() => onOpenDelete(booking)}
            className="px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Main ───────────────────────────────────────────────────── */
const ManageBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
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

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getAll();
      setBookings(res.data || []);
    } catch {
      toast.error("Gagal memuat data booking");
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings
    .filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        b.kode_booking?.toLowerCase().includes(q) ||
        b.nama_pasien?.toLowerCase().includes(q) ||
        b.nama_layanan?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const aTime = a.created_at
        ? new Date(a.created_at).getTime()
        : new Date(`${a.tanggal}T${a.waktu}`).getTime();
      const bTime = b.created_at
        ? new Date(b.created_at).getTime()
        : new Date(`${b.tanggal}T${b.waktu}`).getTime();
      return bTime - aTime;
    });

  /* stats */
  const stats = [
    { label: "Total", value: bookings.length },
    {
      label: "Menunggu",
      value: bookings.filter((b) => b.status === "menunggu_konfirmasi").length,
    },
    {
      label: "Berlangsung",
      value: bookings.filter((b) =>
        [
          "dikonfirmasi",
          "dijadwalkan",
          "dalam_perjalanan",
          "sedang_berlangsung",
        ].includes(b.status),
      ).length,
    },
    {
      label: "Selesai",
      value: bookings.filter((b) => b.status === "selesai").length,
    },
  ];

  const handleQuickAction = async (booking, status) => {
    setActionLoading(true);
    try {
      await bookingService.updateStatus(booking.id, status);
      toast.success(
        `Booking berhasil ${status === "dikonfirmasi" ? "dikonfirmasi" : "ditolak"}`,
      );
      fetchBookings();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenStatus = (booking, presetStatus = "") => {
    setSelectedBooking(booking);
    setNewStatus(presetStatus);
    setAlasan("");
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Pilih status terlebih dahulu");
      return;
    }
    if (
      ["ditolak", "dibatalkan_sistem"].includes(newStatus) &&
      !alasan.trim()
    ) {
      toast.error("Alasan wajib diisi");
      return;
    }
    setActionLoading(true);
    try {
      await bookingService.updateStatus(selectedBooking.id, newStatus, alasan);
      toast.success("Status berhasil diperbarui");
      fetchBookings();
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus("");
      setAlasan("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal memperbarui status");
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
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menghapus booking");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Kelola Pemesanan
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Kelola semua pemesanan fisioterapi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-100 rounded-2xl px-3 py-3 sm:px-4 shadow-sm text-center"
          >
            <p className="text-lg sm:text-2xl font-bold text-slate-800">
              {s.value}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium leading-tight">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode, pasien, atau layanan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border rounded-xl transition-colors shadow-sm ${
              statusFilter !== "all"
                ? "bg-sky-50 border-sky-200 text-sky-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">
              {statusFilter === "all"
                ? "Filter"
                : statusOptions.find((o) => o.value === statusFilter)?.label}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20"
              >
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      statusFilter === opt.value
                        ? "text-sky-600 bg-sky-50 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-medium">
            {search || statusFilter !== "all"
              ? "Tidak ada booking yang sesuai filter"
              : "Belum ada booking"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onDetail={(b) => {
                  setSelectedBooking(b);
                  setShowDetailModal(true);
                }}
                onQuickAction={handleQuickAction}
                onOpenStatus={handleOpenStatus}
                onOpenDelete={(b) => {
                  setSelectedBooking(b);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

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
      >
        {selectedBooking && (
          <div className="space-y-3">
            {/* status badge */}
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

      {/* ── Update Status Modal ── */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedBooking(null);
          setNewStatus("");
          setAlasan("");
        }}
        title={
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Update Status
            </h2>
            {selectedBooking?.kode_booking && (
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedBooking.kode_booking}
              </p>
            )}
          </div>
        }
        responsive
        footerClassName="flex-col sm:flex-row"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowStatusModal(false);
                setNewStatus("");
                setAlasan("");
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdateStatus}
              loading={actionLoading}
              className="flex-1"
            >
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Status Baru
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition bg-white"
            >
              <option value="">Pilih Status</option>
              {selectedBooking &&
                getValidStatusTransitions(selectedBooking.status).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
            {selectedBooking &&
              getValidStatusTransitions(selectedBooking.status).length ===
                0 && (
                <p className="mt-2 text-xs text-slate-400">
                  Status tidak dapat diubah lagi
                </p>
              )}
          </div>

          {["ditolak", "dibatalkan_sistem"].includes(newStatus) && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {newStatus === "ditolak"
                  ? "Alasan Penolakan"
                  : "Alasan Pembatalan"}
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={3}
                placeholder={
                  newStatus === "ditolak"
                    ? "Masukkan alasan penolakan…"
                    : "Masukkan alasan pembatalan…"
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
              />
            </div>
          )}
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBooking(null);
        }}
        title={
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Hapus Booking
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>
        }
        responsive
        footerClassName="flex-col sm:flex-row"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBooking(null);
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={actionLoading}
              className="flex-1"
            >
              Hapus
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus booking ini? Data yang sudah
              dihapus tidak dapat dikembalikan.
            </p>
          </div>
          {selectedBooking && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {selectedBooking.kode_booking}
              </span>
              <p className="font-semibold text-slate-800 mt-1 text-sm">
                {selectedBooking.nama_pasien}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedBooking.nama_layanan}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageBookings;
