import LoginPage from "@/pages/loginPage";
import DashboardPage from "@/pages/dashboardPage";
import ProfilePage from "@/pages/profilePage";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Layout from "@/app/layout/_layout";

const Router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // element: <ProtectedRoute />,
    // children: [
    //   {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      // Add more protected routes here
    ],
  },
  // ],
  // },
]);

export default Router;