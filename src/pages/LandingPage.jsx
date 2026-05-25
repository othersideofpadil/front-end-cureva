import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Navbar from "../components/layout/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State Management
  const [layanan, setLayanan] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
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
          (!booking.rating || booking.rating === null),
      );
      setCompletedBookings(completed);
    } catch (error) {
      console.error("Failed to fetch completed bookings:", error);
    }
  };

  // Event Handlers
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

  const activeLayanan = layanan.filter((item) => item.is_active);

  const averageRating = ratings.length
    ? ratings.reduce((sum, item) => sum + (item.rating || 0), 0) /
      ratings.length
    : 4.9;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - menggunakan komponen reusable */}
      <Navbar isLandingPage={true} unreadCountProp={unreadCount} />

      {/* Sections */}
      <HeroSection isAuthenticated={isAuthenticated} rating={averageRating} />
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
      <FooterSection layanan={activeLayanan} />
    </div>
  );
};

export default LandingPage;
