import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { notificationService } from "../../services";
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
} from "../../components/common";

const iconMap = {
  pemesanan: Calendar,
  pembayaran: CreditCard,
  jadwal: Clock,
  rating: CheckCircle,
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Bell,
};

const typeStyles = {
  pemesanan: "bg-indigo-100 text-indigo-600",
  pembayaran: "bg-sky-100 text-sky-600",
  jadwal: "bg-amber-100 text-amber-600",
  rating: "bg-emerald-100 text-emerald-600",
  success: "bg-emerald-100 text-emerald-600",
  error: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-600",
  info: "bg-slate-100 text-slate-600",
};

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleRealtimeNotification = (event) => {
      const incoming = event.detail;

      if (!incoming?.id) {
        return;
      }

      setNotifications((prev) => {
        if (prev.some((item) => item.id === incoming.id)) {
          return prev;
        }

        return [incoming, ...prev];
      });
    };

    window.addEventListener("notification:new", handleRealtimeNotification);

    return () => {
      window.removeEventListener(
        "notification:new",
        handleRealtimeNotification,
      );
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      // Trigger event to update navbar unread count
      window.dispatchEvent(new Event("notificationUpdate"));
    } catch (error) {
      toast.error("Gagal menandai notifikasi");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      // Trigger event to update navbar unread count
      window.dispatchEvent(new Event("notificationUpdate"));
      toast.success("Semua notifikasi telah dibaca");
    } catch (error) {
      toast.error("Gagal menandai semua notifikasi");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notifikasi dihapus");
    } catch (error) {
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.is_read,
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifikasi</h1>
          <p className="text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filter */}
      <Card padding="sm">
        <div className="flex gap-2">
          {[
            { value: "all", label: "Semua" },
            { value: "unread", label: "Belum Dibaca" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === option.value
                  ? "bg-sky-500 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const typeKey = (notification.type || "info").toLowerCase();
              const Icon = iconMap[typeKey] || Bell;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    padding="none"
                    className={`overflow-hidden ${
                      !notification.is_read ? "border-l-4 border-l-sky-500" : ""
                    }`}
                  >
                    <div className="p-4 flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          typeStyles[typeKey] || typeStyles.info
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className={`font-medium ${
                                !notification.is_read
                                  ? "text-slate-800"
                                  : "text-slate-600"
                              }`}
                            >
                              {notification.judul}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              {notification.pesan}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.created_at)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                                title="Tandai dibaca"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Bell}
            title="Tidak ada notifikasi"
            description={
              filter === "unread"
                ? "Semua notifikasi sudah dibaca"
                : "Anda belum memiliki notifikasi"
            }
            action={filter === "unread" ? () => setFilter("all") : undefined}
            actionLabel="Lihat Semua"
          />
        </Card>
      )}
    </div>
  );
};

export default Notifications;
