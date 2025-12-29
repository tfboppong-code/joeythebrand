"use client";

import { Menu, ShoppingBag, User, X, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const manItems = [
    "Shorts",
    "Kaftans",
    "Shirts",
    "Trousers",
    "T-shirts",
    "Lounge wear",
    "Jackets",
    "Suits",
  ];

  const womanItems = [
    "Blazers",
    "Suits",
    "Trousers",
    "Shirts",
    "T-shirts",
    "Skirts",
    "Dresses",
    "Bustiers",
    "Kaftans",
    "Shorts",
  ];

  const submenuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl border-b border-white/10
        ${scrolled ? "bg-white/40 shadow-lg" : "bg-white/20 shadow-none"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 relative">
        {/* Left side: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black focus:outline-none focus:ring-2 focus:ring-burgundy rounded-full p-1 hover:ring-2 hover:ring-burgundy transition-all"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/">
            <span className="text-2xl md:text-3xl font-bold tracking-wide text-burgundy font-elegant">
              JOEY
            </span>
          </Link>
        </div>

        {/* Right side: Cart + Login/Logout */}
        <div className="flex items-center gap-6 text-black">
          {/* Only show cart for logged-in users */}
          {user && (
            <Link href="/cart" className="relative group">
              <ShoppingBag className="w-6 h-6 text-black group-hover:text-burgundy transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-burgundy text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={logout}
              className="group flex items-center gap-1 hover:text-burgundy transition-colors font-semibold"
            >
              <LogOut className="w-6 h-6" /> Logout
            </button>
          ) : (
            <Link href="/login" className="group">
              <User className="w-6 h-6 text-black group-hover:text-burgundy transition-colors" />
            </Link>
          )}
        </div>

        {/* Menu - Desktop + Mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col py-4 border-t border-white/20 z-50"
            >
              <div className="flex gap-16 text-black font-semibold relative ml-6">
                {/* Man */}
                <div
                  onMouseEnter={() => setActiveSubmenu("man")}
                  onMouseLeave={() => setActiveSubmenu(null)}
                  className="relative flex flex-col gap-2 cursor-pointer"
                >
                  <span className="text-lg">Man</span>
                  <AnimatePresence>
                    {activeSubmenu === "man" && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={submenuVariants}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-full ml-2 bg-white/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-col gap-2 border border-white/20"
                      >
                        {manItems.map((item) => (
                          <Link
                            key={item}
                            href={`/man/${item.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-burgundy flex items-center gap-1"
                          >
                            {item} <ChevronRight className="w-4 h-4" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Woman */}
                <div
                  onMouseEnter={() => setActiveSubmenu("woman")}
                  onMouseLeave={() => setActiveSubmenu(null)}
                  className="relative flex flex-col gap-2 cursor-pointer"
                >
                  <span className="text-lg">Woman</span>
                  <AnimatePresence>
                    {activeSubmenu === "woman" && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={submenuVariants}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-full ml-2 bg-white/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-col gap-2 border border-white/20"
                      >
                        {womanItems.map((item) => (
                          <Link
                            key={item}
                            href={`/woman/${item.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-burgundy flex items-center gap-1"
                          >
                            {item} <ChevronRight className="w-4 h-4" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
