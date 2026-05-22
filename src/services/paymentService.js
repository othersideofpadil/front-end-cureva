import api from "./api";

const paymentService = {
  // Admin: Get all payments
  getAll: async () => {
    const response = await api.get("/payments");
    return response.data;
  },

  // Get payment by pemesanan ID
  getByPemesananId: async (pemesananId) => {
    const response = await api.get(`/payments/pemesanan/${pemesananId}`);
    return response.data;
  },

  // Update payment method (user)
  updateMethod: async (pemesananId, metode) => {
    const response = await api.put(
      `/payments/pemesanan/${pemesananId}/method`,
      { metode },
    );
    return response.data;
  },

  // Admin: Update payment status
  updateStatus: async (pemesananId, status, catatan = null) => {
    const response = await api.put(
      `/payments/pemesanan/${pemesananId}/status`,
      { status, catatan },
    );
    return response.data;
  },

  // Admin: Mark as paid
  markAsPaid: async (pemesananId) => {
    const response = await api.post(
      `/payments/pemesanan/${pemesananId}/mark-paid`,
    );
    return response.data;
  },

  // Admin: Confirm payment (wrapper for updateStatus with dibayar)
  confirm: async (pemesananId) => {
    const response = await api.put(
      `/payments/pemesanan/${pemesananId}/status`,
      { status: "dibayar" },
    );
    return response.data;
  },

  // Admin: Reject payment (wrapper for updateStatus with gagal)
  reject: async (pemesananId, alasan) => {
    const response = await api.put(
      `/payments/pemesanan/${pemesananId}/status`,
      { status: "gagal", catatan: alasan },
    );
    return response.data;
  },

  // Admin: Get statistics
  getStatistik: async () => {
    const response = await api.get("/payments/statistik");
    return response.data;
  },

  // Admin: Delete payment
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

export default paymentService;
