import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Search, Send, FileX, Clock, CheckCircle } from "lucide-react";
import { bookingService } from "../../services";
import { LoadingSpinner, RatingCard, Button } from "../../components/common";
import { toast } from "react-hot-toast";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ── Star input ── */
const StarPicker = ({ value, hover, onHover, onLeave, onClick }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onClick(star)}
        onMouseEnter={() => onHover(star)}
        onMouseLeave={onLeave}
        className="transition-transform hover:scale-110 focus:outline-none"
      >
        <Star
          className={`w-8 h-8 ${
            star <= (hover || value)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }`}
        />
      </button>
    ))}
  </div>
);

/* ── Section heading ── */
const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-slate-800 mb-3">{children}</h2>
);

/* ════════════════════════════════════════ */

const Ratings = () => {
  // Tab: "riwayat" | "tulis"
  const [activeTab, setActiveTab] = useState("riwayat");

  // Data
  const [myRatings, setMyRatings] = useState([]); // booking selesai + sudah rated
  const [pendingBookings, setPendingBookings] = useState([]); // booking selesai + belum rated
  const [loading, setLoading] = useState(true);

  // Form
  const [selectedBooking, setSelectedBooking] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search (riwayat)
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      const bookings = response.data || [];

      const completed = bookings.filter((b) => b.status === "selesai");
      setMyRatings(completed.filter((b) => b.rating));
      setPendingBookings(completed.filter((b) => !b.rating));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking)
      return toast.error("Pilih booking yang ingin direview");
    if (userRating === 0) return toast.error("Pilih rating terlebih dahulu");
    if (!reviewText.trim()) return toast.error("Tulis review Anda");

    setSubmitting(true);
    try {
      await bookingService.submitRating(selectedBooking, {
        rating: userRating,
        review: reviewText.trim(),
      });
      toast.success("Ulasan berhasil dikirim!");
      setSelectedBooking("");
      setUserRating(0);
      setReviewText("");
      await fetchData();
      setActiveTab("riwayat");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim ulasan");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRatings = myRatings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.nama_layanan?.toLowerCase().includes(q) ||
      b.review?.toLowerCase().includes(q)
    );
  });

  if (loading) return <LoadingSpinner fullScreen />;

  /* ── stat helpers ── */
  const avgRating =
    myRatings.length > 0
      ? (
          myRatings.reduce((s, r) => s + r.rating, 0) / myRatings.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* ── Header ── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Ulasan Saya
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Riwayat ulasan yang pernah Anda berikan
          </p>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-bold text-sky-500">
              {myRatings.length}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              Ulasan diberikan
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-bold text-amber-500">
              {avgRating ?? "—"}
            </span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-slate-400">Rata-rata</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center col-span-2 sm:col-span-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-500">
              {pendingBookings.length}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              Menunggu ulasan
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-fit">
          {[
            { key: "riwayat", label: `Riwayat (${myRatings.length})` },
            {
              key: "tulis",
              label: `Tulis Ulasan${pendingBookings.length > 0 ? ` (${pendingBookings.length})` : ""}`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════ TAB: RIWAYAT ════════ */}
        {activeTab === "riwayat" && (
          <motion.div
            key="riwayat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Search */}
            {myRatings.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan layanan atau review…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                />
              </div>
            )}

            {/* Pending — belum diulas */}
            {pendingBookings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800">
                      {pendingBookings.length} booking menunggu ulasan Anda
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Bagikan pengalaman Anda untuk membantu pasien lain.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("tulis")}
                    className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Tulis sekarang
                  </button>
                </div>
              </div>
            )}

            {/* Rating cards */}
            {filteredRatings.length > 0 ? (
              <div className="space-y-3">
                {filteredRatings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {booking.nama_layanan || "Fisioterapi"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDate(booking.tanggal)}
                          </p>
                        </div>
                        {/* Stars */}
                        <div className="flex gap-0.5 shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= booking.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review text */}
                      {booking.review && (
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 leading-relaxed">
                          "{booking.review}"
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-1.5 mt-3">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-slate-400">
                          Ulasan terverifikasi · {booking.rating}/5
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <FileX className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    {searchQuery ? "Tidak ada hasil" : "Belum ada ulasan"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {searchQuery
                      ? "Coba ubah kata kunci pencarian."
                      : "Selesaikan sesi fisioterapi dan bagikan pengalaman Anda."}
                  </p>
                </div>
                {!searchQuery && pendingBookings.length > 0 && (
                  <Button size="sm" onClick={() => setActiveTab("tulis")}>
                    Tulis Ulasan Pertama
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ════════ TAB: TULIS ULASAN ════════ */}
        {activeTab === "tulis" && (
          <motion.div
            key="tulis"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {pendingBookings.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <SectionTitle>Tulis Ulasan Baru</SectionTitle>
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  {/* Select booking */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Pilih Sesi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                      required
                    >
                      <option value="">— Pilih sesi yang ingin diulas —</option>
                      {pendingBookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama_layanan} · {formatDate(b.tanggal)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star rating */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Rating Anda <span className="text-red-500">*</span>
                    </label>
                    <StarPicker
                      value={userRating}
                      hover={hoverRating}
                      onHover={setHoverRating}
                      onLeave={() => setHoverRating(0)}
                      onClick={setUserRating}
                    />
                    {userRating > 0 && (
                      <p className="text-xs text-amber-600 mt-1.5">
                        {
                          [
                            "",
                            "Sangat Buruk",
                            "Buruk",
                            "Cukup",
                            "Bagus",
                            "Luar Biasa",
                          ][userRating]
                        }
                      </p>
                    )}
                  </div>

                  {/* Review text */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Cerita pengalaman Anda{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Bagaimana pelayanan fisioterapis? Apakah kondisi Anda membaik setelah sesi?"
                      className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                      rows={5}
                      maxLength={500}
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {reviewText.length}/500
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    leftIcon={Send}
                    loading={submitting}
                    disabled={
                      submitting ||
                      !userRating ||
                      !reviewText.trim() ||
                      !selectedBooking
                    }
                    className="w-full justify-center"
                  >
                    Kirim Ulasan
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    Tidak ada sesi yang dapat diulas
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Semua booking Anda sudah diulas, atau belum ada sesi yang
                    selesai.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
