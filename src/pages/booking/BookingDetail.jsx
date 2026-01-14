import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  CreditCard,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService } from "../../services";
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  Modal,
  RatingModal,
} from "../../components/common";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  useEffect(() => {
    // Auto show rating modal jika booking selesai dan belum ada rating
    if (
      booking &&
      booking.status === "selesai" &&
      !booking.rating &&
      !showRatingModal
    ) {
      setTimeout(() => {
        setShowRatingModal(true);
      }, 500);
    }
  }, [booking]);

  const fetchBooking = async () => {
    try {
      const response = await bookingService.getById(id);
      setBooking(response.data);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
      toast.error("Booking tidak ditemukan");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await bookingService.cancel(id);
      toast.success("Booking berhasil dibatalkan");
      fetchBooking();
      setShowCancelModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membatalkan booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSubmitRating = async (ratingData) => {
    setRatingLoading(true);
    try {
      await bookingService.addRating(id, ratingData.rating, ratingData.review);
      toast.success("Terima kasih atas penilaian Anda!");
      fetchBooking();
      setShowRatingModal(false);
      setRating(0);
      setReview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5) || "";
  };

  const canCancel = [
    "menunggu_konfirmasi",
    "dikonfirmasi",
    "dijadwalkan",
  ].includes(booking?.status);

  const canRate = booking?.status === "selesai" && !booking?.rating;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Detail Booking</h1>
          <p className="text-slate-500">{booking.kode_booking}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Status Pemesanan
              </h2>
              <Badge status={booking.status} size="lg" />
            </div>

            {booking.alasan_penolakan && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Alasan Penolakan</p>
                  <p className="text-sm text-red-600">
                    {booking.alasan_penolakan}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Service Info */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Informasi Layanan
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-linear-to-br from-sky-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8 text-sky-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {booking.nama_layanan || "Fisioterapi"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Durasi: {booking.durasi_layanan || 60} menit
                  </p>
                  <p className="text-lg font-bold text-sky-500 mt-2">
                    Rp{" "}
                    {(
                      booking.harga_layanan ||
                      booking.pembayaran?.jumlah ||
                      0
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Schedule & Location */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Jadwal & Lokasi
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tanggal</p>
                  <p className="font-medium text-slate-800">
                    {formatDate(booking.tanggal)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Clock className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Waktu</p>
                  <p className="font-medium text-slate-800">
                    {formatTime(booking.waktu)} WIB
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="p-2 bg-sky-100 rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="font-medium text-slate-800">{booking.alamat}</p>
              </div>
            </div>
          </Card>

          {/* Keluhan */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Keluhan
            </h2>
            <p className="text-slate-600">{booking.keluhan}</p>
          </Card>

          {/* Rating (if exists) */}
          {booking.rating && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Penilaian Anda
              </h2>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= booking.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium text-slate-800">
                  {booking.rating}/5
                </span>
              </div>
              {booking.review && (
                <p className="text-slate-600">{booking.review}</p>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Pembayaran
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Metode</span>
                <span className="font-medium text-slate-800">
                  {(booking.metode_pembayaran || booking.pembayaran?.metode) ===
                  "cash_on_visit"
                    ? "Bayar di Tempat"
                    : "Transfer"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span
                  className={`font-medium ${
                    (booking.pembayaran?.status ||
                      booking.status_pembayaran) === "dibayar"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {booking.pembayaran?.status === "dibayar" ||
                  booking.status_pembayaran === "dibayar"
                    ? "Sudah Dibayar"
                    : "Belum Dibayar"}
                </span>
              </div>
              <hr className="my-3 border-slate-100" />
              <div className="flex justify-between">
                <span className="font-medium text-slate-800">Total</span>
                <span className="text-xl font-bold text-sky-500">
                  Rp{" "}
                  {(
                    booking.harga_layanan ||
                    booking.pembayaran?.jumlah ||
                    0
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="space-y-3">
              {canRate && (
                <Button
                  fullWidth
                  variant="success"
                  onClick={() => setShowRatingModal(true)}
                >
                  <Star className="w-5 h-5" />
                  Beri Rating
                </Button>
              )}
              {canCancel && (
                <Button
                  fullWidth
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                >
                  Batalkan Booking
                </Button>
              )}
              <Link to="/bookings/new">
                <Button fullWidth variant="outline">
                  Booking Lagi
                </Button>
              </Link>
            </div>
          </Card>

          {/* Contact */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Butuh Bantuan?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Hubungi kami jika ada pertanyaan tentang booking Anda
            </p>
            <a
              href="tel:+6281234567890"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+62 812-3456-7890</span>
            </a>
          </Card>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Booking"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
            >
              Tidak
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={cancelLoading}
            >
              Ya, Batalkan
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600">
            Apakah Anda yakin ingin membatalkan booking ini?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </Modal>

      {/* Rating Modal - Using RatingModal Component */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        loading={ratingLoading}
        therapistName="Abbad Al Wafi, S.Ft., M.Fis"
        title="Bagikan Pengalaman Anda"
      />
    </div>
  );
};

export default BookingDetail;
