import api from "./api";

const bookingService = {
  // Create new booking
  create: async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  // Get my bookings
  getMyBookings: async (params = {}) => {
    const response = await api.get("/bookings/me", { params });
    return response.data;
  },

  // Get upcoming bookings
  getUpcoming: async () => {
    const response = await api.get("/bookings/upcoming");
    return response.data;
  },

  // Get booking by ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get booking by kode
  getByKode: async (kode) => {
    const response = await api.get(`/bookings/kode/${kode}`);
    return response.data;
  },

  // Cancel booking
  cancel: async (id, data = {}) => {
    const response = await api.post(`/bookings/${id}/cancel`, data);
    return response.data;
  },

  // Reschedule booking
  reschedule: async (id, data) => {
    const response = await api.post(`/bookings/${id}/reschedule`, data);
    return response.data;
  },

  // Add rating (used by BookingDetail)
  addRating: async (id, rating, review) => {
    const response = await api.post(`/bookings/${id}/rating`, {
      rating,
      review,
    });
    return response.data;
  },

  // Submit rating (used by Ratings page) - alias for addRating with different parameter format
  submitRating: async (id, data) => {
    const response = await api.post(`/bookings/${id}/rating`, {
      rating: data.rating,
      review: data.review,
    });
    return response.data;
  },

  // Get all ratings
  getAllRatings: async (params = {}) => {
    const response = await api.get("/bookings/ratings", { params });
    return response.data;
  },

  // Admin: Get all bookings
  getAll: async (params = {}) => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },

  // Admin: Update booking status
  updateStatus: async (id, status, alasan = "") => {
    const response = await api.put(`/bookings/${id}/status`, {
      status,
      alasan_penolakan: alasan,
    });
    return response.data;
  },

  // Admin: Get statistics
  getStatistik: async () => {
    const response = await api.get("/bookings/admin/statistik");
    return response.data;
  },

  // Admin: Delete booking
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default bookingService;
