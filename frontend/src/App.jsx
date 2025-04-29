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

function App() {
    const router = createBrowserRouter([
        {
          element: <PrivateRoute />, 
          children: [
            {
              path: "/",
              element: <Layout />,
              children: [
                { index: true, element: <DashboardPage /> },
                { path: "users", element: <UserPage /> },
                {
                  path: "projects",
                  children: [
                    { index: true, element: <ProjectPage /> },
                    { path: "tasks", element: <TaskPage /> }, 
                  ],
                },
                { path: "tasks", element: <TaskPage /> }, 
              ],
            },
          ],
        },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignupPage /> },
      ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
