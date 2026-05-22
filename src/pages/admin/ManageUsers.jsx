import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Users,
  ShieldCheck,
  Filter,
  X,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import {
  Card,
  Button,
  Input,
  LoadingSpinner,
  Modal,
  EmptyState,
} from "../../components/common";

/* ─── Avatar color pool ─────────────────────────────────────── */
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

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 ${color} flex items-center gap-4`}>
    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs font-medium text-white/70 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-white leading-none mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

/* ─── User Card ─────────────────────────────────────────────── */
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
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-linear-to-r ${color.bg}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
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

          {/* Action menu */}
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

        {/* Info rows */}
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

        {/* Footer */}
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

/* ─── Main Page ─────────────────────────────────────────────── */
const ManageUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editData, setEditData] = useState({ nama: "", telepon: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data?.users || response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nama?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.telepon?.includes(search),
      );
    }
    if (roleFilter !== "all")
      filtered = filtered.filter((u) => u.role === roleFilter);
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditData({
      nama: user.nama || "",
      telepon: user.telepon || "",
      role: user.role || "pasien",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setActionLoading(true);
    try {
      await adminService.updateUser(selectedUser.id, editData);
      toast.success("User berhasil diperbarui");
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      toast.success("User berhasil dihapus");
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    } finally {
      setActionLoading(false);
    }
  };

  const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalPasien = users.filter((u) => u.role === "pasien").length;
  const totalVerified = users.filter((u) => u.is_verified).length;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-1">
              Administrasi
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
              Kelola Pengguna
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {users.length} pengguna terdaftar
            </p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            icon={Users}
            label="Total Pengguna"
            value={users.length}
            color="bg-gradient-to-br from-sky-500 to-indigo-600"
          />
          <StatCard
            icon={ShieldCheck}
            label="Admin"
            value={totalAdmin}
            color="bg-gradient-to-br from-violet-500 to-purple-700"
          />
          <div className="col-span-2 sm:col-span-1">
            <StatCard
              icon={UserCheck}
              label="Terverifikasi"
              value={totalVerified}
              color="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
          </div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama, email, atau telepon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Role filter pills (mobile-friendly) */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {["all", "pasien", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
                    roleFilter === r
                      ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {r === "all" ? "Semua" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Active filter badge */}
          <AnimatePresence>
            {(search || roleFilter !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500"
              >
                <span>Menampilkan</span>
                <span className="font-semibold text-slate-700">
                  {filteredUsers.length}
                </span>
                <span>dari {users.length} pengguna</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Users Grid ── */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, i) => (
                <UserCard
                  key={user.id}
                  user={user}
                  index={i}
                  onEdit={handleEdit}
                  onDelete={(u) => {
                    setSelectedUser(u);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Tidak ada pengguna ditemukan
            </h3>
            <p className="text-sm text-slate-400">
              Coba ubah kata kunci atau filter pencarian
            </p>
          </div>
        )}

        {/* ── Edit Modal ── */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Pengguna"
          responsive
          footerClassName="flex-col sm:flex-row"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSaveEdit} loading={actionLoading}>
                Simpan Perubahan
              </Button>
            </>
          }
        >
          {selectedUser && (
            <div className="space-y-5">
              {/* User preview */}
              <div
                className={`flex items-center gap-3 p-4 rounded-2xl bg-linear-to-br ${avatarColor(selectedUser.nama).bg} bg-opacity-10`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-linear-to-br ${avatarColor(selectedUser.nama).bg} flex items-center justify-center text-white text-lg font-bold`}
                >
                  {selectedUser.nama?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedUser.nama}
                  </p>
                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              <Input
                label="Nama Lengkap"
                value={editData.nama}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, nama: e.target.value }))
                }
                leftIcon={User}
              />
              <Input
                label="Nomor Telepon"
                value={editData.telepon}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, telepon: e.target.value }))
                }
                leftIcon={Phone}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role Pengguna
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["pasien", "admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditData((p) => ({ ...p, role: r }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                        editData.role === r
                          ? r === "admin"
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {r === "admin" ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* ── Delete Modal ── */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Hapus Pengguna"
          responsive
          footerClassName="flex-col sm:flex-row"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={actionLoading}
              >
                Ya, Hapus
              </Button>
            </>
          }
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <p className="font-semibold text-slate-800 mb-2">
              Hapus <span className="text-red-500">{selectedUser?.nama}</span>?
            </p>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Data pengguna ini akan dihapus permanen dan tidak dapat dipulihkan
              kembali.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUsers;
