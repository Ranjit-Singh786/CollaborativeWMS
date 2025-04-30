import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import UserPage from "@/routes/users/page";
import ProjectPage from "@/routes/projects/page";
import TaskPage from "@/routes/tasks/page";
import LoginPage from "@/routes/login/page";
import SignupPage from "@/routes/signup/page";
import PrivateRoute from "@/components/PrivateRoute";
import { io } from "socket.io-client";
import { useState,useEffect } from "react";

function App() {
 
  const [socket, setSocket] = useState(null);
  let socketInit;
  function getSocket(){
    if (!socketInit || !localStorage.getItem("socketId")) {
      socketInit = io("http://localhost:5000");
      socketInit.on("connect", () => {
        console.log("Socket connected",socketInit?.id);
        setSocket(socketInit);
        localStorage.setItem("socketId", socketInit?.id);
        socketInit.emit("register_user", JSON.parse(localStorage.getItem("user"))?.id);
      });
      console.log("Socket initialized");
    }
    return socketInit;
  };

  useEffect(() => {
    getSocket();
  }, []);
   
  
    const router = createBrowserRouter([
        {
          element: <PrivateRoute />, 
          children: [
            {
              path: "/",
              element: <Layout socket={socket}/>,
              children: [
                { index: true, element: <DashboardPage /> },
                { path: "users", element: <UserPage /> },
                {
                  path: "projects",
                  children: [
                    { index: true, element: <ProjectPage /> },
                    { path: "tasks", element: <TaskPage socket={socket}/> }, 
                  ],
                },
                { path: "tasks", element: <TaskPage /> }, 
              ],
            },
          ],
        },
        { path: "/login", element: <LoginPage socket={socket}/> },
        { path: "/signup", element: <SignupPage /> },
      ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
