import { Clock } from "lucide-react";
import { Modal, Button } from "../../../../components/common";

const DeleteSlotModal = ({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  deletingSlot,
  formatTime,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Hapus Slot"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={submitting}>
          Hapus
        </Button>
      </>
    }
  >
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Slot ini akan dihapus secara permanen dan tidak dapat dikembalikan.
      </p>
      {deletingSlot && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {formatTime(deletingSlot.waktu_mulai)} -
              {` ${formatTime(deletingSlot.waktu_selesai)}`}
            </p>
            <p className="text-xs text-slate-400">
              {deletingSlot.tanggal} - {deletingSlot.status}
            </p>
          </div>
        </div>
      )}
    </div>
  </Modal>
);

export default DeleteSlotModal;
