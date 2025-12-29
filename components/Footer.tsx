"use client";

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full py-12 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 text-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col items-start cursor-pointer hover:scale-105 transition-transform duration-300">
          <span className="text-2xl font-bold text-burgundy font-elegant mb-2">
            JOEY
          </span>
          <p className="text-gray-800">
            Premium fashion, exclusive collections.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2 text-black">Quick Links</h3>

          {/* Home → scroll to top */}
          <button
            onClick={scrollToTop}
            className="mb-1 text-left text-black hover:text-burgundy hover:scale-105 transition-all duration-300"
          >
            Home
          </button>

          {/* Shop */}
          <Link
            href="/shop"
            className="mb-1 text-black hover:text-burgundy hover:scale-105 transition-all duration-300"
          >
            Shop
          </Link>
        </div>

        {/* Socials */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2 text-black">Contact & Follow Us</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="https://www.instagram.com/joey_thebrand?igsh=MWh3ZDZ0MXQxY3l5ZA=="
              target="_blank"
              className="flex items-center gap-2 text-black hover:text-burgundy hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </Link>

            <Link
              href="https://wa.link/0f52fr"
              target="_blank"
              className="flex items-center gap-2 text-black hover:text-burgundy hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center text-gray-800 text-sm">
        &copy; {new Date().getFullYear()} JOEY. All rights reserved.
      </div>
    </footer>
  );
}
