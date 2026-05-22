import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  User,
  ClipboardList,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import {
  LoadingSpinner,
  EmptyState,
  Modal,
  Button,
} from "../../components/common";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-8 h-8 ${
            star <= value ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
        />
      </button>
    ))}
  </div>
);

const ManageRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selected, setSelected] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formReview, setFormReview] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getAllRatings({
        limit: 200,
        offset: 0,
      });
      setRatings(response.data || []);
    } catch (error) {
      toast.error("Gagal memuat rating");
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const filteredRatings = useMemo(() => {
    if (!searchQuery) return ratings;
    const q = searchQuery.toLowerCase();
    return ratings.filter((item) =>
      [item.nama_pasien, item.email_pasien, item.nama_layanan, item.review]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q)),
    );
  }, [ratings, searchQuery]);

  const openEdit = (item) => {
    setSelected(item);
    setFormRating(item.rating || 0);
    setFormReview(item.review || "");
    setIsEditOpen(true);
  };

  const openDelete = (item) => {
    setSelected(item);
    setIsDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    if (formRating < 1 || formRating > 5) {
      toast.error("Rating harus 1-5");
      return;
    }

    setSaving(true);
    try {
      await bookingService.updateRating(selected.id_pemesanan, {
        rating: formRating,
        review: formReview.trim(),
      });

      setRatings((prev) =>
        prev.map((item) =>
          item.id_pemesanan === selected.id_pemesanan
            ? {
                ...item,
                rating: formRating,
                review: formReview.trim(),
                tanggal_review: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success("Rating berhasil diperbarui");
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui rating");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    setSaving(true);
    try {
      await bookingService.deleteRating(selected.id_pemesanan);
      setRatings((prev) =>
        prev.filter((item) => item.id_pemesanan !== selected.id_pemesanan),
      );
      toast.success("Rating berhasil dihapus");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus rating");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const averageRating = ratings.length
    ? (
        ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
      ).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Kelola Rating & Review
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Perbarui atau hapus ulasan untuk menjaga kualitas layanan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-center">
              <p className="text-[11px] text-slate-400">Total Ulasan</p>
              <p className="text-lg font-semibold text-slate-800">
                {ratings.length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-center">
              <p className="text-[11px] text-slate-400">Rata-rata</p>
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-semibold text-slate-800">
                  {averageRating}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pasien, email, layanan, atau review..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
            />
          </div>
        </div>

        {filteredRatings.length === 0 ? (
          <EmptyState
            title="Belum ada ulasan"
            description="Ulasan akan muncul ketika pasien menyelesaikan sesi dan memberi rating."
            action={fetchRatings}
            actionLabel="Muat Ulang"
          />
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredRatings.map((item) => (
                <motion.div
                  key={item.id_pemesanan}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-700">
                          {item.nama_layanan || "Layanan"}
                        </span>
                        {item.tanggal_review && (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.tanggal_review)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">
                          {item.rating}/5
                        </span>
                      </div>
                      {item.review && (
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 leading-relaxed">
                          “{item.review}”
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-300" />
                        <div>
                          <p className="font-semibold text-slate-700">
                            {item.nama_pasien}
                          </p>
                          <p className="text-slate-400">{item.email_pasien}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={Edit}
                          onClick={() => openEdit(item)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={Trash2}
                          onClick={() => openDelete(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Rating"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSubmit} loading={saving}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Rating</p>
            <StarPicker value={formRating} onChange={setFormRating} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Review
            </label>
            <textarea
              value={formReview}
              onChange={(e) => setFormReview(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
              placeholder="Perbarui isi review..."
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {formReview.length}/1000
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Hapus Rating"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="secondary" onClick={handleDelete} loading={saving}>
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Rating dan review ini akan dihapus permanen. Yakin ingin melanjutkan?
        </p>
      </Modal>
    </div>
  );
};

export default ManageRatings;
