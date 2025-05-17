import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
}

const defaultContext: UIContextType = {
  sidebarExpanded: true,
  toggleSidebar: () => {},
  expandSidebar: () => {},
  collapseSidebar: () => {},
};

const UIContext = createContext<UIContextType>(defaultContext);

export const useUI = () => useContext(UIContext);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  const expandSidebar = () => {
    setSidebarExpanded(true);
  };

  const collapseSidebar = () => {
    setSidebarExpanded(false);
  };

  return (
    <UIContext.Provider
      value={{
        sidebarExpanded,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
