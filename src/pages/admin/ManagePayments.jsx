import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CreditCard,
  Check,
  X,
  Eye,
  Clock,
  AlertCircle,
  DollarSign,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { paymentService } from "../../services";
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
        error.response?.data?.message || "Gagal mengkonfirmasi pembayaran"
      );
    }
  };

  const handleRejectPayment = async (pemesananId) => {
    const reason = window.prompt("Alasan penolakan:");
    if (!reason) return;

    try {
      await paymentService.reject(pemesananId, reason);
      toast.success("Pembayaran ditolak");
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      toast.error("Gagal menolak pembayaran");
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
    const statusMap = {
      menunggu: { variant: "warning", label: "Menunggu" },
      dibayar: { variant: "success", label: "Dibayar" },
      gagal: { variant: "danger", label: "Gagal" },
    };
    const s = statusMap[status] || { variant: "secondary", label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
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

      {/* Payments Table */}
      <Card padding="none">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Kode Booking
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Pelanggan
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Metode
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Jumlah
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                  Tanggal
                </th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-sky-600">
                      {payment.kode_booking}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {payment.nama_pasien || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {payment.metode || "Transfer"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {formatPrice(payment.jumlah)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowModal(true);
                        }}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === "menunggu" && (
                        <>
                          <button
                            onClick={() =>
                              handleConfirmPayment(
                                payment.pemesanan_id || payment.id
                              )
                            }
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectPayment(
                                payment.pemesanan_id || payment.id
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm text-sky-600 font-semibold">
                    {payment.kode_booking}
                  </span>
                  <p className="text-sm text-slate-700 mt-1">
                    {payment.nama_pasien || "-"}
                  </p>
                </div>
                {getStatusBadge(payment.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="text-slate-700">
                    {payment.metode || "Transfer"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah:</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(payment.jumlah)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="text-slate-600">
                    {formatDate(payment.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Detail
                </button>
                {payment.status === "menunggu" && (
                  <>
                    <button
                      onClick={() =>
                        handleConfirmPayment(payment.pemesanan_id || payment.id)
                      }
                      className="flex-1 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Konfirmasi
                    </button>
                    <button
                      onClick={() =>
                        handleRejectPayment(payment.pemesanan_id || payment.id)
                      }
                      className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Tidak ada data pembayaran</p>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                Detail Pembayaran
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
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
                    {selectedPayment.nama_user || "-"}
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

              {selectedPayment.status === "menunggu" && (
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleRejectPayment(
                        selectedPayment.pemesanan_id || selectedPayment.id
                      )
                    }
                    className="flex-1"
                  >
                    Tolak
                  </Button>
                  <Button
                    onClick={() =>
                      handleConfirmPayment(
                        selectedPayment.pemesanan_id || selectedPayment.id
                      )
                    }
                    className="flex-1"
                  >
                    Konfirmasi
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
