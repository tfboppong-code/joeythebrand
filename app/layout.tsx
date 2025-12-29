// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import GlobalLoader from "@/components/GlobalLoader";
import { AuthProvider } from "./context/AuthContext";
import { NavigationProvider } from "./context/NavigationContext";
import AppProviders from "./Providers";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative" suppressHydrationWarning>
        {/* Paystack script */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="afterInteractive"
        />

        <GlobalLoader />

        <NavigationProvider>
          <AuthProvider>
            <AppProviders>
              <Header />
              {children}
            </AppProviders>
          </AuthProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
