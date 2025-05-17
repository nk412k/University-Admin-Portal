import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthLayout: React.FC = () => {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();
  const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/auth/")) {
      localStorage.removeItem("isLoggedOut");
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (user && session && !isLoggedOut) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold">University Admin Portal</h1>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
