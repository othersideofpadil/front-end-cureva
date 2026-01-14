import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingService, layananService, jadwalService } from "../../services";
import { Card, Button, Input, LoadingSpinner } from "../../components/common";

const steps = [
  { id: 1, title: "Pilih Layanan", icon: FileText },
  { id: 2, title: "Jadwal", icon: Calendar },
  { id: 3, title: "Detail", icon: MapPin },
  { id: 4, title: "Konfirmasi", icon: Check },
];

const CreateBooking = () => {
  const navigate = useNavigate();
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
    metode_pembayaran: "cash_on_visit",
  });
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLayanan();
  }, []);

  useEffect(() => {
    if (formData.tanggal) {
      fetchAvailableSlots(formData.tanggal);
    }
  }, [formData.tanggal]);

  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch (error) {
      console.error("Failed to fetch layanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (tanggal) => {
    setSlotsLoading(true);
    try {
      const response = await jadwalService.getAvailable(tanggal);
      console.log("Slots response:", response);
      setAvailableSlots(response.data || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleLayananSelect = (item) => {
    setFormData((prev) => ({ ...prev, id_layanan: item.id }));
    setSelectedLayanan(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.id_layanan) {
          toast.error("Pilih layanan terlebih dahulu");
          return false;
        }
        break;
      case 2:
        if (!formData.tanggal) {
          newErrors.tanggal = "Tanggal wajib dipilih";
        }
        if (!formData.waktu) {
          newErrors.waktu = "Waktu wajib dipilih";
        }
        break;
      case 3:
        if (!formData.alamat.trim()) {
          newErrors.alamat = "Alamat wajib diisi";
        }
        if (!formData.keluhan.trim()) {
          newErrors.keluhan = "Keluhan wajib diisi";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await bookingService.create(formData);
      toast.success("Booking berhasil dibuat!");
      navigate(`/bookings/${response.data.id}`);
    } catch (error) {
      const message = error.response?.data?.message || "Gagal membuat booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
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

  // Get min date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Steps */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-sky-500 text-white"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block ${
                      isActive
                        ? "text-sky-500"
                        : isCompleted
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-2 rounded-full ${
                      isCompleted ? "bg-emerald-500" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Pilih Layanan */}
          {currentStep === 1 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Pilih Layanan Fisioterapi
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {layanan.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLayananSelect(item)}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      formData.id_layanan === item.id
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 hover:border-sky-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {item.nama}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {item.deskripsi}
                        </p>
                      </div>
                      {formData.id_layanan === item.id && (
                        <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <span className="text-lg font-bold text-sky-500">
                        Rp {item.harga?.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm text-slate-400">
                        {item.durasi} menit
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Jadwal */}
          {currentStep === 2 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Pilih Tanggal & Waktu
              </h2>
              <div className="space-y-4">
                <Input
                  label="Tanggal"
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  error={errors.tanggal}
                  min={getMinDate()}
                  max={getMaxDate()}
                  leftIcon={Calendar}
                />

                {formData.tanggal && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Waktu Tersedia
                    </label>
                    {slotsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-slate-500">
                          Memuat jadwal...
                        </span>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => {
                          const waktu =
                            slot.waktu_mulai?.slice(0, 5) || slot.waktu;
                          const tersedia =
                            slot.status === "tersedia" || slot.tersedia;
                          return (
                            <button
                              key={slot.id || waktu}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  waktu: waktu,
                                }))
                              }
                              disabled={!tersedia}
                              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                                formData.waktu === waktu
                                  ? "bg-sky-500 text-white"
                                  : tersedia
                                  ? "bg-slate-100 text-slate-700 hover:bg-sky-50"
                                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
                              }`}
                            >
                              {waktu}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <p className="text-sm text-amber-700">
                          Tidak ada jadwal tersedia untuk tanggal ini. Pastikan
                          backend berjalan.
                        </p>
                      </div>
                    )}
                    {errors.waktu && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.waktu}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 3: Detail */}
          {currentStep === 3 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Informasi Detail
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Masukkan alamat lengkap untuk kunjungan fisioterapi..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.alamat ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.alamat && (
                    <p className="mt-1 text-sm text-red-500">{errors.alamat}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link Google Maps{" "}
                    <span className="text-slate-400 font-normal">
                      (opsional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="koordinat"
                      value={formData.koordinat}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Bagikan lokasi dari Google Maps untuk memudahkan
                    fisioterapis menemukan alamat Anda
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Keluhan / Kondisi
                  </label>
                  <textarea
                    name="keluhan"
                    value={formData.keluhan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Jelaskan keluhan atau kondisi yang dialami..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.keluhan ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors.keluhan && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.keluhan}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        value: "cash_on_visit",
                        label: "Bayar di Tempat",
                        icon: CreditCard,
                      },
                      {
                        value: "transfer_on_visit",
                        label: "Transfer",
                        icon: CreditCard,
                      },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              metode_pembayaran: method.value,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                            formData.metode_pembayaran === method.value
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 hover:border-sky-200"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-700">
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Konfirmasi */}
          {currentStep === 4 && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Konfirmasi Booking
              </h2>
              <div className="space-y-4">
                {/* Service */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Layanan</p>
                  <p className="font-semibold text-slate-800">
                    {selectedLayanan?.nama}
                  </p>
                  <p className="text-sky-500 font-bold mt-1">
                    Rp {selectedLayanan?.harga?.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Schedule */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Tanggal</p>
                    <p className="font-semibold text-slate-800">
                      {formatDate(formData.tanggal)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Waktu</p>
                    <p className="font-semibold text-slate-800">
                      {formData.waktu} WIB
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Alamat</p>
                  <p className="font-semibold text-slate-800">
                    {formData.alamat}
                  </p>
                </div>

                {/* Keluhan */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Keluhan</p>
                  <p className="font-semibold text-slate-800">
                    {formData.keluhan}
                  </p>
                </div>

                {/* Payment */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">
                    Metode Pembayaran
                  </p>
                  <p className="font-semibold text-slate-800">
                    {formData.metode_pembayaran === "cash_on_visit"
                      ? "Bayar di Tempat"
                      : "Transfer"}
                  </p>
                </div>

                {/* Total */}
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between">
                  <span className="font-medium text-slate-700">
                    Total Pembayaran
                  </span>
                  <span className="text-2xl font-bold text-sky-500">
                    Rp {selectedLayanan?.harga?.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </Button>

        {currentStep < 4 ? (
          <Button onClick={nextStep}>
            Lanjut
            <ArrowRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={submitting}>
            <Check className="w-5 h-5" />
            Konfirmasi Booking
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateBooking;
