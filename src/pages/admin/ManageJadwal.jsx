import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jadwalService } from "../../services";
import { LoadingSpinner } from "../../components/common";
import {
  DeleteSlotModal,
  JadwalCalendar,
  JadwalHeader,
  SlotFormModal,
  SlotsPanel,
} from "./components/jadwal";

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

  const handleToggleHoliday = () => {
    if (!selectedDate) return;
    if (isSelectedHoliday) {
      handleCancelHoliday(selectedDate);
    } else {
      handleSetHoliday(selectedDate);
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
    slots.every((slot) => slot.status === "libur");
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
      <JadwalHeader canManageDate={canManageDate} onCreate={handleOpenCreate} />

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <JadwalCalendar
          monthYear={monthYear}
          days={getDaysInMonth(currentMonth)}
          selectedDate={selectedDate}
          selectedDateFormatted={selectedDateFormatted}
          isSelectedHoliday={isSelectedHoliday}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onSelectDate={setSelectedDate}
          onToggleHoliday={handleToggleHoliday}
        />

        <SlotsPanel
          selectedDate={selectedDate}
          selectedDateFormatted={selectedDateFormatted}
          isSelectedHoliday={isSelectedHoliday}
          slots={slots}
          slotsLoading={slotsLoading}
          onToggleHoliday={handleToggleHoliday}
          onOpenCreate={handleOpenCreate}
          onBlock={handleBlockSlot}
          onUnblock={handleUnblockSlot}
          onEdit={handleOpenEdit}
          onDelete={handleConfirmDelete}
          isPastDate={isPastDate}
          isPastSlot={isPastSlot}
          formatTime={formatTime}
        />
      </div>

      <SlotFormModal
        isOpen={showFormModal}
        editingSlot={editingSlot}
        formData={formData}
        canManageDate={canManageDate}
        submitting={submitting}
        onChange={handleFormChange}
        onClose={handleCloseForm}
        onSubmit={handleSubmitSlot}
      />

      <DeleteSlotModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingSlot(null);
        }}
        onConfirm={handleDeleteSlot}
        submitting={submitting}
        deletingSlot={deletingSlot}
        formatTime={formatTime}
      />
    </div>
  );
};

export default ManageJadwal;
