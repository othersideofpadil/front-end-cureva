import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Lock,
  Plus,
  Unlock,
  AlertCircle,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarOff,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
import { jadwalService } from "../../services";
import {
  Card,
  Button,
  LoadingSpinner,
  Modal,
  Input,
} from "../../components/common";

/* ─── Status helpers ──────────────────────────────────────────────── */
const STATUS_CONFIG = {
  tersedia: {
    label: "Tersedia",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  dipesan: {
    label: "Terpesan",
    icon: Bookmark,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  diblock_admin: {
    label: "Diblokir",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  libur: {
    label: "Libur",
    icon: CalendarOff,
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-300",
  },
};

const SlotCard = ({ slot, pastSlot, onBlock, onUnblock, onEdit, onDelete }) => {
  const cfg = STATUS_CONFIG[slot.status] ?? STATUS_CONFIG.tersedia;
  const Icon = cfg.icon;
  const isEditable =
    !pastSlot && slot.status !== "dipesan" && slot.status !== "libur";
  const isDeletable = !pastSlot && slot.status !== "dipesan";

  const formatTime = (t) => t?.slice(0, 5) ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18 }}
      className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-4 flex flex-col gap-3 ${
        pastSlot ? "opacity-50" : ""
      }`}
    >
      {/* Time */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-800 text-base leading-none">
          {formatTime(slot.waktu_mulai)}
        </span>
      </div>
      {/* Status badge — own row so it never clips */}
      <span
        className={`self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cfg.bg} ${cfg.text} border ${cfg.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
        {cfg.label}
      </span>

      {/* Booking code */}
      {slot.kode_booking && (
        <p className="text-xs text-slate-400 font-mono -mt-1">
          {slot.kode_booking}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-1 border-t border-black/5">
        {slot.status === "tersedia" && (
          <button
            onClick={() => onBlock(slot.id)}
            className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-100 rounded-lg px-2 py-1 transition-colors"
          >
            <Lock className="w-3 h-3" />
            Blokir
          </button>
        )}
        {slot.status === "diblock_admin" && (
          <button
            onClick={() => onUnblock(slot.id)}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:bg-emerald-100 rounded-lg px-2 py-1 transition-colors"
          >
            <Unlock className="w-3 h-3" />
            Buka
          </button>
        )}
        <button
          onClick={() => onEdit(slot)}
          disabled={!isEditable}
          className="flex items-center gap-1 text-xs text-slate-500 hover:bg-white hover:text-slate-700 rounded-lg px-2 py-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete(slot)}
          disabled={!isDeletable}
          className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Trash2 className="w-3 h-3" />
          Hapus
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Summary strip ───────────────────────────────────────────────── */
const SlotSummary = ({ slots }) => {
  const counts = slots.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  const items = [
    {
      key: "tersedia",
      label: "Tersedia",
      color: "text-emerald-600 bg-emerald-50",
    },
    { key: "dipesan", label: "Terpesan", color: "text-sky-600 bg-sky-50" },
    {
      key: "diblock_admin",
      label: "Diblokir",
      color: "text-red-500 bg-red-50",
    },
    { key: "libur", label: "Libur", color: "text-slate-500 bg-slate-100" },
  ].filter((i) => counts[i.key]);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((i) => (
        <span
          key={i.key}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${i.color}`}
        >
          <span className="font-bold">{counts[i.key]}</span>
          {i.label}
        </span>
      ))}
    </div>
  );
};

/* ─── Main component ──────────────────────────────────────────────── */
const ManageJadwal = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    status: "tersedia",
    keterangan: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate]);

  const fetchSlots = async (date) => {
    setSlotsLoading(true);
    try {
      const response = await jadwalService.getSlots(date);
      setSlots(response.data || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBlockSlot = async (slotId) => {
    try {
      await jadwalService.blockSlot(slotId);
      toast.success("Slot berhasil diblokir");
      fetchSlots(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memblokir slot");
    }
  };

  const handleUnblockSlot = async (slotId) => {
    try {
      await jadwalService.unblockSlot(slotId);
      toast.success("Slot berhasil dibuka");
      fetchSlots(selectedDate);
    } catch {
      toast.error("Gagal membuka slot");
    }
  };

  const handleSetHoliday = async (date) => {
    if (!date) return toast.error("Pilih tanggal terlebih dahulu");
    try {
      await jadwalService.setHoliday(date);
      toast.success("Tanggal ditandai sebagai libur");
      fetchSlots(date);
    } catch {
      toast.error("Gagal menandai libur");
    }
  };

  const handleCancelHoliday = async (date) => {
    if (!date) return toast.error("Pilih tanggal terlebih dahulu");
    try {
      await jadwalService.cancelHoliday(date);
      toast.success("Libur dibatalkan untuk tanggal ini");
      fetchSlots(date);
    } catch {
      toast.error("Gagal membatalkan libur");
    }
  };

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";
  const normalizeTimeSeconds = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  };
  const normalizeKeterangan = (value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  };
  const getTodayDateStr = () => new Date().toISOString().split("T")[0];
  const isPastDate = (dateStr) => !!dateStr && dateStr < getTodayDateStr();
  const isPastSlot = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const d = new Date(`${dateStr}T${timeStr}`);
    return !Number.isNaN(d.getTime()) && d < new Date();
  };

  const resetForm = (date) =>
    setFormData({
      tanggal: date || "",
      waktu_mulai: "",
      waktu_selesai: "",
      status: "tersedia",
      keterangan: "",
    });

  const handleOpenCreate = () => {
    resetForm(selectedDate);
    setEditingSlot(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      tanggal: slot.tanggal || selectedDate || "",
      waktu_mulai: formatTime(slot.waktu_mulai),
      waktu_selesai: formatTime(slot.waktu_selesai),
      status: slot.status || "tersedia",
      keterangan: slot.keterangan || "",
    });
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingSlot(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSlot = async (e) => {
    e.preventDefault();
    if (!formData.tanggal) return toast.error("Tanggal harus dipilih");
    if (!editingSlot && (!formData.waktu_mulai || !formData.waktu_selesai)) {
      return toast.error("Waktu mulai dan selesai wajib diisi");
    }
    setSubmitting(true);
    try {
      if (editingSlot) {
        const keterangan = normalizeKeterangan(formData.keterangan);
        await jadwalService.updateSlot(editingSlot.id, {
          status: formData.status,
          ...(keterangan ? { keterangan } : {}),
        });
        toast.success("Slot berhasil diperbarui");
      } else {
        const keterangan = normalizeKeterangan(formData.keterangan);
        await jadwalService.createSlot({
          tanggal: formData.tanggal,
          waktu_mulai: normalizeTimeSeconds(formData.waktu_mulai),
          waktu_selesai: normalizeTimeSeconds(formData.waktu_selesai),
          status: formData.status || "tersedia",
          ...(keterangan ? { keterangan } : {}),
        });
        toast.success("Slot berhasil ditambahkan");
      }
      handleCloseForm();
      if (selectedDate) fetchSlots(selectedDate);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      const serverErrors = error.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        toast.error(
          serverErrors[0].message || serverMessage || "Gagal menyimpan slot",
        );
      } else {
        toast.error(serverMessage || "Gagal menyimpan slot");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = (slot) => {
    setDeletingSlot(slot);
    setShowDeleteModal(true);
  };

  const handleDeleteSlot = async () => {
    if (!deletingSlot) return;
    setSubmitting(true);
    try {
      await jadwalService.deleteSlot(deletingSlot.id);
      toast.success("Slot berhasil dihapus");
      setShowDeleteModal(false);
      setDeletingSlot(null);
      if (selectedDate) fetchSlots(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus slot");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Calendar helpers ── */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push({ day: null, date: null });
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        day: i,
        date: dateStr,
        isToday: dateStr === getTodayDateStr(),
        isSelected: selectedDate === dateStr,
        isPast: isPastDate(dateStr),
      });
    }
    return days;
  };

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );

  const monthYear = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const isSelectedHoliday =
    selectedDate &&
    slots.length > 0 &&
    slots.every((s) => s.status === "libur");
  const canManageDate = selectedDate && !isPastDate(selectedDate);

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Kelola Jadwal
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Atur jadwal slot praktik fisioterapis
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleOpenCreate}
            leftIcon={Plus}
            disabled={!canManageDate}
            size="sm"
          >
            Tambah Slot
          </Button>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        {/* ── Calendar card ── */}
        <Card className="self-start">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-semibold text-slate-700 capitalize">
              {monthYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-slate-400 py-1.5"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {getDaysInMonth(currentMonth).map((item, idx) => (
              <button
                key={idx}
                disabled={!item.day}
                onClick={() => item.date && setSelectedDate(item.date)}
                className={[
                  "aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all select-none",
                  !item.day ? "invisible" : "",
                  item.isSelected
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                    : item.isToday
                      ? "ring-2 ring-sky-400 ring-offset-1 text-sky-600 font-semibold"
                      : item.isPast
                        ? "text-slate-300 cursor-default"
                        : "text-slate-700 hover:bg-slate-100",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.day}
              </button>
            ))}
          </div>

          {/* Selected date info */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            {selectedDate ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Tanggal Dipilih
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize leading-snug">
                      {selectedDateFormatted}
                    </p>
                  </div>
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                </div>

                {/* Holiday toggle */}
                <button
                  onClick={() =>
                    isSelectedHoliday
                      ? handleCancelHoliday(selectedDate)
                      : handleSetHoliday(selectedDate)
                  }
                  className={[
                    "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
                    isSelectedHoliday
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
                  ].join(" ")}
                >
                  <CalendarOff className="w-3.5 h-3.5" />
                  {isSelectedHoliday
                    ? "Batalkan Hari Libur"
                    : "Tandai Hari Libur"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-1">
                Pilih tanggal di kalender
              </p>
            )}
          </div>
        </Card>

        {/* ── Slots panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="min-h-90 flex flex-col">
            {/* Panel header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Slot Waktu
                </h3>
                {selectedDate && (
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">
                    {selectedDateFormatted}
                  </p>
                )}
              </div>
              {selectedDate && (
                <button
                  onClick={() =>
                    isSelectedHoliday
                      ? handleCancelHoliday(selectedDate)
                      : handleSetHoliday(selectedDate)
                  }
                  className={[
                    "self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border",
                    isSelectedHoliday
                      ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
                  ].join(" ")}
                >
                  <CalendarOff className="w-3.5 h-3.5" />
                  {isSelectedHoliday ? "Batalkan Libur" : "Tandai Libur"}
                </button>
              )}
            </div>

            {/* Content */}
            {!selectedDate ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-sm">Pilih tanggal untuk melihat slot</p>
              </div>
            ) : slotsLoading ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : slots.length > 0 ? (
              <>
                <SlotSummary slots={slots} />
                <AnimatePresence>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        pastSlot={
                          isPastDate(selectedDate) ||
                          isPastSlot(selectedDate, formatTime(slot.waktu_mulai))
                        }
                        onBlock={handleBlockSlot}
                        onUnblock={handleUnblockSlot}
                        onEdit={handleOpenEdit}
                        onDelete={handleConfirmDelete}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Belum ada slot
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Belum ada slot untuk tanggal ini
                  </p>
                </div>
                <Button size="sm" onClick={handleOpenCreate} leftIcon={Plus}>
                  Tambah Slot
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Form Modal ── */}
      <Modal
        isOpen={showFormModal}
        onClose={handleCloseForm}
        title={editingSlot ? "Edit Slot" : "Tambah Slot Baru"}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={handleCloseForm}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="slot-form"
              loading={submitting}
              disabled={!canManageDate}
            >
              Simpan
            </Button>
          </>
        }
      >
        <form id="slot-form" onSubmit={handleSubmitSlot} className="space-y-4">
          <Input
            label="Tanggal"
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleFormChange}
            disabled
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu Mulai"
              type="time"
              name="waktu_mulai"
              value={formData.waktu_mulai}
              onChange={handleFormChange}
              disabled={!!editingSlot}
              required={!editingSlot}
            />
            <Input
              label="Waktu Selesai"
              type="time"
              name="waktu_selesai"
              value={formData.waktu_selesai}
              onChange={handleFormChange}
              disabled={!!editingSlot}
              required={!editingSlot}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            >
              <option value="tersedia">Tersedia</option>
              <option value="diblock_admin">Diblokir</option>
              <option value="libur">Libur</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Keterangan{" "}
              <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleFormChange}
              rows={3}
              placeholder="Tambahkan catatan jika diperlukan..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none"
            />
          </div>

          {!canManageDate && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Slot hanya bisa dibuat untuk tanggal hari ini atau setelahnya.
              </p>
            </div>
          )}
        </form>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingSlot(null);
        }}
        title="Hapus Slot"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingSlot(null);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSlot}
              loading={submitting}
            >
              Hapus
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Slot ini akan dihapus secara permanen dan tidak dapat dikembalikan.
          </p>
          {deletingSlot && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {formatTime(deletingSlot.waktu_mulai)} —{" "}
                  {formatTime(deletingSlot.waktu_selesai)}
                </p>
                <p className="text-xs text-slate-400">
                  {deletingSlot.tanggal} · {deletingSlot.status}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageJadwal;
