import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  Save,
  CheckCircle,
  X,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services";

const StarRating = ({ value }) => {
  const numeric = Number(value);
  const isValid = !isNaN(numeric) && value !== null && value !== undefined;
  const rating = isValid ? Math.min(5, Math.max(0, numeric)) : 0;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = !filled && rating > star - 1;
          const pct = partial ? Math.round((rating - (star - 1)) * 100) : 0;
          return (
            <span key={star} className="relative w-4 h-4 inline-block">
              {/* Empty star */}
              <Star className="w-4 h-4 text-slate-200 fill-slate-200 absolute inset-0" />
              {/* Filled portion */}
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : `${pct}%` }}
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const avatarInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarRemoved, setAvatarRemoved] = useState(false);
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

  const formatRating = (value) => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    const fixed = num.toFixed(1);
    return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || "",
        email: user.email || "",
        telepon: user.telepon || "",
        alamat: user.alamat || "",
      });
      setAvatarPreview(user.avatar_url || "");
      setAvatarFile(null);
      setAvatarRemoved(false);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const ratio = image.width / image.height;
      const isSquareLike = ratio >= 0.9 && ratio <= 1.1;

      if (!isSquareLike) {
        URL.revokeObjectURL(previewUrl);
        e.target.value = "";
        toast.error("Rasio gambar harus mendekati 1:1. Silakan crop dulu.");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(previewUrl);
      setAvatarRemoved(false);
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      e.target.value = "";
      toast.error("Gagal membaca gambar");
    };

    image.src = previewUrl;
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarRemoved(true);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    toast.success("Avatar akan dihapus saat disimpan");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("nama", formData.nama);
      payload.append("telepon", formData.telepon);
      payload.append("alamat", formData.alamat);
      if (avatarRemoved) {
        payload.append("remove_avatar", "1");
      }
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      await updateProfile(payload);
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
        passwordData.newPassword,
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

  const ratingValue = formatRating(user?.avg_rating);
  const avatarSrc = avatarRemoved
    ? ""
    : avatarPreview || user?.avatar_url || "";

  const stats = [
    { label: "Total Booking", value: user?.total_booking ?? 0 },
    { label: "Selesai", value: user?.booking_selesai ?? 0 },
    {
      label: "Rating",
      value:
        ratingValue !== null ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-slate-800 leading-none">
              {ratingValue}
              <span className="text-xs font-normal text-slate-400">/5</span>
            </span>
            <StarRating value={user?.avg_rating} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-slate-800 leading-none">
              -
            </span>
            <StarRating value={0} />
          </div>
        ),
    },
    {
      label: "Bergabung",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Profil Saya
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Kelola informasi dan keamanan akun Anda
        </p>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-linear-to-r from-sky-400 via-indigo-400 to-violet-400 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='18'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="relative inline-block -mt-10 mb-3">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200 overflow-hidden relative">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.nama || "Avatar pengguna"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.nama?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm"
              title="Ganti foto profil"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Ganti Avatar
            </button>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
            >
              Hapus Avatar
            </button>
          </div>

          {/* Meta */}
          <div>
            <p className="text-lg font-bold text-slate-800 leading-tight">
              {user?.nama || "Nama Pengguna"}
            </p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.is_verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                  <CheckCircle className="w-3 h-3" /> Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100">
                  Belum Terverifikasi
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100 capitalize">
                {user?.role || "pasien"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 divide-x divide-y sm:divide-y-0 divide-slate-100">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center">
              {typeof stat.value === "object" ? (
                stat.value
              ) : (
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
              )}
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Informasi Pribadi
          </span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput
              label="Nama Lengkap"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              icon={<User className="w-4 h-4" />}
              placeholder="Nama lengkap"
            />
            <FieldInput
              label="Email"
              name="email"
              value={formData.email}
              icon={<Mail className="w-4 h-4" />}
              disabled
              hint="Email tidak dapat diubah"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput
              label="Nomor Telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              icon={<Phone className="w-4 h-4" />}
              placeholder="08xxxxxxxxxx"
            />
            <div className="hidden sm:block" />
          </div>

          {/* Alamat */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows={3}
              placeholder="Masukkan alamat lengkap"
              className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition placeholder:text-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
            >
              <Lock className="w-4 h-4" /> Ubah Password
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-sky-500 to-indigo-500 rounded-xl hover:opacity-90 shadow-md shadow-sky-200 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowPasswordModal(false)
          }
        >
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Ubah Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
              <FieldInput
                label="Password Saat Ini"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Password saat ini"
              />
              <FieldInput
                label="Password Baru"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Minimal 6 karakter"
              />
              <FieldInput
                label="Konfirmasi Password Baru"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Ulangi password baru"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-sky-500 to-indigo-500 rounded-xl hover:opacity-90 shadow-md shadow-sky-100 disabled:opacity-60 transition"
              >
                {passwordLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Reusable Field Input */
const FieldInput = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
  disabled,
  hint,
  type = "text",
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-600">{label}</label>
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${icon ? "pl-9" : "pl-4"} pr-4 py-2.5 text-sm text-slate-800 border rounded-xl outline-none transition placeholder:text-slate-400
          ${
            disabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent focus:bg-white"
          }`}
      />
    </div>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

export default Profile;
