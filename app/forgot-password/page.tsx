"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/firebase/config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent! Check your inbox, and if you don't see it, check your spam or junk folder."
      );
    } catch (err) {
      const firebaseError = err as FirebaseError;
      console.error("Password reset error:", firebaseError);
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-start">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-white text-sm mb-4 flex items-center gap-1 hover:underline"
        >
          ← Back
        </button>

        {/* Forgot Password Card */}
        <div className="w-full bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

          {error && (
            <p className="text-red-600 text-center font-semibold mb-4">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-center font-semibold mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-3 rounded-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
