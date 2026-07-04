import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";
import { formatCurrency } from "./formatters";

export const quickStatsFromData = (stats) => [
  {
    icon: Calendar,
    bg: "bg-sky-100",
    iconColor: "text-sky-500",
    value: stats.todayBookings || 0,
    label: "Booking Hari Ini",
  },
  {
    icon: CheckCircle,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    value: stats.completedBookings || 0,
    label: "Booking Selesai",
  },
  {
    icon: AlertCircle,
    bg: "bg-amber-100",
    iconColor: "text-amber-500",
    value: stats.pendingBookings || 0,
    label: "Perlu Tindakan",
  },
];

export const statCardsFromData = (stats) => [
  {
    title: "Total Pengguna Pasien",
    value: stats.totalUsers,
    icon: Users,
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    caption: `Total Admin: ${stats.totalLayanan || 0}`,
    href: "/admin/users",
  },
  {
    title: "Total Booking",
    value: stats.totalBookings,
    icon: Calendar,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    caption: `Bulan ini: ${stats.monthStats?.total_pemesanan || 0}`,
    href: "/admin/bookings",
  },
  {
    title: "Menunggu Konfirmasi",
    value: stats.pendingBookings,
    icon: Clock,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    caption: `Bulan ini: ${stats.monthStats?.menunggu || 0}`,
    href: "/admin/bookings",
  },
  {
    title: "Total Pendapatan",
    value: formatCurrency(stats.totalRevenue),
    icon: CreditCard,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    caption: `Bulan ini: ${formatCurrency(stats.monthStats?.total_dibayar || 0)}`,
    href: "/admin/payments",
  },
];
