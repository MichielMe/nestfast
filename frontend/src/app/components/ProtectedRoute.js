"use client";

import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedRoute;
