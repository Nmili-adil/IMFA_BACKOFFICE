import Router from "@/router/router";
import { RouterProvider } from "react-router-dom";
import AuthInit from "./authInit";

const App = () =>{
return (
    <>
       <AuthInit/>
        <RouterProvider router={Router} />
    </>


)
}
export default App;
