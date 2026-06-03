import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { layananService } from "../../services";
import { LoadingSpinner } from "../../components/common";
import {
  LayananGrid,
  LayananHeader,
  LayananModal,
  LayananSearch,
  LayananStats,
} from "./components/layanan";
import DeleteLayananModal from "./components/layanan/DeleteLayananModal";

const emptyForm = {
  nama: "",
  deskripsi: "",
  harga: "",
  durasi: "60",
  kategori: "",
  is_active: true,
  gambar_url: "",
};

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      if (!imageFile && formData.gambar_url) {
        data.append("gambar_url", formData.gambar_url);
      }
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

  const handleDeleteClick = (item) => {
    setSelectedLayanan(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLayanan) return;
    setDeleteLoading(true);
    try {
      await layananService.delete(selectedLayanan.id);
      toast.success("Layanan berhasil dihapus");
      fetchLayanan();
      setShowDeleteModal(false);
      setSelectedLayanan(null);
    } catch {
      toast.error("Gagal menghapus layanan");
    } finally {
      setDeleteLoading(false);
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

  const filtered = layanan.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = layanan.filter((item) => item.is_active).length;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <LayananHeader onAdd={() => handleOpenModal()} />

      <LayananStats total={layanan.length} active={activeCount} />

      <LayananSearch
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <LayananGrid
        items={filtered}
        searchQuery={searchQuery}
        onEdit={handleOpenModal}
        onToggle={handleToggleActive}
        onDelete={handleDeleteClick}
        onAdd={() => handleOpenModal()}
      />

      <LayananModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editingLayanan={editingLayanan}
        formData={formData}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <DeleteLayananModal
        isOpen={showDeleteModal}
        selectedLayanan={selectedLayanan}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedLayanan(null);
        }}
        onConfirm={handleConfirmDelete}
        actionLoading={deleteLoading}
      />
    </div>
  );
};

export default ManageLayanan;
