import { LOGIN_RROUTE, USERLIST_ROUTE } from "@/constants/routerConstants";
import LoginPage from "@/pages/loginPage";
import UserListPage from "@/pages/UserListPage";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: LOGIN_RROUTE,
    element: <LoginPage />,
  },
  {
    path: USERLIST_ROUTE,
    element: <UserListPage />,
  },
]);

export default Router;
