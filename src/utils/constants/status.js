export const STATUS_META = {
  menunggu_konfirmasi: { label: "Menunggu", color: "amber" },
  dikonfirmasi: { label: "Dikonfirmasi", color: "sky" },
  dijadwalkan: { label: "Dijadwalkan", color: "blue" },
  dalam_perjalanan: { label: "Dalam Perjalanan", color: "violet" },
  sedang_berlangsung: { label: "Berlangsung", color: "emerald" },
  selesai: { label: "Selesai", color: "green" },
  ditolak: { label: "Ditolak", color: "red" },
  dibatalkan_pasien: { label: "Dibatalkan", color: "slate" },
  dibatalkan_sistem: { label: "Dibatalkan Sistem", color: "slate" },
};

// Daftar status untuk dropdown filter (BookingList)
export const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dijadwalkan", label: "Dijadwalkan" },
  { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
  { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan_pasien", label: "Dibatalkan" },
];

// Warna badge per color key — dipakai statusBadgeClass di admin
export const BADGE_COLOR_MAP = {
  amber: "bg-amber-50   text-amber-600   border-amber-100",
  sky: "bg-sky-50     text-sky-600     border-sky-100",
  blue: "bg-blue-50    text-blue-600    border-blue-100",
  violet: "bg-violet-50  text-violet-600  border-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  green: "bg-green-50   text-green-600   border-green-100",
  red: "bg-red-50     text-red-600     border-red-100",
  slate: "bg-slate-50   text-slate-500   border-slate-100",
};

export const statusBadgeClass = (status) => {
  return `text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
    BADGE_COLOR_MAP[STATUS_META[status]?.color || "slate"]
  }`;
};

export const accentBar = (status) => {
  const map = {
    menunggu_konfirmasi: "bg-amber-400",
    dikonfirmasi: "bg-sky-400",
    dijadwalkan: "bg-blue-400",
    dalam_perjalanan: "bg-violet-400",
    sedang_berlangsung: "bg-emerald-400",
    selesai: "bg-green-400",
    ditolak: "bg-red-400",
    dibatalkan_pasien: "bg-slate-300",
    dibatalkan_sistem: "bg-slate-300",
  };
  return map[status] || "bg-slate-200";
};

export const BOOKING_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dijadwalkan", label: "Dijadwalkan" },
  { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
  { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan_pasien", label: "Dibatalkan" },
];

export const getValidStatusTransitions = (current) => {
  const transitions = {
    menunggu_konfirmasi: [
      { value: "dikonfirmasi", label: "Dikonfirmasi" },
      { value: "ditolak", label: "Ditolak" },
    ],
    dikonfirmasi: [
      { value: "dijadwalkan", label: "Dijadwalkan" },
      { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
      { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
      { value: "selesai", label: "Selesai" },
      { value: "dibatalkan_sistem", label: "Dibatalkan" },
    ],
    dijadwalkan: [
      { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
      { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
      { value: "selesai", label: "Selesai" },
      { value: "dibatalkan_sistem", label: "Dibatalkan" },
    ],
    dalam_perjalanan: [
      { value: "sedang_berlangsung", label: "Sedang Berlangsung" },
      { value: "selesai", label: "Selesai" },
      { value: "dibatalkan_sistem", label: "Dibatalkan" },
    ],
    sedang_berlangsung: [{ value: "selesai", label: "Selesai" }],
    selesai: [],
    ditolak: [],
    dibatalkan_pasien: [],
    dibatalkan_sistem: [],
  };
  return transitions[current] || [];
};
