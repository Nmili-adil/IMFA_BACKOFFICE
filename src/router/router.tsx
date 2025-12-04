import { LOGIN_RROUTE } from "@/constants/routerConstants";
import LoginPage from "@/pages/loginPage";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
{
    path: LOGIN_RROUTE,
    element : <LoginPage />

}
])


export default Router