import { Button, Modal } from "../../../../components/common";

const PaymentDetailModal = ({
  isOpen,
  selectedPayment,
  onClose,
  onConfirm,
  onOpenReject,
  getStatusBadge,
  formatPrice,
}) => (
  <Modal
    isOpen={isOpen && !!selectedPayment}
    onClose={onClose}
    title="Detail Pembayaran"
    size="md"
    responsive
    footerClassName="flex-col sm:flex-row"
    footer={
      selectedPayment?.status === "menunggu" &&
      selectedPayment?.status_pemesanan === "selesai" ? (
        <>
          <Button variant="secondary" onClick={onOpenReject} className="flex-1">
            Tolak
          </Button>
          <Button
            onClick={() =>
              onConfirm(selectedPayment.pemesanan_id || selectedPayment.id)
            }
            className="flex-1"
          >
            Konfirmasi
          </Button>
        </>
      ) : (
        <Button variant="secondary" onClick={onClose} className="flex-1">
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
);

export default PaymentDetailModal;
