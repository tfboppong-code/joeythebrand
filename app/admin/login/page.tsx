// ...existing code...
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user ?? auth.currentUser;

      if (user?.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        router.push("/admin/dashboard");
      } else {
        setError("Not an admin account");
        await signOut(auth);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        {error && <p className="text-red-600 text-center font-semibold mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy"
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 rounded-xl font-semibold transition-all ${
              loading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-black text-white hover:bg-burgundy"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}