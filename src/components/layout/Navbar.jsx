import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Home,
  Calendar,
  FileText,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services";

const Navbar = ({ isLandingPage = false, unreadCountProp = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(unreadCountProp || 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLandingPage) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, isLandingPage]);

  useEffect(() => {
    if (unreadCountProp !== null) {
      setUnreadCount(unreadCountProp);
    }
  }, [unreadCountProp]);

  // Listen for notification updates from other components
  useEffect(() => {
    const handleNotificationUpdate = () => {
      if (isAuthenticated) {
        fetchUnreadCount();
      }
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate,
      );
    };
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Bedakan navigasi untuk admin dan user
  const navLinks = isAdmin
    ? [
        { path: "/admin", label: "Dashboard", icon: Home },
        { path: "/admin/bookings", label: "Kelola Booking", icon: Calendar },
        { path: "/admin/layanan", label: "Kelola Layanan", icon: FileText },
        { path: "/admin/jadwal", label: "Kelola Jadwal", icon: Clock },
      ]
    : [
        { path: "/bookings", label: "Booking Saya", icon: Calendar },
        { path: "/layanan", label: "Layanan", icon: FileText },
        { path: "/jadwal", label: "Jadwal", icon: Clock },
        { path: "/ratings", label: "Ulasan", icon: Star },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : isLandingPage
            ? "bg-white/95 backdrop-blur-lg border-b border-slate-100"
            : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Cureva"
              className="w-10 h-10 rounded-xl"
            />
            <span
              className={`text-xl font-bold ${
                isLandingPage
                  ? "bg-linear-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent"
                  : "text-slate-800"
              }`}
            >
              Cureva
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isLandingPage ? (
              <>
                <a
                  href="#fisioterapis"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Fisioterapis
                </a>
                <a
                  href="#services"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Layanan
                </a>
                <a
                  href="#reviews"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Ulasan
                </a>
              </>
            ) : (
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 ${
                      isLandingPage
                        ? "px-3 py-2 rounded-xl"
                        : "p-1.5 pr-3 rounded-full"
                    } bg-slate-50 hover:bg-slate-100 transition-colors`}
                  >
                    <div
                      className={`w-8 h-8 ${
                        isLandingPage
                          ? "bg-linear-to-br from-sky-400 to-indigo-500"
                          : "bg-linear-to-br from-sky-400 to-indigo-400"
                      } rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {user?.nama?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span
                      className={`hidden sm:block font-medium truncate ${
                        isLandingPage
                          ? "text-slate-700 max-w-30"
                          : "text-sm text-slate-700 max-w-25"
                      }`}
                    >
                      {user?.nama || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 ${
                        isLandingPage ? "text-slate-500" : "text-slate-400"
                      } transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 py-2 z-20 ${
                            isLandingPage ? "shadow-xl" : "shadow-lg"
                          }`}
                        >
                          <div className="px-4 py-3 border-b border-slate-100">
                            <p className="font-semibold text-slate-800 truncate">
                              {user?.nama}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {user?.email}
                            </p>
                          </div>

                          {/* Menu Items - berbeda untuk admin dan user */}
                          <div className={isLandingPage ? "py-2" : "py-1"}>
                            {isAdmin ? (
                              <>
                                <Link
                                  to="/admin"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Home className="w-4 h-4" />
                                  Dashboard
                                </Link>
                                <Link
                                  to="/admin/bookings"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Calendar className="w-4 h-4" />
                                  Kelola Booking
                                </Link>
                                <Link
                                  to="/admin/layanan"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  Kelola Layanan
                                </Link>
                                <Link
                                  to="/admin/jadwal"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Clock className="w-4 h-4" />
                                  Kelola Jadwal
                                </Link>
                                <Link
                                  to="/profile"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <User className="w-4 h-4" />
                                  Profil Saya
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  to="/bookings"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Calendar className="w-4 h-4" />
                                  Booking Saya
                                </Link>
                                <Link
                                  to="/layanan"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  Layanan
                                </Link>
                                <Link
                                  to="/jadwal"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Clock className="w-4 h-4" />
                                  Jadwal
                                </Link>
                                <Link
                                  to="/ratings"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Star className="w-4 h-4" />
                                  Ulasan
                                </Link>
                                <Link
                                  to="/notifications"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4" />
                                    Notifikasi
                                  </div>
                                  {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                      {unreadCount}
                                    </span>
                                  )}
                                </Link>
                                <Link
                                  to="/profile"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <User className="w-4 h-4" />
                                  Profil Saya
                                </Link>
                              </>
                            )}
                          </div>

                          <div
                            className={`${isLandingPage ? "border-t border-slate-100 pt-2" : ""}`}
                          >
                            {!isLandingPage && (
                              <hr className="my-2 border-slate-100" />
                            )}
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Keluar</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`${
                    isLandingPage ? "hidden sm:block px-5 py-2" : "px-4 py-2"
                  } text-slate-600 hover:text-slate-800 font-medium transition-colors`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className={`${
                    isLandingPage
                      ? "px-5 py-2 bg-linear-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg hover:shadow-sky-500/25"
                      : "px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg"
                  } text-white font-medium transition-all`}
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-1">
              {isLandingPage ? (
                <>
                  <a
                    href="#fisioterapis"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Fisioterapis & Jadwal
                  </a>
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Layanan
                  </a>
                  <a
                    href="#reviews"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Ulasan
                  </a>
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      Masuk
                    </Link>
                  )}
                </>
              ) : (
                navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
