import { AlertCircle } from "lucide-react";
import { Modal, Button } from "../../../../components/common";

const DeleteLayananModal = ({
  isOpen,
  selectedLayanan,
  onClose,
  onConfirm,
  actionLoading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <div>
        <h2 className="text-base font-bold text-slate-800">Hapus Layanan</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tindakan ini tidak dapat dibatalkan
        </p>
      </div>
    }
    responsive
    // footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={actionLoading}
          className="flex-1"
        >
          Hapus
        </Button>
      </>
    }
  >
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 leading-relaxed">
          Apakah Anda yakin ingin menghapus layanan ini? Data yang sudah dihapus
          tidak dapat dikembalikan.
        </p>
      </div>
      {selectedLayanan && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="font-semibold text-slate-800 text-sm">
            {selectedLayanan.nama}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedLayanan.kategori || "Tidak ada kategori"}
          </p>
        </div>
      )}
    </div>
  </Modal>
);

export default DeleteLayananModal;