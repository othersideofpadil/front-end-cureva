import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Card } from "../../components/common";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      toast.success(response.message || "Login berhasil!");

      // Redirect based on role
      const user = response.data.user;
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login gagal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
        className="w-full max-w-md relative z-10"
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
          <h1 className="text-3xl font-bold text-slate-800">Selamat Datang</h1>
          <p className="text-slate-500 mt-2">Masuk ke akun Cureva Anda</p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/80">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              label="Password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={Lock}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-slate-600">Ingat saya</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sky-500 hover:text-sky-600 font-medium"
              >
                Lupa password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              Masuk
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-sky-500 hover:text-sky-600 font-semibold"
              >
                Daftar sekarang
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

export default Login;
