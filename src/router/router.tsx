import LoginPage from "@/pages/loginPage";
import DashboardPage from "@/pages/dashboardPage";
import ProfilePage from "@/pages/profilePage";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Layout from "@/app/layout/_layout";
import { ROUTES } from "@/constants/appConstants";
import AddRoomPage from "@/pages/roomCreate";
import RoomsListPage from "@/pages/roomsList";
import RoomEditPage from "@/pages/roomEdit";
import RoomDetailsPage from "@/pages/roomDetails";
import RoomsMaintenancePage from "@/pages/roomsMaintenance";
import RoomsAvailablePage from "@/pages/roomsAvailable";

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
      {
        path: "rooms",
        element: <RoomsListPage />,
      },
      {
        path: "rooms/maintenance",
        element: <RoomsMaintenancePage />,
      },
      {
        path: "rooms/available",
        element: <RoomsAvailablePage />,
      },
      {
        path: ROUTES.ROOMSNEW,
        element: <AddRoomPage />
      },
      {
        path: "rooms/:id",
        element: <RoomDetailsPage />
      },
      {
        path: "rooms/:id/edit",
        element: <RoomEditPage />
      }
      // Add more protected routes here
    ],
  },
  // ],
  // },
]);

export default Router;