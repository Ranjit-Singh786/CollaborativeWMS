import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Explicit connect function
  const connectSocket = useCallback(() => {
    if (!socket) {
      const newSocket = io("https://collaborative-wms-bakend.vercel.app", {
        withCredentials: false,
      });
      setSocket(newSocket);
    }
  }, [socket]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
