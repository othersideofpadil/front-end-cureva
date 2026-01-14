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
} from "lucide-react";
import toast from "react-hot-toast";
import { layananService } from "../../services";
import {
  Card,
  Button,
  Input,
  LoadingSpinner,
  Badge,
  Modal,
} from "../../components/common";

const ManageLayanan = () => {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    kategori: "",
    is_active: true,
  });

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch (error) {
      console.error("Failed to fetch layanan:", error);
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
      });
    } else {
      setEditingLayanan(null);
      setFormData({
        nama: "",
        deskripsi: "",
        harga: "",
        durasi: "60",
        kategori: "",
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLayanan(null);
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
      const data = {
        ...formData,
        harga: parseInt(formData.harga),
        durasi: parseInt(formData.durasi),
      };

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
      const message =
        error.response?.data?.message || "Gagal menyimpan layanan";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await layananService.update(item.id, { is_active: !item.is_active });
      toast.success(
        `Layanan ${item.is_active ? "dinonaktifkan" : "diaktifkan"}`
      );
      fetchLayanan();
    } catch (error) {
      toast.error("Gagal mengubah status layanan");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus layanan "${item.nama}"?`)) return;

    try {
      await layananService.delete(item.id);
      toast.success("Layanan berhasil dihapus");
      fetchLayanan();
    } catch (error) {
      toast.error("Gagal menghapus layanan");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredLayanan = layanan.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Layanan</h1>
          <p className="text-slate-500">
            Atur layanan fisioterapi yang tersedia
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Tambah Layanan
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </Card>

      {/* Layanan List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLayanan.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`h-full ${!item.is_active ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.nama}
                    </h3>
                    {item.kategori && (
                      <span className="text-xs text-slate-500">
                        {item.kategori}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={item.is_active ? "success" : "secondary"}>
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {item.deskripsi || "Tidak ada deskripsi"}
              </p>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-bold text-sky-600">
                  {formatPrice(item.harga)}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  {item.durasi} menit
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {item.is_active ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Nonaktifkan
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Aktifkan
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLayanan.length === 0 && (
        <Card>
          <div className="text-center py-8 text-slate-500">
            {searchQuery ? "Tidak ada layanan yang cocok" : "Belum ada layanan"}
          </div>
        </Card>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingLayanan ? "Edit Layanan" : "Tambah Layanan"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <Input
                  label="Nama Layanan"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Harga (Rp)"
                    name="harga"
                    type="number"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Durasi (menit)"
                    name="durasi"
                    type="number"
                    value={formData.durasi}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  placeholder="Contoh: Rehabilitasi, Geriatri"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-sky-500 rounded"
                  />
                  <span className="text-sm text-slate-700">Layanan aktif</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    leftIcon={Save}
                    className="flex-1"
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageLayanan;
