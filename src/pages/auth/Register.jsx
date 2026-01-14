import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Heart,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Card } from "../../components/common";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    telepon: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }
    if (formData.telepon && !/^08[0-9]{8,11}$/.test(formData.telepon)) {
      newErrors.telepon = "Format telepon tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      await register(data);
      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Registrasi gagal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["", "Lemah", "Cukup", "Baik", "Kuat", "Sangat Kuat"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-500",
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const { strength, label, color } = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 py-8"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <img
              src="/images/logo.png"
              alt="Cureva"
              className="w-20 h-20 mx-auto rounded-2xl shadow-lg"
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Buat Akun</h1>
          <p className="text-slate-500 mt-2">
            Daftar untuk mulai booking fisioterapi
          </p>
        </div>

        {/* Register Form */}
        <Card className="backdrop-blur-sm bg-white/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              name="nama"
              placeholder="Masukkan nama lengkap"
              value={formData.nama}
              onChange={handleChange}
              error={errors.nama}
              leftIcon={User}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={Mail}
            />

            <Input
              label="Nomor Telepon"
              type="tel"
              name="telepon"
              placeholder="08xxxxxxxxxx"
              value={formData.telepon}
              onChange={handleChange}
              error={errors.telepon}
              leftIcon={Phone}
              helperText="Opsional"
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={Lock}
              />
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              )}
            </div>

            <Input
              label="Konfirmasi Password"
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={Lock}
            />

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                Saya setuju dengan{" "}
                <a href="#" className="text-sky-500 hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-sky-500 hover:underline">
                  Kebijakan Privasi
                </a>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-4"
            >
              Daftar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-sky-500 hover:text-sky-600 font-semibold"
              >
                Masuk
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8">
          © 2026 Cureva Fisio. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
