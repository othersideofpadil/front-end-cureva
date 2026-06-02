import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Edit,
  Mail,
  MoreHorizontal,
  Phone,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
  UserX,
} from "lucide-react";

const AVATAR_COLORS = [
  { bg: "from-violet-500 to-purple-600", ring: "ring-violet-200" },
  { bg: "from-sky-400 to-cyan-500", ring: "ring-sky-200" },
  { bg: "from-rose-400 to-pink-500", ring: "ring-rose-200" },
  { bg: "from-amber-400 to-orange-500", ring: "ring-amber-200" },
  { bg: "from-emerald-400 to-teal-500", ring: "ring-emerald-200" },
  { bg: "from-indigo-400 to-blue-500", ring: "ring-indigo-200" },
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const UserCard = ({ user, index, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = avatarColor(user.nama);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className={`h-1 w-full bg-linear-to-r ${color.bg}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-linear-to-br ${color.bg} ring-4 ${color.ring} flex items-center justify-center text-white text-lg font-bold shrink-0`}
            >
              {user.nama?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm leading-tight truncate max-w-32.5">
                {user.nama}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                  user.role === "admin"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                {user.role === "admin" ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {user.role}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20"
                  >
                    <button
                      onClick={() => {
                        onEdit(user);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Pengguna
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => {
                        onDelete(user);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.telepon && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {user.telepon}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            Bergabung {formatDate(user.created_at)}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {user.is_verified ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <UserCheck className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                <UserX className="w-3.5 h-3.5" />
                Belum verifikasi
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">
            {user.total_booking || 0}
            <span className="font-normal"> booking</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
