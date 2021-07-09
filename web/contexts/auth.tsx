// contexts/auth.js

import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Router, { useRouter } from "next/router";
import Loading from "../components/Loading";

//api here is an axios instance which has the baseURL set according to the env.
import api from "../services/api";

const AuthContext = createContext({
  isAuthenticated: null,
  isLoading: null,
  user: null,
  login: null,
  logout: null,
  loadUserFromCookies: async () => null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadUserFromCookies() {
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        const { data: user } = await api.get("users/me");
        if (user) setUser(user);
      } catch ({ response }) {
        console.error(response);
        Cookies.remove("token", null);
        router.push("/login");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUserFromCookies();
  }, []);

  const login = async (email, password) => {
    const { data: token } = await api.post("auth/login", { email, password });
    if (token) {
      Cookies.set("token", token, { expires: 60 });
      api.defaults.headers.Authorization = `Bearer ${token.token}`;
      const { data: user } = await api.get("users/me");
      setUser(user);
    }
  };

  const logout = (email, password) => {
    Cookies.remove("token");
    setUser(null);
    delete api.defaults.headers.Authorization;
    window.location.pathname = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        isLoading: loading,
        logout,
        loadUserFromCookies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  } else if (
    !isAuthenticated &&
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/auth/google/callback"
  ) {
    useRouter().push("/login");
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return children;
};
