import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Heart, Send } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../../services";
import { Button, Input, Card } from "../../components/common";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Instruksi reset password telah dikirim ke email Anda");
    } catch (error) {
      const message = error.response?.data?.message || "Gagal mengirim email";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
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
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </Link>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-sky-500 to-indigo-500 rounded-2xl shadow-lg shadow-sky-500/30 mb-4"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Lupa Password?</h1>
          <p className="text-slate-500 mt-2">
            {sent
              ? "Cek email Anda untuk instruksi reset password"
              : "Masukkan email untuk reset password"}
          </p>
        </div>

        {/* Form */}
        <Card className="backdrop-blur-sm bg-white/80">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Email Terkirim!
              </h3>
              <p className="text-slate-500 mb-6">
                Kami telah mengirim instruksi reset password ke{" "}
                <span className="font-medium text-slate-700">{email}</span>
              </p>
              <Button variant="secondary" onClick={() => setSent(false)}>
                Kirim Ulang
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                error={error}
                leftIcon={Mail}
              />

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Kirim Instruksi
                <Send className="w-5 h-5" />
              </Button>
            </form>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8">
          © 2026 Cureva Fisio. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
