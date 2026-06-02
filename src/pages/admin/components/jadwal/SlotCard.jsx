import { motion } from "framer-motion";
import { Clock, Edit2, Lock, Unlock, Trash2 } from "lucide-react";

const STATUS_CONFIG = {
  tersedia: {
    label: "Tersedia",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  dipesan: {
    label: "Terpesan",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  diblock_admin: {
    label: "Diblokir",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  libur: {
    label: "Libur",
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-300",
  },
};

const SlotCard = ({ slot, pastSlot, onBlock, onUnblock, onEdit, onDelete }) => {
  const cfg = STATUS_CONFIG[slot.status] ?? STATUS_CONFIG.tersedia;
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
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-800 text-base leading-none">
          {formatTime(slot.waktu_mulai)}
        </span>
      </div>

      <span
        className={`self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cfg.bg} ${cfg.text} border ${cfg.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
        {cfg.label}
      </span>

      {slot.kode_booking && (
        <p className="text-xs text-slate-400 font-mono -mt-1">
          {slot.kode_booking}
        </p>
      )}

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

export default SlotCard;
