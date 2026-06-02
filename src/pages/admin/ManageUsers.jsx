import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import { LoadingSpinner } from "../../components/common";
import {
  DeleteUserModal,
  EditUserModal,
  UsersFilters,
  UsersGrid,
  UsersHeader,
  UsersStats,
} from "./components/users";

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
        (user) =>
          user.nama?.toLowerCase().includes(s) ||
          user.email?.toLowerCase().includes(s) ||
          user.telepon?.includes(search),
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
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

  const totalAdmin = users.filter((user) => user.role === "admin").length;
  const totalVerified = users.filter((user) => user.is_verified).length;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <UsersHeader usersCount={users.length} />

        <UsersStats
          total={users.length}
          totalAdmin={totalAdmin}
          totalVerified={totalVerified}
        />

        <UsersFilters
          search={search}
          roleFilter={roleFilter}
          filteredCount={filteredUsers.length}
          totalCount={users.length}
          onSearchChange={setSearch}
          onClearSearch={() => setSearch("")}
          onRoleChange={setRoleFilter}
        />

        <UsersGrid
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={(user) => {
            setSelectedUser(user);
            setShowDeleteModal(true);
          }}
        />

        <EditUserModal
          isOpen={showEditModal}
          selectedUser={selectedUser}
          editData={editData}
          onChange={(field, value) =>
            setEditData((prev) => ({ ...prev, [field]: value }))
          }
          onRoleChange={(role) => setEditData((prev) => ({ ...prev, role }))}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          actionLoading={actionLoading}
        />

        <DeleteUserModal
          isOpen={showDeleteModal}
          selectedUser={selectedUser}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
