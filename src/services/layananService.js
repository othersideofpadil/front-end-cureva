import api from "./api";

const layananService = {
  // Get all services
  getAll: async () => {
    const response = await api.get("/layanan");
    return response.data;
  },

  // Get service by ID
  getById: async (id) => {
    const response = await api.get(`/layanan/${id}`);
    return response.data;
  },

  // Admin: Create service
  create: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post("/layanan", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  // Admin: Update service
  update: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/layanan/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  // Admin: Delete service
  delete: async (id) => {
    const response = await api.delete(`/layanan/${id}`);
    return response.data;
  },
};

export default layananService;
