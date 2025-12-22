import { LOGIN_RROUTE } from "@/constants/routerConstants";
import LoginPage from "@/pages/loginPage";
import { Unauthorized } from "@/pages/Unauthorized";
import { createBrowserRouter } from "react-router-dom";
import { UNAUTHORIZED } from "@/constants/routerConstants";


const Router = createBrowserRouter([
{
    path: LOGIN_RROUTE,
    element : <LoginPage />

},
{
    path: UNAUTHORIZED,
    element : <Unauthorized/>

},
])


export default Router