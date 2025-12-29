"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => PaystackHandler;
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart(); // per-user cart

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setError(null);
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: "pk_live_9fff02ef9606e6cc271b06faa8bd66cc319bbb05",
      email,
      amount: Math.round(totalAmount * 100),
      currency: "GHS",
      callback: () => {
        clearCart();
        router.push("/checkout/success");
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 px-4">
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={() => router.back()}
          className="text-black text-sm flex items-center gap-1 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Checkout card */}
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <p className="mb-2 text-gray-700">
          Total: <strong>GH₵{totalAmount.toFixed(2)}</strong>
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Paystack"}
        </button>

        {cart.length === 0 && (
          <p className="mt-4 text-center text-gray-500">
            Your cart is empty.
          </p>
        )}
      </div>
    </main>
  );
}
