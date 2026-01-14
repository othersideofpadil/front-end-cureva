import api from "./api";

const notificationService = {
  // Get my notifications
  getMyNotifications: async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.post("/notifications/mark-all-read");
    return response.data;
  },

  // Delete notification
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
