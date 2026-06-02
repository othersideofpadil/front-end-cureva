import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentService } from "../../services";
import { Badge, LoadingSpinner } from "../../components/common";
import {
  DeletePaymentModal,
  PaymentDetailModal,
  PaymentsFilters,
  PaymentsGrid,
  PaymentsHeader,
  PaymentsStats,
  RejectPaymentModal,
} from "./components/payments";

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
    } catch {
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

  const getStatusBadge = (status) => <Badge status={status} showIcon={false} />;

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.kode_booking?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.nama_user?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <PaymentsHeader />

      <PaymentsStats stats={stats} formatPrice={formatPrice} />

      <PaymentsFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      <PaymentsGrid
        payments={filteredPayments}
        onOpenDetail={(payment) => {
          setSelectedPayment(payment);
          setShowModal(true);
        }}
        onConfirm={handleConfirmPayment}
        onRejectOpen={(payment) => {
          setSelectedPayment(payment);
          setRejectReason("");
          setShowRejectModal(true);
        }}
        onDelete={(payment) => {
          setDeleteTarget(payment);
          setShowDeleteModal(true);
        }}
        formatPrice={formatPrice}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

      <PaymentDetailModal
        isOpen={showModal}
        selectedPayment={selectedPayment}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmPayment}
        onOpenReject={() => {
          setRejectReason("");
          setShowRejectModal(true);
        }}
        getStatusBadge={getStatusBadge}
        formatPrice={formatPrice}
      />

      <DeletePaymentModal
        isOpen={showDeleteModal}
        deleteTarget={deleteTarget}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeletePayment}
      />

      <RejectPaymentModal
        isOpen={showRejectModal}
        rejectReason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason("");
        }}
        onConfirm={() =>
          handleRejectPayment(
            selectedPayment?.pemesanan_id || selectedPayment?.id,
            rejectReason,
          )
        }
      />
    </div>
  );
};

export default ManagePayments;
