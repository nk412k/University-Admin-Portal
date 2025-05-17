import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AIAssistant from "@/components/AIAssistant";

const MainLayout: React.FC = () => {
  const { isLoading, user, session } = useAuth();
  const { sidebarExpanded } = useUI();
  const location = useLocation();
  const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if ((!user || !session) && !isLoading && !isLoggedOut) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  if (isLoggedOut) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (user && session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main
            className={cn(
              "flex-1 p-6 md:p-8 transition-all duration-300 ease-in-out",
              sidebarExpanded ?? "md:ml-16"
            )}
          >
            <Outlet />
          </main>
        </div>

        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  );
};

export default MainLayout;
