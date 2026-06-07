import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Check,
  AlertCircle,
  ExternalLink,
  Banknote,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService, layananService, jadwalService } from "../../services";
import { Card, Button, Input, LoadingSpinner } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

const steps = [
  { id: 1, title: "Layanan", label: "Pilih Layanan", icon: FileText },
  { id: 2, title: "Jadwal", label: "Tanggal & Waktu", icon: Calendar },
  { id: 3, title: "Detail", label: "Info Detail", icon: MapPin },
  { id: 4, title: "Konfirmasi", label: "Konfirmasi", icon: Check },
];

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ─── Reusable styled pill badge ─── */
const StatusBadge = ({ label, className }) => (
  <span
    className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full ${className}`}
  >
    {label}
  </span>
);

const CreateBooking = () => {
  const navigate = useNavigate();
  const { startBookingSubmit, endBookingSubmit } = useAuth();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [layanan, setLayanan] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    id_layanan: null,
    tanggal: "",
    waktu: "",
    alamat: "",
    koordinat: "",
    keluhan: "",
    catatan_tambahan: "",
    metode_pembayaran: "cash_on_visit",
  });
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLayanan();
  }, []);

  useEffect(() => {
    const tanggal = searchParams.get("tanggal");
    const waktu = searchParams.get("waktu");
    if (tanggal || waktu) {
      setFormData((prev) => ({
        ...prev,
        tanggal: tanggal || prev.tanggal,
        waktu: waktu || prev.waktu,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!formData.tanggal) return;
    fetchAvailableSlots(formData.tanggal);
    const id = setInterval(() => fetchAvailableSlots(formData.tanggal), 30000);
    return () => clearInterval(id);
  }, [formData.tanggal]);

  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (tanggal) => {
    setSlotsLoading(true);
    try {
      const response = await jadwalService.getSlotsPublic(tanggal);
      setAvailableSlots(response.data || []);
    } catch (e) {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const normalizeTime = (t) => t?.slice(0, 5) || "";

  const addMinutes = (timeStr, mins) => {
    const [h, m] = normalizeTime(timeStr).split(":").map(Number);
    const total = h * 60 + m + mins;
    if (isNaN(total) || total < 0) return null;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const getBufferTimes = (slots) => {
    const set = new Set();
    slots
      .filter((s) => s.status === "dipesan")
      .forEach((s) => {
        const next = addMinutes(s.waktu_mulai, 60);
        if (next) set.add(next);
      });
    return set;
  };

  const getSlotState = (tanggal, slot, bufferTimes) => {
    const waktu = slot.waktu_mulai?.slice(0, 5) || slot.waktu;
    if (slot.status === "dipesan")
      return {
        label: "Terpesan",
        color: "bg-sky-100 text-sky-600",
        disabled: true,
      };
    if (slot.status === "diblock_admin")
      return {
        label: "Diblokir",
        color: "bg-red-100 text-red-600",
        disabled: true,
      };
    if (slot.status === "libur")
      return {
        label: "Libur",
        color: "bg-slate-100 text-slate-500",
        disabled: true,
      };
    const now = new Date();
    if (new Date(`${tanggal}T${waktu}:00`) <= now)
      return {
        label: "Lewat",
        color: "bg-slate-100 text-slate-400",
        disabled: true,
      };
    if (bufferTimes.has(normalizeTime(waktu)))
      return {
        label: "Buffer",
        color: "bg-amber-100 text-amber-600",
        disabled: true,
      };
    return {
      label: "Tersedia",
      color: "bg-emerald-100 text-emerald-600",
      disabled: false,
    };
  };

  const handleLayananSelect = (item) => {
    setFormData((prev) => ({ ...prev, id_layanan: item.id }));
    setSelectedLayanan(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1 && !formData.id_layanan) {
      toast.error("Pilih layanan terlebih dahulu");
      return false;
    }
    if (currentStep === 2) {
      if (!formData.tanggal) newErrors.tanggal = "Tanggal wajib dipilih";
      if (!formData.waktu) newErrors.waktu = "Waktu wajib dipilih";
    }
    if (currentStep === 3) {
      if (!formData.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
      if (!formData.keluhan.trim()) newErrors.keluhan = "Keluhan wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep((p) => Math.min(p + 1, 4));
  };
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    startBookingSubmit();
    try {
      const response = await bookingService.create(formData);
      toast.success("Booking berhasil dibuat!");
      endBookingSubmit();
      navigate(`/bookings/${response.data.id}`);
    } catch (error) {
      endBookingSubmit();
      toast.error(error.response?.data?.message || "Gagal membuat booking");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getMinDate = () => new Date().toISOString().split("T")[0];
  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const bufferTimes = getBufferTimes(availableSlots);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* ── Page Title (same pattern as original) ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Baru</h1>
          <p className="text-slate-500">Buat pemesanan fisioterapi</p>
        </div>
      </div>

      {/* ── Step Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {steps.map((step) => {
          const Icon = step.icon;
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 shrink-0 px-3 py-2 rounded-xl border transition-all text-xs font-semibold ${
                active
                  ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100"
                  : done
                    ? "bg-sky-50 text-sky-600 border-sky-200"
                    : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  active ? "bg-white/20" : done ? "bg-sky-100" : "bg-slate-100"
                }`}
              >
                {done ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>
              <span>{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* ════ STEP 1: Pilih Layanan ════ */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <SectionHeader
                  icon={<Stethoscope className="w-4 h-4" />}
                  title="Pilih Layanan Fisioterapi"
                  sub="Pilih jenis layanan yang Anda butuhkan"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {layanan.map((item, i) => {
                    const selected = formData.id_layanan === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLayananSelect(item)}
                        className={`group relative text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                          selected
                            ? "border-sky-500 bg-linear-to-br from-sky-50 to-white shadow-lg shadow-sky-100"
                            : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-md"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <h3
                          className={`font-bold text-sm pr-8 ${selected ? "text-sky-700" : "text-slate-800"}`}
                        >
                          {item.nama}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.deskripsi}
                        </p>
                        <div
                          className={`mt-3 pt-3 border-t flex items-center justify-between ${
                            selected ? "border-sky-100" : "border-slate-100"
                          }`}
                        >
                          <span
                            className={`text-base font-extrabold ${selected ? "text-sky-600" : "text-sky-500"}`}
                          >
                            Rp. {formatPrice(item.harga)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3" />
                            {item.durasi} mnt
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════ STEP 2: Jadwal ════ */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <SectionHeader
                  icon={<Calendar className="w-4 h-4" />}
                  title="Pilih Tanggal & Waktu"
                  sub="Tentukan jadwal kunjungan yang sesuai"
                />

                {/* Date picker card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Tanggal Kunjungan
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all ${
                      errors.tanggal ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.tanggal && <ErrMsg msg={errors.tanggal} />}
                  {formData.tanggal && (
                    <p className="mt-2 text-xs text-sky-600 font-medium">
                      📅 {formatDate(formData.tanggal)}
                    </p>
                  )}
                </div>

                {/* Time slots */}
                {formData.tanggal && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Jam Tersedia
                      </label>
                      {slotsLoading && (
                        <span className="text-xs text-sky-500 animate-pulse">
                          Memuat...
                        </span>
                      )}
                    </div>

                    {slotsLoading ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 rounded-xl bg-slate-100 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => {
                          const waktu =
                            slot.waktu_mulai?.slice(0, 5) || slot.waktu;
                          const state = getSlotState(
                            formData.tanggal,
                            slot,
                            bufferTimes,
                          );
                          const isSelected = formData.waktu === waktu;
                          return (
                            <motion.button
                              key={slot.id || waktu}
                              whileTap={!state.disabled ? { scale: 0.95 } : {}}
                              onClick={() =>
                                !state.disabled &&
                                setFormData((prev) => ({ ...prev, waktu }))
                              }
                              disabled={state.disabled}
                              className={`relative flex flex-col items-center justify-center rounded-xl p-2.5 border-2 transition-all text-center ${
                                isSelected
                                  ? "border-sky-500 bg-sky-500 shadow-lg shadow-sky-200"
                                  : state.disabled
                                    ? "border-slate-100 bg-slate-50 cursor-not-allowed"
                                    : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm"
                              }`}
                            >
                              <span
                                className={`text-sm font-bold leading-tight ${
                                  isSelected
                                    ? "text-white"
                                    : state.disabled
                                      ? "text-slate-300"
                                      : "text-slate-700"
                                }`}
                              >
                                {waktu}
                              </span>
                              <StatusBadge
                                label={state.label}
                                className={
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : state.color
                                }
                              />
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">
                            Tidak ada jadwal tersedia
                          </p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            Coba pilih tanggal lain
                          </p>
                        </div>
                      </div>
                    )}
                    {errors.waktu && <ErrMsg msg={errors.waktu} />}
                  </div>
                )}
              </div>
            )}

            {/* ════ STEP 3: Detail ════ */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <SectionHeader
                  icon={<MapPin className="w-4 h-4" />}
                  title="Informasi Detail"
                  sub="Lengkapi info kunjungan Anda"
                />

                <FormCard>
                  <FieldLabel label="Alamat Lengkap" required />
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Contoh: Jl. Mawar No. 12, RT 03/RW 05, Kelurahan..."
                    className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none bg-slate-50 focus:bg-white transition-all ${
                      errors.alamat ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.alamat && <ErrMsg msg={errors.alamat} />}
                </FormCard>

                <FormCard>
                  <FieldLabel label="Link Google Maps" optional />
                  <div className="relative">
                    <input
                      type="url"
                      name="koordinat"
                      value={formData.koordinat}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-3 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50 focus:bg-white transition-all"
                    />
                    <ExternalLink className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Bagikan pin lokasi agar fisioterapis mudah menemukan Anda
                  </p>
                </FormCard>

                <FormCard>
                  <FieldLabel label="Keluhan / Kondisi" required />
                  <textarea
                    name="keluhan"
                    value={formData.keluhan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Jelaskan keluhan yang dialami, misalnya: nyeri punggung bawah sejak 2 minggu lalu..."
                    className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none bg-slate-50 focus:bg-white transition-all ${
                      errors.keluhan ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.keluhan && <ErrMsg msg={errors.keluhan} />}
                </FormCard>

                <FormCard>
                  <FieldLabel label="Catatan Tambahan" optional />
                  <textarea
                    name="catatan_tambahan"
                    value={formData.catatan_tambahan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tambahkan catatan penting tentang kunjungan Anda..."
                    className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none bg-slate-50 focus:bg-white transition-all border-slate-200"
                  />
                </FormCard>

                <FormCard>
                  <FieldLabel label="Metode Pembayaran" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "cash_on_visit",
                        label: "Bayar di Tempat",
                        icon: Banknote,
                        sub: "Tunai saat kunjungan",
                      },
                      {
                        value: "transfer_on_visit",
                        label: "Transfer",
                        icon: CreditCard,
                        sub: "Transfer bank",
                      },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = formData.metode_pembayaran === m.value;
                      return (
                        <button
                          key={m.value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              metode_pembayaran: m.value,
                            }))
                          }
                          className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all text-left ${
                            active
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 bg-white hover:border-sky-200"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              active ? "bg-sky-500" : "bg-slate-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold ${active ? "text-sky-700" : "text-slate-700"}`}
                          >
                            {m.label}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {m.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FormCard>
              </div>
            )}

            {/* ════ STEP 4: Konfirmasi ════ */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <SectionHeader
                  icon={<Check className="w-4 h-4" />}
                  title="Konfirmasi Booking"
                  sub="Periksa kembali detail sebelum mengirim"
                />

                {/* Summary card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Service highlight */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Layanan</p>
                    <p className="font-semibold text-slate-800">
                      {selectedLayanan?.nama}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-bold text-sky-500">
                        Rp. {formatPrice(selectedLayanan?.harga)}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {selectedLayanan?.durasi} mnt
                      </span>
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="divide-y divide-slate-100">
                    <SummaryRow
                      icon={<Calendar className="w-4 h-4 text-sky-400" />}
                      label="Tanggal"
                      value={formatDate(formData.tanggal)}
                    />
                    <SummaryRow
                      icon={<Clock className="w-4 h-4 text-sky-400" />}
                      label="Waktu"
                      value={`${formData.waktu} WIB`}
                    />
                    <SummaryRow
                      icon={<MapPin className="w-4 h-4 text-sky-400" />}
                      label="Alamat"
                      value={formData.alamat}
                    />
                    <SummaryRow
                      icon={<FileText className="w-4 h-4 text-sky-400" />}
                      label="Keluhan"
                      value={formData.keluhan}
                    />
                    <SummaryRow
                      icon={<FileText className="w-4 h-4 text-sky-400" />}
                      label="Catatan Tambahan"
                      value={formData.catatan_tambahan}
                    />
                    <SummaryRow
                      icon={<CreditCard className="w-4 h-4 text-sky-400" />}
                      label="Pembayaran"
                      value={
                        formData.metode_pembayaran === "cash_on_visit"
                          ? "Bayar di Tempat"
                          : "Transfer"
                      }
                    />
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-sky-50 border-t border-sky-100 flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      Total Pembayaran
                    </span>
                    <span className="text-2xl font-bold text-sky-500">
                      Rp. {formatPrice(selectedLayanan?.harga)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>

        {currentStep < 4 ? (
          <Button onClick={nextStep}>
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={submitting}>
            <Check className="w-4 h-4" />
            Konfirmasi Booking
          </Button>
        )}
      </div>
    </div>
  );
};

/* ─── Sub-components ─── */

const SectionHeader = ({ icon, title, sub }) => (
  <div className="flex items-start gap-3 mb-1">
    <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  </div>
);

const FormCard = ({ children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
    {children}
  </div>
);

const FieldLabel = ({ label, required, optional }) => (
  <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
    {label}
    {required && <span className="text-red-400">*</span>}
    {optional && (
      <span className="text-slate-300 font-normal normal-case tracking-normal">
        (opsional)
      </span>
    )}
  </label>
);

const ErrMsg = ({ msg }) => (
  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
    <AlertCircle className="w-3 h-3" /> {msg}
  </p>
);

const SummaryRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 px-4 py-3">
    <div className="shrink-0 mt-0.5">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-700 mt-0.5 whitespace-pre-wrap">
        {value}
      </p>
    </div>
  </div>
);

export default CreateBooking;
