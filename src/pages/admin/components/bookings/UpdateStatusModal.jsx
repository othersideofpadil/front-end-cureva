import { Modal, Button } from "../../../../components/common";

const UpdateStatusModal = ({
  isOpen,
  selectedBooking,
  newStatus,
  onStatusChange,
  alasan,
  onAlasanChange,
  catatanAdmin,
  onCatatanAdminChange,
  statusOptions,
  onClose,
  onSave,
  actionLoading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <div>
        <h2 className="text-base font-bold text-slate-800">Update Status</h2>
        {selectedBooking?.kode_booking && (
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedBooking.kode_booking}
          </p>
        )}
      </div>
    }
    responsive
    footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button onClick={onSave} loading={actionLoading} className="flex-1">
          Simpan
        </Button>
      </>
    }
  >
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Status Baru
        </label>
        <select
          value={newStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition bg-white"
        >
          <option value="">Pilih Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {statusOptions.length === 0 && (
          <p className="mt-2 text-xs text-slate-400">
            Status tidak dapat diubah lagi
          </p>
        )}
      </div>

      {["ditolak", "dibatalkan_sistem"].includes(newStatus) && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {newStatus === "ditolak" ? "Alasan Penolakan" : "Alasan Pembatalan"}
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <textarea
            value={alasan}
            onChange={(e) => onAlasanChange(e.target.value)}
            rows={3}
            placeholder={
              newStatus === "ditolak"
                ? "Masukkan alasan penolakan..."
                : "Masukkan alasan pembatalan..."
            }
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
          />
        </div>
      )}

      {newStatus === "selesai" && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Catatan Progres untuk Pasien
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <textarea
            value={catatanAdmin}
            onChange={(e) => onCatatanAdminChange(e.target.value)}
            rows={3}
            placeholder="Tuliskan hasil atau pengingat dari fisioterapis..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
          />
        </div>
      )}
    </div>
  </Modal>
);

export default UpdateStatusModal;
