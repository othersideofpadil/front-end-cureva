import { Modal, Button } from "../../../../components/common";

const DeleteRatingModal = ({ isOpen, onClose, onConfirm, saving }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Hapus Rating"
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button variant="secondary" onClick={onConfirm} loading={saving}>
          Hapus
        </Button>
      </>
    }
  >
    <p className="text-sm text-slate-600">
      Rating dan review ini akan dihapus permanen. Yakin ingin melanjutkan?
    </p>
  </Modal>
);

export default DeleteRatingModal;
