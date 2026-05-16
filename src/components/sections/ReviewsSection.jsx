import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Send, User, Quote } from "lucide-react";
import { LoadingSpinner } from "../common";

const ReviewsSection = ({
  ratings,
  loadingRatings,
  isAuthenticated,
  completedBookings,
  selectedBooking,
  setSelectedBooking,
  userRating,
  setUserRating,
  hoverRating,
  setHoverRating,
  reviewText,
  setReviewText,
  submitting,
  handleSubmitReview,
}) => {
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Ulasan <span className="text-primary">Pasien Kami</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Baca pengalaman dari pasien yang telah merasakan layanan fisioterapi
            bersama Abbad Al Wafi
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar: Rating Summary & Write Review Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-24 shadow-sm"
            >
              {/* Overall Rating */}
              <div className="text-center mb-6 pb-6 border-b border-slate-100">
                <div className="text-5xl font-bold text-primary mb-2">
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
                <p className="text-sm text-slate-500">
                  Berdasarkan {ratings.length} ulasan
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratings.filter((r) => r.rating === star).length;
                  const percentage =
                    ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-8">{star}</span>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Write Review Form */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">
                  Tulis Ulasan
                </h3>

                {isAuthenticated ? (
                  completedBookings.length > 0 ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Select Booking */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pilih Booking
                        </label>
                        <select
                          value={selectedBooking}
                          onChange={(e) => setSelectedBooking(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          required
                        >
                          <option value="">-- Pilih Booking --</option>
                          {completedBookings.map((booking) => (
                            <option key={booking.id} value={booking.id}>
                              {booking.nama_layanan} -{" "}
                              {new Date(booking.tanggal).toLocaleDateString(
                                "id-ID"
                              )}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Rating Stars */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Rating Anda
                        </label>
                        <div className="flex gap-1">
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
                                className={`w-7 h-7 ${
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
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                          rows="5"
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
                        disabled={
                          submitting || !userRating || !reviewText.trim()
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
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
                    <div className="text-center py-6">
                      <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm mb-2">
                        Tidak ada booking yang dapat direview
                      </p>
                      <p className="text-slate-400 text-xs">
                        Selesaikan booking terlebih dahulu untuk memberikan
                        ulasan
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm mb-3">
                      Login untuk menulis ulasan
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 transition-colors text-sm"
                    >
                      Masuk Sekarang
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {loadingRatings ? (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            ) : ratings.length > 0 ? (
              ratings.map((rating, index) => (
                <motion.div
                  key={`${rating.id_pemesanan}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-sm"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-sky-500/10" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {rating.nama_pasien
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">
                          {rating.nama_pasien}
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 text-xs font-medium">
                          {rating.nama_layanan}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= rating.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(rating.tanggal_review).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        "{rating.review}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
