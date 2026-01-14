import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Filter, Search, TrendingUp, Send } from "lucide-react";
import { bookingService } from "../../services";
import { LoadingSpinner, RatingCard, Card } from "../../components/common";
import { toast } from "react-hot-toast";

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRatings();
    fetchCompletedBookings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await bookingService.getAllRatings({ limit: 100 });
      setRatings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      const completed = response.data.filter(
        (booking) =>
          booking.status === "selesai" &&
          (!booking.rating || booking.rating === null)
      );
      setCompletedBookings(completed);
    } catch (error) {
      console.error("Failed to fetch completed bookings:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedBooking) {
      toast.error("Pilih booking yang ingin direview");
      return;
    }

    if (userRating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Tulis review Anda");
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.submitRating(selectedBooking, {
        rating: userRating,
        review: reviewText.trim(),
      });

      toast.success("Review berhasil dikirim!");

      // Reset form
      setSelectedBooking("");
      setUserRating(0);
      setReviewText("");

      // Refresh data
      fetchRatings();
      fetchCompletedBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim review");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRatings = ratings.filter((rating) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "5" && rating.rating === 5) ||
      (filter === "4" && rating.rating === 4) ||
      (filter === "3" && rating.rating <= 3);

    const matchesSearch =
      searchQuery === "" ||
      rating.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.nama_layanan.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
    percentage:
      ratings.length > 0
        ? (
            (ratings.filter((r) => r.rating === star).length / ratings.length) *
            100
          ).toFixed(0)
        : 0,
  }));

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Rating & Review Fisioterapis
          </h1>
          <p className="text-slate-500 mt-1">
            Lihat semua testimoni dan rating dari pasien kami
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <Card>
            <div className="text-center">
              <div className="text-5xl font-bold text-sky-500 mb-2">
                {averageRating}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-600 text-sm">
                Dari {ratings.length} rating
              </p>
            </div>
          </Card>

          {/* Rating Distribution */}
          <Card className="md:col-span-2">
            <h3 className="font-semibold text-slate-800 mb-4">
              Distribusi Rating
            </h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-slate-700">
                      {star}
                    </span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau review..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Semua Rating</option>
                <option value="5">⭐ 5 Bintang</option>
                <option value="4">⭐ 4 Bintang</option>
                <option value="3">⭐ ≤3 Bintang</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Ratings List */}
        {filteredRatings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {filteredRatings.map((rating, index) => (
              <motion.div
                key={`${rating.id_pemesanan}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RatingCard
                  rating={rating.rating}
                  name={rating.nama_pasien}
                  role={rating.nama_layanan}
                  content={rating.review}
                  therapistName="Abbad Al Wafi, S.Ft., M.Fis"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchQuery || filter !== "all"
                  ? "Tidak ada rating yang sesuai dengan filter"
                  : "Belum ada rating tersedia"}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar - Write Review Form */}
      <div className="lg:sticky lg:top-20 h-fit">
        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Tulis Ulasan
          </h3>

          {completedBookings.length > 0 ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Select Booking */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pilih Booking
                </label>
                <select
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  required
                >
                  <option value="">-- Pilih Booking --</option>
                  {completedBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.nama_layanan} -{" "}
                      {new Date(booking.tanggal).toLocaleDateString("id-ID")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating Anda
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || userRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bagikan pengalaman Anda
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Bagikan pengalaman Anda dengan fisioterapis kami..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none text-sm"
                  rows="6"
                  maxLength="500"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  {reviewText.length}/500 karakter
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !userRating || !reviewText.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Ulasan
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-2">
                Tidak ada booking yang dapat direview
              </p>
              <p className="text-slate-400 text-xs">
                Selesaikan booking terlebih dahulu untuk memberikan ulasan
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Ratings;
