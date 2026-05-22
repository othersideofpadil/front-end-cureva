import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  FileText,
  Clock,
  ChevronRight,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { layananService } from "../../services";
import { Card, Button, LoadingSpinner, Modal } from "../../components/common";

/* ─── tiny local helpers ─────────────────────────────────────── */
const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const emptyForm = {
  nama: "",
  deskripsi: "",
  harga: "",
  durasi: "60",
  kategori: "",
  is_active: true,
  gambar_url: "",
};

/* ─── Layanan Card ───────────────────────────────────────────── */
const LayananCard = ({ item, onEdit, onToggle, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.22 }}
    className={`group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
      !item.is_active ? "opacity-55" : ""
    }`}
  >
    {/* top accent line */}
    <div
      className={`h-1 w-full ${
        item.is_active
          ? "bg-linear-to-r from-sky-400 to-sky-500"
          : "bg-slate-200"
      }`}
    />

    {/* card body */}
    <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
      {/* header row */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {item.gambar_url ? (
            <img
              src={item.gambar_url}
              alt={item.nama}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center ring-2 ring-sky-100">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug truncate">
            {item.nama}
          </h3>
          {item.kategori && (
            <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              <Layers className="w-3 h-3" />
              {item.kategori}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            item.is_active
              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
              : "text-slate-400 bg-slate-50 border-slate-100"
          }`}
        >
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      {/* description */}
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
        {item.deskripsi || "Tidak ada deskripsi"}
      </p>

      {/* price / duration */}
      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold text-sky-600 tracking-tight">
          {formatPrice(item.harga)}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          {item.durasi} mnt
        </span>
      </div>
    </div>

    {/* action bar */}
    <div className="flex items-center divide-x divide-slate-100 border-t border-slate-100">
      <button
        onClick={() => onToggle(item)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
      >
        {item.is_active ? (
          <ToggleRight className="w-4 h-4 text-emerald-500" />
        ) : (
          <ToggleLeft className="w-4 h-4" />
        )}
        {item.is_active ? "Nonaktifkan" : "Aktifkan"}
      </button>

      <button
        onClick={() => onEdit(item)}
        className="px-4 py-2.5 text-sky-600 hover:bg-sky-50 transition-colors"
        aria-label="Edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDelete(item)}
        className="px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

/* ─── Main Page ──────────────────────────────────────────────── */
const ManageLayanan = () => {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch {
      toast.error("Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingLayanan(item);
      setFormData({
        nama: item.nama,
        deskripsi: item.deskripsi || "",
        harga: item.harga.toString(),
        durasi: item.durasi.toString(),
        kategori: item.kategori || "",
        is_active: item.is_active,
        gambar_url: item.gambar_url || "",
      });
      setImagePreview(item.gambar_url || "");
    } else {
      setEditingLayanan(null);
      setFormData(emptyForm);
      setImagePreview("");
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLayanan(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(formData.gambar_url || "");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("deskripsi", formData.deskripsi || "");
      data.append("harga", String(parseInt(formData.harga)));
      data.append("durasi", String(parseInt(formData.durasi)));
      data.append("kategori", formData.kategori || "");
      data.append("is_active", formData.is_active ? "1" : "0");
      if (!imageFile && formData.gambar_url)
        data.append("gambar_url", formData.gambar_url);
      if (imageFile) data.append("gambar", imageFile);

      if (editingLayanan) {
        await layananService.update(editingLayanan.id, data);
        toast.success("Layanan berhasil diperbarui");
      } else {
        await layananService.create(data);
        toast.success("Layanan berhasil ditambahkan");
      }
      handleCloseModal();
      fetchLayanan();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan layanan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await layananService.update(item.id, { is_active: !item.is_active });
      toast.success(
        `Layanan ${item.is_active ? "dinonaktifkan" : "diaktifkan"}`,
      );
      fetchLayanan();
    } catch {
      toast.error("Gagal mengubah status layanan");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus layanan "${item.nama}"?`)) return;
    try {
      await layananService.delete(item.id);
      toast.success("Layanan berhasil dihapus");
      fetchLayanan();
    } catch {
      toast.error("Gagal menghapus layanan");
    }
  };

  const filtered = layanan.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = layanan.filter((l) => l.is_active).length;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Kelola Layanan
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Atur layanan fisioterapi yang tersedia
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-sky-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Layanan", value: layanan.length },
          { label: "Aktif", value: activeCount },
          { label: "Nonaktif", value: layanan.length - activeCount },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm text-center"
          >
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {s.value}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama atau kategori layanan…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item) => (
              <LayananCard
                key={item.id}
                item={item}
                onEdit={handleOpenModal}
                onToggle={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-medium">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : "Belum ada layanan"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => handleOpenModal()}
              className="mt-3 text-xs text-sky-500 hover:underline flex items-center gap-1"
            >
              Tambah layanan pertama <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        size="lg"
        responsive
        title={
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {editingLayanan ? "Edit Layanan" : "Tambah Layanan"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingLayanan
                ? "Perbarui detail layanan"
                : "Isi detail layanan baru"}
            </p>
          </div>
        }
        bodyClassName="p-0"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="flex-1"
            >
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
          onSubmit={handleSubmit}
          className="px-5 py-4 space-y-4"
        >
          {/* image upload */}
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
                onChange={handleImageChange}
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

          {/* nama */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Nama Layanan <span className="text-red-400">*</span>
            </label>
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Cth: Terapi Manual Tulang Belakang"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
            />
          </div>

          {/* deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              placeholder="Jelaskan layanan ini secara singkat…"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* harga + durasi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Harga (Rp) <span className="text-red-400">*</span>
              </label>
              <input
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleChange}
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
                onChange={handleChange}
                required
                placeholder="60"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Kategori
            </label>
            <input
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              placeholder="Cth: Rehabilitasi, Geriatri"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
            />
          </div>

          {/* is_active toggle */}
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Status Layanan
              </p>
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
                onChange={handleChange}
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
    </div>
  );
};

export default ManageLayanan;
