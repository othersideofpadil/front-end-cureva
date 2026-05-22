import api from "./api";

const adminService = {
  // Get dashboard statistics
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default adminService;
