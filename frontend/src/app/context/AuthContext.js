"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// Create a safer localStorage wrapper to handle SSR and errors
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error("localStorage.getItem error:", error);
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("localStorage.setItem error:", error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("localStorage.removeItem error:", error);
    }
  },
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Safely initialize from localStorage on component mount
  useEffect(() => {
    // Make sure this only runs on the client
    if (typeof window === "undefined") return;

    try {
      const storedToken = safeStorage.getItem("token");
      if (storedToken) {
        setUser({ token: storedToken });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Use FormData for proper x-www-form-urlencoded submission
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post(
        "http://localhost:8000/auth/token",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = res.data.access_token;

      // Store token safely
      safeStorage.setItem("token", token);

      // Set user state
      setUser({ token });

      // Use router for navigation instead of direct DOM manipulation
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      return { error: error.message };
    }
  };

  const logout = () => {
    // Safely clear localStorage
    safeStorage.removeItem("token");

    // Reset user state
    setUser(null);

    // Use router for navigation
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
