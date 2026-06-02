import { AlertCircle } from "lucide-react";
import { Modal, Button, Input } from "../../../../components/common";

const SlotFormModal = ({
  isOpen,
  editingSlot,
  formData,
  canManageDate,
  submitting,
  onChange,
  onClose,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={editingSlot ? "Edit Slot" : "Tambah Slot Baru"}
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          Batal
        </Button>
        <Button
          type="submit"
          form="slot-form"
          loading={submitting}
          disabled={!canManageDate}
        >
          Simpan
        </Button>
      </>
    }
  >
    <form id="slot-form" onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Tanggal"
        type="date"
        name="tanggal"
        value={formData.tanggal}
        onChange={onChange}
        disabled
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Waktu Mulai"
          type="time"
          name="waktu_mulai"
          value={formData.waktu_mulai}
          onChange={onChange}
          disabled={!!editingSlot}
          required={!editingSlot}
        />
        <Input
          label="Waktu Selesai"
          type="time"
          name="waktu_selesai"
          value={formData.waktu_selesai}
          onChange={onChange}
          disabled={!!editingSlot}
          required={!editingSlot}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
        >
          <option value="tersedia">Tersedia</option>
          <option value="diblock_admin">Diblokir</option>
          <option value="libur">Libur</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Keterangan{" "}
          <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        <textarea
          name="keterangan"
          value={formData.keterangan}
          onChange={onChange}
          rows={3}
          placeholder="Tambahkan catatan jika diperlukan..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none"
        />
      </div>

      {!canManageDate && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Slot hanya bisa dibuat untuk tanggal hari ini atau setelahnya.
          </p>
        </div>
      )}
    </form>
  </Modal>
);

export default SlotFormModal;
