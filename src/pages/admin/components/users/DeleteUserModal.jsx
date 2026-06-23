import { Trash2 } from "lucide-react";
import { Button, Modal } from "../../../../components/common";

const DeleteUserModal = ({
  isOpen,
  selectedUser,
  onClose,
  onConfirm,
  actionLoading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Hapus Pengguna"
    responsive
    // footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={actionLoading}>
          Ya, Hapus
        </Button>
      </>
    }
  >
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-8 h-8 text-red-400" />
      </div>
      <p className="font-semibold text-slate-800 mb-2">
        Hapus <span className="text-red-500">{selectedUser?.nama}</span>?
      </p>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Data pengguna ini akan dihapus permanen dan tidak dapat dipulihkan
        kembali.
      </p>
    </div>
  </Modal>
);

export default DeleteUserModal;
