import { createBrowserRouter } from "react-router-dom";
import {  UNAUTHORIZED, ROLES_PERMISSIONS,ROLES_MANAGE_PERMISSIONS,CREATE_ROLE, DELETE_ROLE } from "@/constants/routerConstants";

// import LoginPage from "@/pages/loginPage";
import { Unauthorized } from "@/pages/unauthorized";
import { RoleListPage } from "@/pages/admin/roles/roleListPage";
import ManagePermissionsPage from "@/pages/admin/roles/managePermissionsPage";
import CreateRole from "@/pages/admin/roles/createRole";
import DeleteRole from "@/pages/admin/roles/DeleteRole";

const Router = createBrowserRouter([
//   {
//     path: LOGIN_RROUTE,
//     element: <LoginPage />,
//   },
  {
    path: UNAUTHORIZED,
    element: <Unauthorized />,
  },
  {
    path: ROLES_PERMISSIONS,
    element: <RoleListPage/>,
  },
 {
    path: ROLES_PERMISSIONS,
    element: <RoleListPage/>,
  },
  {
    path: ROLES_MANAGE_PERMISSIONS, 
    element: <ManagePermissionsPage/>,
  },
   {
    path: CREATE_ROLE, 
    element: <CreateRole/>,
  },
  {
    path: DELETE_ROLE, 
    element: <DeleteRole/>,
  },
]);

export default Router;
