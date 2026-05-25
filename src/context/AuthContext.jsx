import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../services/socketService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = authService.getCurrentUser();
      const token = localStorage.getItem("accessToken");

      if (savedUser && token) {
        setUser(savedUser);
        setIsAuthenticated(true);
        connectSocket(token);

        // Verify token is still valid
        try {
          const response = await authService.getProfile();
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          // Token invalid, clear auth
          logout();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    setIsAuthenticated(true);

    const token = localStorage.getItem("accessToken");
    connectSocket(token);

    return response;
  };

  const googleLogin = async (idToken) => {
    const response = await authService.googleLogin(idToken);
    setUser(response.data.user);
    setIsAuthenticated(true);

    const token = localStorage.getItem("accessToken");
    connectSocket(token);

    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      disconnectSocket();
      // Cancel Google session jika ada
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleNewNotification = (notification) => {
      window.dispatchEvent(
        new CustomEvent("notification:new", { detail: notification }),
      );
      window.dispatchEvent(new Event("notificationUpdate"));
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [isAuthenticated]);

  const updateProfile = async (data) => {
    const response = await authService.updateProfile(data);
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    return response;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === "admin",
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
