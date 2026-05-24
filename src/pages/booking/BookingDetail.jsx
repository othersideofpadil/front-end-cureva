import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  Star,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService, jadwalService } from "../../services";
import {
  Button,
  Badge,
  LoadingSpinner,
  Modal,
  RatingModal,
} from "../../components/common";

/* ── tiny helpers ── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

const addMinutes = (timeStr, minutesToAdd) => {
  const [hour, minute] = formatTime(timeStr).split(":").map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  if (Number.isNaN(totalMinutes) || totalMinutes < 0) return null;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getBufferTimes = (slots) => {
  const bufferTimes = new Set();
  slots
    .filter((slot) => slot.status === "dipesan")
    .forEach((slot) => {
      const nextTime = addMinutes(slot.waktu_mulai, 60);
      if (nextTime) bufferTimes.add(nextTime);
    });
  return bufferTimes;
};

const formatPrice = (val) => `Rp ${(val || 0).toLocaleString("id-ID")}`;

/* ── reusable info row ── */
const InfoRow = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-medium text-slate-800 ${valueClass}`}>
      {value}
    </span>
  </div>
);

/* ── icon tile ── */
const IconTile = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
    <div className="p-2 bg-sky-100 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-sky-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 leading-none mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800 wrap-break-word">
        {value}
      </p>
    </div>
  </div>
);

/* ── section heading ── */
const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-slate-800 mb-4">{children}</h2>
);

/* ════════════════════════════════════════ */

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    tanggal: "",
    waktu: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (booking?.status === "selesai" && !booking?.rating && !showRatingModal) {
      const t = setTimeout(() => setShowRatingModal(true), 600);
      return () => clearTimeout(t);
    }
  }, [booking]);

  const fetchBooking = async () => {
    try {
      const response = await bookingService.getById(id);
      setBooking(response.data);
    } catch {
      toast.error("Booking tidak ditemukan");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Alasan pembatalan wajib diisi");
      return;
    }
    setCancelLoading(true);
    try {
      await bookingService.cancel(id, cancelReason.trim());
      toast.success("Booking berhasil dibatalkan");
      fetchBooking();
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membatalkan booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const fetchRescheduleSlots = async (tanggal) => {
    if (!tanggal) return;
    setRescheduleLoading(true);
    try {
      const response = await jadwalService.getSlotsPublic(tanggal);
      setAvailableSlots(response.data || []);
    } catch (error) {
      setAvailableSlots([]);
      toast.error(
        error.response?.data?.message || "Gagal memuat slot tersedia",
      );
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleForm.tanggal || !rescheduleForm.waktu) {
      toast.error("Tanggal dan waktu wajib dipilih");
      return;
    }

    setRescheduleSubmitting(true);
    try {
      await bookingService.reschedule(id, rescheduleForm);
      toast.success("Permintaan jadwal ulang dikirim");
      setShowRescheduleModal(false);
      setRescheduleForm({ tanggal: "", waktu: "" });
      setAvailableSlots([]);
      fetchBooking();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengajukan jadwal ulang",
      );
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  const handleSubmitRating = async (ratingData) => {
    setRatingLoading(true);
    try {
      await bookingService.addRating(id, ratingData.rating, ratingData.review);
      toast.success("Terima kasih atas penilaian Anda!");
      fetchBooking();
      setShowRatingModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const canCancel = [
    "menunggu_konfirmasi",
    "dikonfirmasi",
    "dijadwalkan",
  ].includes(booking?.status);
  const canReschedule = booking?.status === "dikonfirmasi";
  const canRate = booking?.status === "selesai" && !booking?.rating;
  const isPaid = ["dibayar"].includes(
    booking?.pembayaran?.status || booking?.status_pembayaran,
  );
  const price = booking?.harga_layanan || booking?.pembayaran?.jumlah || 0;
  const payMethod =
    (booking?.metode_pembayaran || booking?.pembayaran?.metode) ===
    "cash_on_visit"
      ? "Bayar di Tempat"
      : "Transfer";
  const bufferTimes = getBufferTimes(availableSlots);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!booking) return null;

  /* ── Action buttons — shared between mobile footer & desktop sidebar ── */
  const ActionButtons = () => (
    <div className="space-y-2.5">
      {canRate && (
        <Button
          variant="warning"
          leftIcon={Star}
          className="w-full justify-center"
          onClick={() => setShowRatingModal(true)}
        >
          Beri Rating
        </Button>
      )}
      {canReschedule && (
        <Button
          variant="secondary"
          leftIcon={RefreshCw}
          className="w-full justify-center"
          onClick={() => setShowRescheduleModal(true)}
        >
          Atur Ulang Jadwal
        </Button>
      )}
      {canCancel && (
        <Button
          variant="danger"
          className="w-full justify-center"
          onClick={() => setShowCancelModal(true)}
        >
          Batalkan Booking
        </Button>
      )}
      <Link to="/bookings/new" className="block">
        <Button
          variant="secondary"
          leftIcon={RefreshCw}
          className="w-full justify-center"
        >
          Booking Lagi
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky header mobile ── */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-200 px-4 py-3 sm:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 leading-tight truncate">
              Detail Booking
            </p>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide leading-none mt-0.5 truncate">
              {booking.kode_booking}
            </p>
          </div>
          <div className="shrink-0">
            <Badge status={booking.status} />
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* ── Page header — desktop/tablet ── */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl leading-tight">
                Detail Booking
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-wide mt-0.5">
                {booking.kode_booking}
              </p>
            </div>
            <div className="ml-auto">
              <Badge status={booking.status} size="lg" />
            </div>
          </div>

          {/* ── Rejection banner ── */}
          {booking.alasan_penolakan && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  {booking.status?.includes("dibatalkan")
                    ? "Alasan Pembatalan"
                    : "Alasan Penolakan"}
                </p>
                <p className="text-sm text-red-600 mt-0.5">
                  {booking.alasan_penolakan}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Two-column layout ── */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* ╔══ Left / main column ══╗ */}
            <div className="lg:col-span-2 space-y-4">
              {/* Service card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                  <SectionTitle>Informasi Layanan</SectionTitle>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                      <img src={booking.gambar_url} alt={booking.nama_layanan} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {booking.nama_layanan || "Fisioterapi"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Durasi: {booking.durasi_layanan || 60} menit
                      </p>
                      <p className="text-base sm:text-lg font-bold text-sky-500 mt-1">
                        {formatPrice(price)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Schedule & Location */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                  <SectionTitle>Jadwal &amp; Lokasi</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <IconTile
                      icon={Calendar}
                      label="Tanggal"
                      value={formatDate(booking.tanggal)}
                    />
                    <IconTile
                      icon={Clock}
                      label="Waktu"
                      value={`${formatTime(booking.waktu)} WIB`}
                    />
                  </div>
                  <div className="mt-3">
                    <IconTile
                      icon={MapPin}
                      label="Alamat"
                      value={booking.alamat}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Keluhan */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                  <SectionTitle>Keluhan</SectionTitle>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {booking.keluhan || "-"}
                  </p>
                </div>
              </motion.div>

              {/* Rating (if exists) */}
              {booking.rating && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                    <SectionTitle>Penilaian Anda</SectionTitle>
                    <div className="flex items-center gap-1.5 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            star <= booking.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-slate-700">
                        {booking.rating}/5
                      </span>
                    </div>
                    {booking.review && (
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">
                        "{booking.review}"
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action buttons — mobile & tablet (below lg) */}
              {(canRate || canCancel || canReschedule) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:hidden"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                    <SectionTitle>Tindakan</SectionTitle>
                    <ActionButtons />
                  </div>
                </motion.div>
              )}
            </div>

            {/* ╔══ Right / sidebar column ══╗ */}
            <div className="space-y-4">
              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                  <SectionTitle>Pembayaran</SectionTitle>
                  <InfoRow label="Metode" value={payMethod} />
                  <InfoRow
                    label="Status"
                    value={isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                    valueClass={isPaid ? "text-emerald-600" : "text-amber-600"}
                  />
                  <div className="mt-4 p-3.5 bg-sky-50 rounded-xl flex items-center justify-between">
                    <span className="text-sm text-sky-700 font-medium">
                      Total
                    </span>
                    <span className="text-base sm:text-lg font-bold text-sky-600">
                      {formatPrice(price)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Actions — desktop sidebar only */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="hidden lg:block"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <SectionTitle>Tindakan</SectionTitle>
                  <ActionButtons />
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                  <SectionTitle>Butuh Bantuan?</SectionTitle>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Hubungi kami jika ada pertanyaan tentang booking Anda.
                  </p>
                  <a
                    href="tel:+6281234567890"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 rounded-xl text-slate-600 hover:text-sky-700 border border-transparent hover:border-sky-200 transition-all"
                  >
                    <div className="p-1.5 bg-sky-100 rounded-lg">
                      <Phone className="w-4 h-4 text-sky-500" />
                    </div>
                    <span className="text-sm font-medium">
                      +62 812-3456-7890
                    </span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom action bar — mobile only ── */}
      {(canRate || canCancel || canReschedule) && (
        <div className="sticky bottom-0 z-10 sm:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
          <div className="flex gap-2">
            {canRate && (
              <Button
                variant="warning"
                leftIcon={Star}
                className="flex-1 justify-center"
                onClick={() => setShowRatingModal(true)}
              >
                Beri Rating
              </Button>
            )}
            {canReschedule && (
              <Button
                variant="secondary"
                leftIcon={RefreshCw}
                className="flex-1 justify-center"
                onClick={() => setShowRescheduleModal(true)}
              >
                Atur Ulang Jadwal
              </Button>
            )}
            {canCancel && (
              <Button
                variant="danger"
                className="flex-1 justify-center"
                onClick={() => setShowCancelModal(true)}
              >
                Batalkan
              </Button>
            )}
            <Link to="/bookings/new">
              <Button variant="secondary" leftIcon={RefreshCw}>
                Booking Lagi
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Cancel Modal ── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelReason("");
        }}
        title="Batalkan Booking"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
              }}
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
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Apakah Anda yakin ingin membatalkan booking ini?
            <br />
            <span className="text-slate-400">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </p>
          <div className="mt-4 text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alasan Pembatalan
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              placeholder="Tuliskan alasan pembatalan..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
        </div>
      </Modal>

      {/* ── Reschedule Modal ── */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setRescheduleForm({ tanggal: "", waktu: "" });
          setAvailableSlots([]);
        }}
        title="Atur Ulang Jadwal"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowRescheduleModal(false);
                setRescheduleForm({ tanggal: "", waktu: "" });
                setAvailableSlots([]);
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleRescheduleSubmit}
              loading={rescheduleSubmitting}
            >
              Ajukan Perubahan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal Baru
            </label>
            <input
              type="date"
              value={rescheduleForm.tanggal}
              onChange={(e) => {
                const tanggal = e.target.value;
                setRescheduleForm((prev) => ({
                  ...prev,
                  tanggal,
                  waktu: "",
                }));
                fetchRescheduleSlots(tanggal);
              }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Waktu Baru
            </label>
            <select
              value={rescheduleForm.waktu}
              onChange={(e) =>
                setRescheduleForm((prev) => ({
                  ...prev,
                  waktu: e.target.value,
                }))
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="">
                {rescheduleLoading ? "Memuat slot..." : "Pilih waktu"}
              </option>
              {availableSlots.map((slot) => {
                const slotTime = formatTime(slot.waktu_mulai);
                const isBuffer = bufferTimes.has(slotTime);
                const isBooked = slot.status === "dipesan";
                const isBlocked = slot.status === "diblock_admin";
                const isHoliday = slot.status === "libur";
                const now = new Date();
                const isPast =
                  rescheduleForm.tanggal &&
                  new Date(`${rescheduleForm.tanggal}T${slotTime}:00`) <= now;

                const isDisabled = isBooked || isBlocked || isHoliday || isPast;

                let statusLabel = "Tersedia";
                if (isBuffer) statusLabel = "Buffer";
                else if (isBooked) statusLabel = "Terpesan";
                else if (isBlocked) statusLabel = "Diblokir";
                else if (isHoliday) statusLabel = "Libur";
                else if (isPast) statusLabel = "Lewat";

                return (
                  <option
                    key={slot.id}
                    value={slot.waktu_mulai}
                    disabled={isDisabled}
                  >
                    {formatTime(slot.waktu_mulai)} WIB - {statusLabel}
                  </option>
                );
              })}
            </select>
            {!rescheduleLoading &&
              rescheduleForm.tanggal &&
              availableSlots.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  Tidak ada slot untuk tanggal ini.
                </p>
              )}
          </div>

          <p className="text-xs text-slate-500">
            Perubahan jadwal akan kembali menunggu konfirmasi fisioterapis.
          </p>
        </div>
      </Modal>

      {/* ── Rating Modal ── */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        loading={ratingLoading}
        therapistName="Abbad Al Wafi Amd. Kes, CDNP."
        title="Bagikan Pengalaman Anda"
      />
    </div>
  );
};

export default BookingDetail;
