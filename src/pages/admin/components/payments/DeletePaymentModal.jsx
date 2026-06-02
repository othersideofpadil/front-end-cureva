import { Button, Modal } from "../../../../components/common";

const DeletePaymentModal = ({
  isOpen,
  deleteTarget,
  onClose,
  onConfirm,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Hapus Pembayaran"
    size="md"
    responsive
    footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} className="flex-1">
          Hapus
        </Button>
      </>
    }
  >
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus pembayaran ini? Tindakan ini tidak
        dapat dibatalkan.
      </p>
      {deleteTarget && (
        <div className="p-3 bg-slate-50 rounded-xl text-sm">
          <p className="font-semibold text-slate-800">
            {deleteTarget.kode_booking}
          </p>
          <p className="text-slate-500">
            {deleteTarget.nama_pasien || "-"} - {deleteTarget.metode || "-"}
          </p>
        </div>
      )}
    </div>
  </Modal>
);

export default DeletePaymentModal;
