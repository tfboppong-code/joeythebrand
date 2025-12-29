"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { ADMIN_EMAIL } from "@/lib/admin";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email?.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-32 px-6">
      {/* PAGE CONTAINER */}
      <div className="max-w-3xl mx-auto">

        {/* TITLE */}
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide text-center">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Manage products and content for your brand.
        </p>

        {/* CARDS GRID */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* ADD PRODUCT CARD */}
          <div
            onClick={() => router.push("/admin/products/add")}
            className="p-10 bg-burgundy rounded-2xl shadow-xl cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-2">➕ Add Product</h2>
            <p className="text-gray-100">
              Upload new items to your catalog.
            </p>
          </div>

          {/* VIEW PRODUCTS CARD */}
          <div
            onClick={() => router.push("/admin/products")}
            className="p-10 bg-white text-gray-900 rounded-2xl shadow-xl cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-2">📦 View Products</h2>
            <p className="text-gray-700">
              Edit existing products, update prices, or remove items.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
