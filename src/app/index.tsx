import Router from "@/router/router";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";


const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={Router} />
    </AuthProvider>
  );
};

export default App;