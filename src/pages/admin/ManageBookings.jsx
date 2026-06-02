import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import { LoadingSpinner } from "../../components/common";
import {
  BOOKING_STATUS_FILTER_OPTIONS,
  getValidStatusTransitions,
} from "../../utils/constants";
import {
  BookingDetailModal,
  BookingFilters,
  BookingGrid,
  BookingStats,
  BookingsHeader,
  DeleteBookingModal,
  UpdateStatusModal,
} from "./components/bookings";

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
  const [catatanAdmin, setCatatanAdmin] = useState("");
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
    .filter((booking) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        booking.kode_booking?.toLowerCase().includes(q) ||
        booking.nama_pasien?.toLowerCase().includes(q) ||
        booking.nama_layanan?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" || booking.status === statusFilter;
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
    setCatatanAdmin("");
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
    if (newStatus === "selesai" && !catatanAdmin.trim()) {
      toast.error("Catatan progres wajib diisi");
      return;
    }
    setActionLoading(true);
    try {
      const payload = {};
      if (["ditolak", "dibatalkan_sistem"].includes(newStatus)) {
        payload.alasan_penolakan = alasan.trim();
      }
      if (newStatus === "selesai") {
        payload.catatan_admin = catatanAdmin.trim();
      }

      await bookingService.updateStatus(selectedBooking.id, newStatus, payload);
      toast.success("Status berhasil diperbarui");
      fetchBookings();
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus("");
      setAlasan("");
      setCatatanAdmin("");
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

  const statusTransitions = selectedBooking
    ? getValidStatusTransitions(selectedBooking.status)
    : [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <BookingsHeader />

      <BookingStats stats={stats} />

      <BookingFilters
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch("")}
        statusFilter={statusFilter}
        statusOptions={BOOKING_STATUS_FILTER_OPTIONS}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onSelectStatus={(value) => {
          setStatusFilter(value);
          setShowFilters(false);
        }}
      />

      <BookingGrid
        bookings={filtered}
        search={search}
        statusFilter={statusFilter}
        onDetail={(booking) => {
          setSelectedBooking(booking);
          setShowDetailModal(true);
        }}
        onQuickAction={handleQuickAction}
        onOpenStatus={handleOpenStatus}
        onOpenDelete={(booking) => {
          setSelectedBooking(booking);
          setShowDeleteModal(true);
        }}
      />

      <BookingDetailModal
        isOpen={showDetailModal}
        selectedBooking={selectedBooking}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
      />

      <UpdateStatusModal
        isOpen={showStatusModal}
        selectedBooking={selectedBooking}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        alasan={alasan}
        onAlasanChange={setAlasan}
        catatanAdmin={catatanAdmin}
        onCatatanAdminChange={setCatatanAdmin}
        statusOptions={statusTransitions}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedBooking(null);
          setNewStatus("");
          setAlasan("");
          setCatatanAdmin("");
        }}
        onSave={handleUpdateStatus}
        actionLoading={actionLoading}
      />

      <DeleteBookingModal
        isOpen={showDeleteModal}
        selectedBooking={selectedBooking}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleDelete}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default ManageBookings;
