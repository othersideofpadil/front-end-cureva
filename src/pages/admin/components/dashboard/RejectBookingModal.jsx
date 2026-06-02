import { Modal, Button } from "../../../../components/common";

const RejectBookingModal = ({
  isOpen,
  bookingCode,
  rejectReason,
  onRejectReasonChange,
  onClose,
  onConfirm,
  actionLoading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <div>
        <h2 className="text-base font-bold text-slate-800">Tolak Booking</h2>
        {bookingCode && (
          <p className="text-xs text-slate-400 mt-0.5">{bookingCode}</p>
        )}
      </div>
    }
    responsive
    footer={
      <div className="flex gap-2 w-full">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Batal
        </Button>
        <Button className="flex-1" onClick={onConfirm} loading={actionLoading}>
          Tolak
        </Button>
      </div>
    }
  >
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        Alasan Penolakan
        <span className="text-red-400 ml-0.5">*</span>
      </label>
      <textarea
        value={rejectReason}
        onChange={(e) => onRejectReasonChange(e.target.value)}
        rows={3}
        placeholder="Masukkan alasan penolakan..."
        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
      />
    </div>
  </Modal>
);

export default RejectBookingModal;
