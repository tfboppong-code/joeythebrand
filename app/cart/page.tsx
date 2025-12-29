"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { cart, cartCount, totalAmount, removeFromCart, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 px-4">
      {/* Back button */}
      <div className="w-full max-w-4xl mb-6">
        <button
          onClick={() => router.back()}
          className="text-black text-sm flex items-center gap-1 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Cart container */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
                >
                  {item.image && (
                    <div className="w-20 h-20 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600">
                      GH₵{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart summary */}
            <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4 mt-4">
              <p className="text-gray-700 text-lg">
                Total Items: <strong>{cartCount}</strong>
              </p>
              <p className="text-gray-700 text-lg">
                Total Amount: <strong>GH₵{totalAmount.toFixed(2)}</strong>
              </p>

              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
