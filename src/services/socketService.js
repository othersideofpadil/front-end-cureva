import { io } from "socket.io-client";

let socket = null;

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  return undefined;
};

export const connectSocket = (token) => {
  if (!token) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(getSocketUrl(), {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
};
