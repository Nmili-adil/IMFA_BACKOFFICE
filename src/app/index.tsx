import Router from "@/router/router";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  );
};

export default App;