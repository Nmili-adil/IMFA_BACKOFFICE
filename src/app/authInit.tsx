import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const AuthInit = () => {
  const fetchUserPermissions = useAuthStore(
    (state) => state.fetchUserPermissions
  );

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  return null;
};

export default AuthInit;
