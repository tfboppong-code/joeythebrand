// app/context/NavigationContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  previousPage: string | null;
  setPreviousPage: (page: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ previousPage, setPreviousPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};
