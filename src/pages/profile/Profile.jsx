import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services";
import { Card, Button, Input, Modal } from "../../components/common";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        telepon: user.telepon || "",
        alamat: user.alamat || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        nama: formData.nama,
        telepon: formData.telepon,
        alamat: formData.alamat,
      });
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password baru tidak sama");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Password berhasil diubah");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi profil Anda</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-br from-sky-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.nama?.charAt(0).toUpperCase() || "U"}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 hover:text-sky-500 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800">{user?.nama}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {user?.is_verified ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Belum Terverifikasi
                </span>
              )}
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full capitalize">
                {user?.role || "pasien"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              leftIcon={User}
            />
            <Input
              label="Email"
              name="email"
              value={formData.email}
              disabled
              leftIcon={Mail}
              helperText="Email tidak dapat diubah"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              leftIcon={Phone}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows={3}
              placeholder="Masukkan alamat lengkap"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
            >
              <Lock className="w-4 h-4" />
              Ubah Password
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Booking", value: user?.total_booking || 0 },
          { label: "Selesai", value: user?.booking_selesai || 0 },
          { label: "Rating", value: user?.avg_rating || "-" },
          {
            label: "Bergabung",
            value: user?.created_at
              ? new Date(user.created_at).toLocaleDateString("id-ID", {
                  month: "short",
                  year: "numeric",
                })
              : "-",
          },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Ubah Password"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Batal
            </Button>
            <Button onClick={handleChangePassword} loading={passwordLoading}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Password Saat Ini"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Masukkan password saat ini"
            leftIcon={Lock}
          />
          <Input
            label="Password Baru"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Minimal 6 karakter"
            leftIcon={Lock}
          />
          <Input
            label="Konfirmasi Password Baru"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Ulangi password baru"
            leftIcon={Lock}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
