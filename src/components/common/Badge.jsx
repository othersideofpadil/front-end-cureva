import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Truck,
  Play,
  Calendar,
} from "lucide-react";

const statusConfig = {
  menunggu: {
    label: "Menunggu",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  dibayar: {
    label: "Dibayar",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  gagal: {
    label: "Gagal",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  menunggu_konfirmasi: {
    label: "Menunggu Konfirmasi",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  dikonfirmasi: {
    label: "Dikonfirmasi",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: CheckCircle,
  },
  dijadwalkan: {
    label: "Dijadwalkan",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: Calendar,
  },
  dalam_perjalanan: {
    label: "Dalam Perjalanan",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
  },
  sedang_berlangsung: {
    label: "Sedang Berlangsung",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: Play,
  },
  selesai: {
    label: "Selesai",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  ditolak: {
    label: "Ditolak",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  dibatalkan_pasien: {
    label: "Dibatalkan",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
  dibatalkan_sistem: {
    label: "Dibatalkan Sistem",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: AlertCircle,
  },
};

const Badge = ({ status, size = "responsive", showIcon = true }) => {
  const config = statusConfig[status] || {
    label: status,
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
    responsive:
      "px-2 py-0.5 text-xs gap-1 sm:px-2.5 sm:py-1 sm:text-sm sm:gap-1.5 lg:px-3 lg:py-1.5 lg:text-sm lg:gap-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    responsive: "w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4",
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center font-medium rounded-full border whitespace-nowrap
        ${config.color}
        ${sizes[size] || sizes.md}
      `}
    >
      {showIcon && <Icon className={iconSizes[size] || iconSizes.md} />}
      <span className="max-w-36 truncate sm:max-w-none">
        {config.label}
      </span>
    </motion.span>
  );
};

export default Badge;
