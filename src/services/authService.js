import api from "./api";

const authService = {
  // Register new user
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;
