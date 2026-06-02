import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import { LoadingSpinner, EmptyState } from "../../components/common";
import {
  DeleteRatingModal,
  EditRatingModal,
  RatingsHeader,
  RatingsList,
  RatingsSearch,
} from "./components/ratings";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
    } catch {
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
    : "-";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <RatingsHeader
          ratingsCount={ratings.length}
          averageRating={averageRating}
        />

        <RatingsSearch value={searchQuery} onChange={setSearchQuery} />

        {filteredRatings.length === 0 ? (
          <EmptyState
            title="Belum ada ulasan"
            description="Ulasan akan muncul ketika pasien menyelesaikan sesi dan memberi rating."
            action={fetchRatings}
            actionLabel="Muat Ulang"
          />
        ) : (
          <RatingsList
            ratings={filteredRatings}
            onEdit={openEdit}
            onDelete={openDelete}
            formatDate={formatDate}
          />
        )}
      </div>

      <EditRatingModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        rating={formRating}
        onRatingChange={setFormRating}
        review={formReview}
        onReviewChange={setFormReview}
        onSave={handleEditSubmit}
        saving={saving}
      />

      <DeleteRatingModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        saving={saving}
      />
    </div>
  );
};

export default ManageRatings;
