"use client";

import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for the next paint to hide the loader smoothly
    const raf = requestAnimationFrame(() => {
      setLoading(false);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="animate-pulse text-logo tracking-widest font-elegant text-burgundy">
        J O E Y
      </div>
    </div>
  );
}
