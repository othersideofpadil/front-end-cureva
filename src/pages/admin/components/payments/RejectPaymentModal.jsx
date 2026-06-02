import { Button, Modal } from "../../../../components/common";

const RejectPaymentModal = ({
  isOpen,
  rejectReason,
  onReasonChange,
  onClose,
  onConfirm,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Tolak Pembayaran"
    size="md"
    responsive
    footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} className="flex-1">
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
        onChange={(e) => onReasonChange(e.target.value)}
        rows={3}
        placeholder="Masukkan alasan penolakan..."
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
      />
    </div>
  </Modal>
);

export default RejectPaymentModal;
