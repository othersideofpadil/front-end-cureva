import PaymentCard from "./PaymentCard";

const PaymentsGrid = ({
  payments,
  onOpenDetail,
  onConfirm,
  onRejectOpen,
  onDelete,
  formatPrice,
  formatDate,
  getStatusBadge,
}) => (
  <div className="rounded-2xl border border-slate-100 bg-white">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          onOpenDetail={onOpenDetail}
          onConfirm={onConfirm}
          onRejectOpen={onRejectOpen}
          onDelete={onDelete}
          formatPrice={formatPrice}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>

    {payments.length === 0 && (
      <div className="text-center py-12 text-slate-500">
        <p>Tidak ada data pembayaran</p>
      </div>
    )}
  </div>
);

export default PaymentsGrid;
