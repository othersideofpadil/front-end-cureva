import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CreditCard,
  Check,
  X,
  Eye,
  Clock,
  DollarSign,
  Filter,
  Trash2,
} from "lucide-react";
import { paymentService } from "../../services";
import toast from "react-hot-toast";
import {
  Card,
  Button,
  LoadingSpinner,
  Badge,
  Modal,
} from "../../components/common";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAll();
      setPayments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (pemesananId) => {
    try {
      await paymentService.confirm(pemesananId);
      toast.success("Pembayaran berhasil dikonfirmasi");
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengkonfirmasi pembayaran",
      );
    }
  };

  const handleRejectPayment = async (pemesananId, reason) => {
    if (!reason?.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    try {
      await paymentService.reject(pemesananId, reason.trim());
      toast.success("Pembayaran ditolak");
      fetchPayments();
      setShowModal(false);
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      toast.error("Gagal menolak pembayaran");
    }
  };

  const handleDeletePayment = async () => {
    if (!deleteTarget) return;
    try {
      await paymentService.delete(deleteTarget.id);
      toast.success("Pembayaran berhasil dihapus");
      fetchPayments();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal menghapus pembayaran",
      );
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    return <Badge status={status} showIcon={false} />;
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.kode_booking?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nama_user?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "menunggu").length,
    confirmed: payments.filter((p) => p.status === "dibayar").length,
    totalAmount: payments
      .filter((p) => p.status === "dibayar")
      .reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0),
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kelola Pembayaran</h1>
        <p className="text-slate-500">
          Verifikasi dan kelola pembayaran booking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-slate-200 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Transaksi</p>
            </div>
          </div>
        </Card>
        <Card className="bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-amber-200 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-sm text-amber-600">Menunggu Verifikasi</p>
            </div>
          </div>
        </Card>
        <Card className="bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-emerald-200 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.confirmed}
              </p>
              <p className="text-sm text-emerald-600">Dikonfirmasi</p>
            </div>
          </div>
        </Card>
        <Card className="bg-sky-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-sky-200 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-sky-600" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xl font-bold text-sky-600 truncate">
                {formatPrice(stats.totalAmount)}
              </p>
              <p className="text-sm text-sky-600">Total Pendapatan</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode booking atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="dibayar">Dibayar</option>
              <option value="gagal">Gagal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payments Cards */}
      <Card padding="none">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="border border-slate-100 rounded-2xl p-4 hover:shadow-sm hover:border-slate-200 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-sm text-sky-600 font-semibold">
                    {payment.kode_booking}
                  </span>
                  <p className="text-sm text-slate-700 mt-1">
                    {payment.nama_pasien || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Status:</span>
                  {getStatusBadge(payment.status)}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode</span>
                  <span className="text-slate-700">
                    {payment.metode || "Transfer"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(payment.jumlah)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>
                  <span className="text-slate-600">
                    {formatDate(payment.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowModal(true);
                  }}
                  className="flex-1 min-w-30 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Detail
                </button>
                {payment.status === "menunggu" &&
                  payment.status_pemesanan === "selesai" && (
                    <>
                      <button
                        onClick={() =>
                          handleConfirmPayment(
                            payment.pemesanan_id || payment.id,
                          )
                        }
                        className="flex-1 min-w-35 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Konfirmasi
                      </button>
                      <button
                        onClick={() =>
                          (() => {
                            setSelectedPayment(payment);
                            setRejectReason("");
                            setShowRejectModal(true);
                          })()
                        }
                        className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                <button
                  onClick={() => {
                    setDeleteTarget(payment);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>Tidak ada data pembayaran</p>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal && !!selectedPayment}
        onClose={() => setShowModal(false)}
        title="Detail Pembayaran"
        size="md"
        responsive
        footerClassName="flex-col sm:flex-row"
        footer={
          selectedPayment?.status === "menunggu" &&
          selectedPayment?.status_pemesanan === "selesai" ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setRejectReason("");
                  setShowRejectModal(true);
                }}
                className="flex-1"
              >
                Tolak
              </Button>
              <Button
                onClick={() =>
                  handleConfirmPayment(
                    selectedPayment.pemesanan_id || selectedPayment.id,
                  )
                }
                className="flex-1"
              >
                Konfirmasi
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Tutup
            </Button>
          )
        }
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Kode Booking</p>
                <p className="font-semibold text-slate-800">
                  {selectedPayment.kode_booking}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div>
                <p className="text-slate-500">Pelanggan</p>
                <p className="font-semibold text-slate-800">
                  {selectedPayment.nama_pasien || "-"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Metode</p>
                <p className="font-semibold text-slate-800">
                  {selectedPayment.metode || "Transfer"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-500">Jumlah</p>
                <p className="text-2xl font-bold text-sky-600">
                  {formatPrice(selectedPayment.jumlah)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        title="Hapus Pembayaran"
        size="md"
        responsive
        footerClassName="flex-col sm:flex-row"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePayment}
              className="flex-1"
            >
              Hapus
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus pembayaran ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          {deleteTarget && (
            <div className="p-3 bg-slate-50 rounded-xl text-sm">
              <p className="font-semibold text-slate-800">
                {deleteTarget.kode_booking}
              </p>
              <p className="text-slate-500">
                {deleteTarget.nama_pasien || "-"} · {deleteTarget.metode || "-"}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason("");
        }}
        title="Tolak Pembayaran"
        size="md"
        responsive
        footerClassName="flex-col sm:flex-row"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                handleRejectPayment(
                  selectedPayment?.pemesanan_id || selectedPayment?.id,
                  rejectReason,
                )
              }
              className="flex-1"
            >
              Tolak Pembayaran
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Berikan alasan penolakan agar pasien memahami status pembayarannya.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Masukkan alasan penolakan..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ManagePayments;
