"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/shop");
    } catch (err) {
      const authError = err as AuthError; // Properly typed Firebase auth error

      // Handle Firebase error codes
      switch (authError.code) {
        case "auth/email-already-in-use":
          setError("Email already exists. Try logging in.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError(authError.message);
          break;
      }
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

        {/* Signup card */}
        <div className="w-full bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

          {error && (
            <p className="text-red-600 text-center font-semibold mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border p-3 rounded-lg w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
