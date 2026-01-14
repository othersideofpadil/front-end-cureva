import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
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
  const [editData, setEditData] = useState({
    nama: "",
    telepon: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      // Backend returns { users: [], total: number }
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
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nama?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.telepon?.includes(search)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kelola Pengguna</h1>
        <p className="text-slate-500">Kelola semua pengguna aplikasi</p>
      </div>

      {/* Search & Filter */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari nama, email, atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Role</option>
            <option value="pasien">Pasien</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="relative">
                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <div className="relative group">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 hidden group-hover:block z-10">
                      <button
                        onClick={() => handleEdit(user)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.nama?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {user.nama}
                    </h3>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.telepon && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {user.telepon}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Bergabung {formatDate(user.created_at)}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {user.is_verified ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-600">
                          Terverifikasi
                        </span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-600">
                          Belum Verifikasi
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {user.total_booking || 0} booking
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={User}
            title="Tidak ada pengguna"
            description="Tidak ada pengguna yang sesuai dengan filter"
          />
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Pengguna"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} loading={actionLoading}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama"
            value={editData.nama}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, nama: e.target.value }))
            }
            leftIcon={User}
          />
          <Input
            label="Telepon"
            value={editData.telepon}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, telepon: e.target.value }))
            }
            leftIcon={Phone}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={editData.role}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="pasien">Pasien</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Pengguna"
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
              Hapus
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600">
            Apakah Anda yakin ingin menghapus{" "}
            <strong>{selectedUser?.nama}</strong>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
