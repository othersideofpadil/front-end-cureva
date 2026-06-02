import { Check, Eye, Trash2, X } from "lucide-react";

const PaymentCard = ({
  payment,
  onOpenDetail,
  onConfirm,
  onRejectOpen,
  onDelete,
  formatPrice,
  formatDate,
  getStatusBadge,
}) => (
  <div className="border border-slate-100 rounded-2xl p-4 hover:shadow-sm hover:border-slate-200 transition">
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
        <span className="text-slate-700">{payment.metode || "Transfer"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Jumlah</span>
        <span className="font-semibold text-slate-800">
          {formatPrice(payment.jumlah)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Tanggal</span>
        <span className="text-slate-600">{formatDate(payment.created_at)}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={() => onOpenDetail(payment)}
        className="flex-1 min-w-30 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Detail
      </button>
      {payment.status === "menunggu" &&
        payment.status_pemesanan === "selesai" && (
          <>
            <button
              onClick={() => onConfirm(payment.pemesanan_id || payment.id)}
              className="flex-1 min-w-35 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Konfirmasi
            </button>
            <button
              onClick={() => onRejectOpen(payment)}
              className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      <button
        onClick={() => onDelete(payment)}
        className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default PaymentCard;
