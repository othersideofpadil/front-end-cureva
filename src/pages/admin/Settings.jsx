import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Bell,
  Shield,
  Palette,
} from "lucide-react";
import { Card, Button, LoadingSpinner } from "../../components/common";
import toast from "react-hot-toast";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General
    appName: "Cureva Fisioterapi",
    tagline: "Layanan Fisioterapi Home Visit Profesional",
    email: "info@cureva.id",
    phone: "0812-3456-7890",
    address: "Jl. Kesehatan No. 123, Jakarta",

    // Operating Hours
    operatingDays: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"],
    startTime: "08:00",
    endTime: "17:00",
    slotDuration: 60,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    reminderHours: 24,

    // Payment
    bankName: "Bank Central Asia",
    bankAccount: "1234567890",
    accountHolder: "CV Cureva Sehat",
    paymentDeadline: 24,
  });

  const tabs = [
    { id: "general", label: "Umum", icon: Building },
    { id: "schedule", label: "Jadwal", icon: Clock },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "payment", label: "Pembayaran", icon: Shield },
  ];

  const daysOfWeek = [
    { id: "senin", label: "Senin" },
    { id: "selasa", label: "Selasa" },
    { id: "rabu", label: "Rabu" },
    { id: "kamis", label: "Kamis" },
    { id: "jumat", label: "Jumat" },
    { id: "sabtu", label: "Sabtu" },
    { id: "minggu", label: "Minggu" },
  ];

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (dayId) => {
    setSettings((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(dayId)
        ? prev.operatingDays.filter((d) => d !== dayId)
        : [...prev.operatingDays, dayId],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
          <p className="text-slate-500">Konfigurasi aplikasi dan preferensi</p>
        </div>
        <Button onClick={handleSave} loading={loading} leftIcon={Save}>
          Simpan Perubahan
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "general" && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-sky-500" />
                  Informasi Umum
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nama Aplikasi
                    </label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => handleChange("appName", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" /> Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" /> Telepon
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" /> Alamat
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "schedule" && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-500" />
                  Pengaturan Jadwal
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Hari Operasional
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => toggleDay(day.id)}
                          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            settings.operatingDays.includes(day.id)
                              ? "bg-sky-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Jam Mulai
                      </label>
                      <input
                        type="time"
                        value={settings.startTime}
                        onChange={(e) =>
                          handleChange("startTime", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Jam Selesai
                      </label>
                      <input
                        type="time"
                        value={settings.endTime}
                        onChange={(e) =>
                          handleChange("endTime", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Durasi Slot (menit)
                      </label>
                      <select
                        value={settings.slotDuration}
                        onChange={(e) =>
                          handleChange("slotDuration", parseInt(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value={30}>30 menit</option>
                        <option value={45}>45 menit</option>
                        <option value={60}>60 menit</option>
                        <option value={90}>90 menit</option>
                        <option value={120}>120 menit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-sky-500" />
                  Pengaturan Notifikasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-700">
                        Notifikasi Email
                      </p>
                      <p className="text-sm text-slate-500">
                        Kirim notifikasi via email
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "emailNotifications",
                          !settings.emailNotifications
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.emailNotifications
                          ? "bg-sky-500"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.emailNotifications ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-700">
                        Notifikasi SMS
                      </p>
                      <p className="text-sm text-slate-500">
                        Kirim notifikasi via SMS
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "smsNotifications",
                          !settings.smsNotifications
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.smsNotifications
                          ? "bg-sky-500"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.smsNotifications ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Pengingat (jam sebelum jadwal)
                    </label>
                    <select
                      value={settings.reminderHours}
                      onChange={(e) =>
                        handleChange("reminderHours", parseInt(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={1}>1 jam</option>
                      <option value={2}>2 jam</option>
                      <option value={6}>6 jam</option>
                      <option value={12}>12 jam</option>
                      <option value={24}>24 jam</option>
                      <option value={48}>48 jam</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "payment" && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-500" />
                  Pengaturan Pembayaran
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nomor Rekening
                      </label>
                      <input
                        type="text"
                        value={settings.bankAccount}
                        onChange={(e) =>
                          handleChange("bankAccount", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Pemilik Rekening
                      </label>
                      <input
                        type="text"
                        value={settings.accountHolder}
                        onChange={(e) =>
                          handleChange("accountHolder", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Batas Waktu Pembayaran
                    </label>
                    <select
                      value={settings.paymentDeadline}
                      onChange={(e) =>
                        handleChange(
                          "paymentDeadline",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={1}>1 jam</option>
                      <option value={2}>2 jam</option>
                      <option value={6}>6 jam</option>
                      <option value={12}>12 jam</option>
                      <option value={24}>24 jam</option>
                      <option value={48}>48 jam</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
