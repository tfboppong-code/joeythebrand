"use client";

import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <CartProvider key={user?.uid ?? "guest"}>
      {children}
    </CartProvider>
  );
}
