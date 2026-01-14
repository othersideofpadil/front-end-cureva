import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Calendar,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  Clock,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  layananService,
  notificationService,
  bookingService,
} from "../services";
import { toast } from "react-hot-toast";
import {
  HeroSection,
  FisioterapisSection,
  ServicesSection,
  ReviewsSection,
  CTASection,
  FooterSection,
} from "../components/sections";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef(null);

  // State Management
  const [layanan, setLayanan] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Effects
  useEffect(() => {
    fetchLayanan();
    fetchRatings();
    if (isAuthenticated) {
      fetchUnreadCount();
      fetchCompletedBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Data Fetching Functions
  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch (error) {
      console.error("Failed to fetch layanan:", error);
    } finally {
      setLoadingLayanan(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await bookingService.getAllRatings();
      setRatings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    } finally {
      setLoadingRatings(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data?.count || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchCompletedBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      const completed = response.data.filter(
        (booking) =>
          booking.status === "selesai" &&
          (!booking.rating || booking.rating === null)
      );
      setCompletedBookings(completed);
    } catch (error) {
      console.error("Failed to fetch completed bookings:", error);
    }
  };

  // Event Handlers
  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (!selectedBooking) {
      toast.error("Pilih booking yang ingin direview");
      return;
    }

    if (userRating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Tulis review Anda");
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.submitRating(selectedBooking, {
        rating: userRating,
        review: reviewText.trim(),
      });

      toast.success("Review berhasil dikirim!");

      // Reset form
      setSelectedBooking("");
      setUserRating(0);
      setReviewText("");

      // Refresh data
      fetchRatings();
      fetchCompletedBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const profileMenuItems = [
    { label: "Booking Saya", icon: Calendar, path: "/bookings" },
    { label: "Layanan", icon: FileText, path: "/layanan" },
    { label: "Jadwal", icon: Clock, path: "/jadwal" },
    {
      label: "Notifikasi",
      icon: Bell,
      path: "/notifications",
      badge: unreadCount,
    },
    { label: "Profil Saya", icon: User, path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Cureva"
                className="w-10 h-10 rounded-xl"
              />
              <span className="text-xl font-bold bg-linear-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                Cureva
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#fisioterapis"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Fisioterapis
              </a>
              <a
                href="#services"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Layanan
              </a>
              <a
                href="#reviews"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Ulasan
              </a>
            </div>

            {/* Right side - Auth */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.nama?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-slate-700 font-medium max-w-30 truncate">
                      {user?.nama || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="font-semibold text-slate-800 truncate">
                            {user?.nama}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-2">
                          {profileMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge > 0 && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}

                          {user?.role === "admin" && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:block px-5 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-linear-to-r from-sky-500 to-indigo-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                  >
                    Daftar
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-slate-100 py-4"
              >
                <div className="flex flex-col gap-2">
                  <a
                    href="#fisioterapis"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Fisioterapis & Jadwal
                  </a>
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Layanan
                  </a>
                  <a
                    href="#reviews"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Ulasan
                  </a>
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      Masuk
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection isAuthenticated={isAuthenticated} />
      <FisioterapisSection />
      <ServicesSection
        layanan={layanan}
        loading={loadingLayanan}
        isAuthenticated={isAuthenticated}
        formatPrice={formatPrice}
      />
      <ReviewsSection
        ratings={ratings}
        loadingRatings={loadingRatings}
        isAuthenticated={isAuthenticated}
        completedBookings={completedBookings}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        userRating={userRating}
        setUserRating={setUserRating}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        submitting={submitting}
        handleSubmitReview={handleSubmitReview}
      />
      <CTASection isAuthenticated={isAuthenticated} />
      <FooterSection layanan={layanan} />
    </div>
  );
};

export default LandingPage;
