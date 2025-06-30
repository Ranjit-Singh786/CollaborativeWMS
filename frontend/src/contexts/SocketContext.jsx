import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInit = io("https://collaborative-wms-bakend.vercel.app/");
    socketInit.on("connect", () => {
      console.log("Socket connected", socketInit.id);
      setSocket(socketInit);
      localStorage.setItem("socketId", socketInit.id);
      socketInit.emit("register_user", JSON.parse(localStorage.getItem("user"))?.id);
    });

    return () => {
      socketInit.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);