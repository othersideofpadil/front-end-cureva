import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services";

const MainLayout = ({ children, showSidebar = true }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const getIsLargeScreen = () =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  const [collapsed, setCollapsed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(getIsLargeScreen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(getIsLargeScreen);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      setMobileMenuOpen(large);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const handleNotificationUpdate = () => {
      if (isAuthenticated && isAdmin) {
        fetchUnreadCount();
        if (previewOpen) fetchPreviewItems();
      }
    };
    const handleRealtimeNotification = () => {
      if (isAuthenticated && isAdmin) {
        fetchUnreadCount();
        if (previewOpen) fetchPreviewItems();
      }
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    window.addEventListener("notification:new", handleRealtimeNotification);
    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate,
      );
      window.removeEventListener(
        "notification:new",
        handleRealtimeNotification,
      );
    };
  }, [isAuthenticated, isAdmin]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchPreviewItems = async () => {
    setPreviewLoading(true);
    try {
      const response = await notificationService.getMyNotifications({
        limit: 5,
        offset: 0,
      });
      setPreviewItems(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setPreviewItems([]);
    } finally {
      setPreviewLoading(false);
    }
  };

  const togglePreview = () => {
    setPreviewOpen((prev) => {
      const next = !prev;
      if (next) fetchPreviewItems();
      return next;
    });
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

  return (
    <div className="min-h-screen bg-slate-50">
      {showSidebar && isAdmin ? (
        <>
          {/* Mobile Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            isLargeScreen={isLargeScreen}
          />

          <motion.main
            initial={false}
            animate={{
              marginLeft: isLargeScreen ? (collapsed ? 80 : 256) : 0,
            }}
            className="min-h-screen transition-all duration-300"
          >
            {/* ── Unified Admin Topbar ── */}
            <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100">
              <div className="flex items-center justify-between h-14 px-4 md:px-6">
                {/* Left: hamburger (mobile/tablet only) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors -ml-1"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                {/* Spacer — pushes bell to the right on desktop (no hamburger) */}
                <div className="hidden lg:block" />

                {/* Right: bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {previewOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setPreviewOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-2xl shadow-lg z-20 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                Notifikasi
                              </p>
                              <p className="text-xs text-slate-400">
                                {unreadCount > 0
                                  ? `${unreadCount} belum dibaca`
                                  : "Semua sudah dibaca"}
                              </p>
                            </div>
                            <Link
                              to="/notifications"
                              onClick={() => setPreviewOpen(false)}
                              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                            >
                              Lihat semua
                            </Link>
                          </div>

                          <div className="max-h-80 overflow-y-auto">
                            {previewLoading ? (
                              <div className="px-4 py-6 text-center text-xs text-slate-400">
                                Memuat notifikasi...
                              </div>
                            ) : previewItems.length === 0 ? (
                              <div className="px-4 py-6 text-center text-xs text-slate-400">
                                Belum ada notifikasi
                              </div>
                            ) : (
                              previewItems.map((item) => (
                                <Link
                                  key={item.id}
                                  to={item.link || "/notifications"}
                                  onClick={() => setPreviewOpen(false)}
                                  className={`block px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                                    item.is_read ? "" : "bg-sky-50/40"
                                  }`}
                                >
                                  <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                    {item.judul}
                                  </p>
                                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                    {item.pesan}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-2">
                                    {formatTime(item.created_at)}
                                  </p>
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 lg:p-6">{children}</div>
          </motion.main>
        </>
      ) : (
        <>
          <Navbar />
          <main className="pt-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default MainLayout;
