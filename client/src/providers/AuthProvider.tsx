import { useState, useEffect, type ReactNode } from "react";
import { authApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types";
import { AxiosError } from "axios";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await authApi.getMe();
          setUser(response.data.user);
          setToken(storedToken);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Invalid email or password";
        throw new Error(message, { cause: error });
      }
      throw new Error("An unexpected error occurred. Please try again.", {
        cause: error,
      });
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await authApi.register(email, password);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Failed to create account";
        throw new Error(message, { cause: error });
      }
      throw new Error("An unexpected error occurred. Please try again.", {
        cause: error,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
