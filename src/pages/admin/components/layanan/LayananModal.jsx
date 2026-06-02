import { FileText, Save } from "lucide-react";
import { Button, Modal } from "../../../../components/common";

const LayananModal = ({
  isOpen,
  onClose,
  editingLayanan,
  formData,
  imagePreview,
  onImageChange,
  onChange,
  onSubmit,
  submitting,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="lg"
    responsive
    title={
      <div>
        <h2 className="text-base font-bold text-slate-800">
          {editingLayanan ? "Edit Layanan" : "Tambah Layanan"}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {editingLayanan ? "Perbarui detail layanan" : "Isi detail layanan baru"}
        </p>
      </div>
    }
    bodyClassName="p-0"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button
          type="submit"
          form="layanan-form"
          loading={submitting}
          leftIcon={Save}
          className="flex-1"
        >
          Simpan
        </Button>
      </>
    }
    footerClassName="justify-between"
  >
    <form
      id="layanan-form"
      onSubmit={onSubmit}
      className="px-5 py-4 space-y-4"
    >
      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText className="w-7 h-7 text-slate-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-600 mb-1">
            Gambar Layanan
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="block w-full text-xs text-slate-500
              file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0
              file:text-xs file:font-medium
              file:bg-sky-50 file:text-sky-600
              hover:file:bg-sky-100 transition-colors cursor-pointer"
          />
          <p className="mt-1.5 text-[11px] text-slate-400">
            PNG/JPG, maks. 2MB
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Nama Layanan <span className="text-red-400">*</span>
        </label>
        <input
          name="nama"
          value={formData.nama}
          onChange={onChange}
          required
          placeholder="Cth: Terapi Manual Tulang Belakang"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={onChange}
          rows={3}
          placeholder="Jelaskan layanan ini secara singkat..."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Harga (Rp) <span className="text-red-400">*</span>
          </label>
          <input
            name="harga"
            type="number"
            value={formData.harga}
            onChange={onChange}
            required
            placeholder="150000"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Durasi (menit) <span className="text-red-400">*</span>
          </label>
          <input
            name="durasi"
            type="number"
            value={formData.durasi}
            onChange={onChange}
            required
            placeholder="60"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Kategori
        </label>
        <input
          name="kategori"
          value={formData.kategori}
          onChange={onChange}
          placeholder="Cth: Rehabilitasi, Geriatri"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
        />
      </div>

      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-slate-700">Status Layanan</p>
          <p className="text-xs text-slate-400">
            {formData.is_active
              ? "Layanan aktif & dapat dipesan"
              : "Layanan nonaktif"}
          </p>
        </div>
        <div className="relative">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors duration-200 ${
              formData.is_active ? "bg-sky-500" : "bg-slate-200"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                formData.is_active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </label>
    </form>
  </Modal>
);

export default LayananModal;
