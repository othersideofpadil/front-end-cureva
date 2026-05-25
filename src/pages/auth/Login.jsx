import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Heart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Card } from "../../components/common";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, googleLogin } = useAuth(); // ← tambah googleLogin
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // ─── Load Google Identity Services script ───────────────────────
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    // Cek apakah script sudah ada
    if (document.getElementById("gsi-script")) {
      initGSI();
      return;
    }

    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initGSI();
    document.head.appendChild(script);
  }, []);

  const initGSI = () => {
    if (!window.google?.accounts?.id) {
      setTimeout(initGSI, 200);
      return;
    }
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
  };

  // ─── Handler setelah user pilih akun Google ──────────────────────
  const handleGoogleCallback = async (response) => {
    if (!response.credential) {
      toast.error("Login Google gagal. Coba lagi.");
      return;
    }

    setGoogleLoading(true);
    try {
      const result = await googleLogin(response.credential);
      toast.success("Login dengan Google berhasil!");

      const user = result.data.user;
      const redirect = searchParams.get("redirect");
      navigate(redirect || (user.role === "admin" ? "/admin" : "/"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Google gagal");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Klik tombol Google ──────────────────────────────────────────
  const handleGoogleClick = () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error("Google login belum dikonfigurasi");
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        // Jika One Tap tidak muncul (misal popup blocker), tidak masalah
        if (notification.isNotDisplayed()) {
          toast.error("Popup Google diblokir browser. Coba izinkan popup.");
        }
      });
    }
  };

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

      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(redirect);
        return;
      }

      const user = response.data.user;
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      const message = error.response?.data?.message || "Login gagal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#003C82]/10 via-white to-[#7B68EE]/10 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:flex flex-col justify-center items-center text-center space-y-6 p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <img
                src="/images/logo.png"
                alt="Cureva"
                className="w-32 h-32 mx-auto rounded-3xl shadow-2xl"
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-slate-800">
                Selamat Datang
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Masuk ke akun Cureva Anda dan nikmati layanan fisioterapi
                profesional di rumah
              </p>
            </div>

            <div className="flex items-center gap-2 text-primary">
              <Heart className="w-6 h-6 fill-current" />
              <span className="text-lg font-medium">
                Kesehatan Anda, Prioritas Kami
              </span>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Mobile Logo & Title */}
            <div className="lg:hidden text-center mb-8">
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
              <h1 className="text-3xl font-bold text-slate-800">
                Selamat Datang
              </h1>
              <p className="text-slate-500 mt-2">Masuk ke akun Cureva Anda</p>
            </div>

            <Card className="backdrop-blur-sm bg-white/80">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Masuk</h2>
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
                    className="font-medium text-primary"
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">atau</span>
                </div>
              </div>

              {/* Google Login Button - sekarang sudah berfungsi */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-primary font-medium">
                  {googleLoading ? "Memproses..." : "Masuk dengan Google"}
                </span>
              </button>

              <div className="mt-6 text-center">
                <p className="text-slate-500">
                  Belum punya akun?{" "}
                  <Link to="/register" className="text-primary font-semibold">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </Card>

            <p className="text-center text-slate-400 text-sm mt-8">
              © 2026 Cureva Fisio. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
