"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useCart } from "@/app/context/CartContext";

type Gender = "men" | "women";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  gender: Gender;
  category: string;
  description?: string;
}

interface FirestoreProduct {
  name?: string;
  price?: number;
  images?: string[];
  image?: string;
  img?: string;
  gender?: string;
  category?: string;
  description?: string;
}

const tabs: Record<Gender, string[]> = {
  men: ["Shorts", "Kaftans", "Shirts", "Trousers", "T-shirts", "Lounge wear", "Jackets", "Suits"],
  women: ["Blazers", "Suits", "Trousers", "Shirts", "T-shirts", "Skirts", "Dresses", "Bustiers", "Kaftans", "Shorts"],
};

function normalize(v?: string) {
  return (v ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export default function ShopPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeGender, setActiveGender] = useState<Gender>(() => {
    if (typeof window === "undefined") return "men";
    return (localStorage.getItem("shop_gender") as Gender) ?? "men";
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window === "undefined") return tabs["men"][0];
    const savedGender = (localStorage.getItem("shop_gender") as Gender) ?? "men";
    return localStorage.getItem("shop_category") ?? tabs[savedGender][0];
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("shop_gender", activeGender);
    localStorage.setItem("shop_category", activeCategory);
  }, [activeGender, activeCategory]);

  useEffect(() => {
    const db = getFirestore();
    const col = collection(db, "products");

    const unsub = onSnapshot(
      col,
      (snap) => {
        const data: Product[] = snap.docs.map((d) => {
          const raw = d.data() as FirestoreProduct;
          return {
            id: d.id,
            name: raw.name ?? "",
            price: raw.price ?? 0,
            images: raw.images ?? [raw.image ?? raw.img ?? ""],
            gender: raw.gender === "women" ? "women" : "men",
            category: raw.category ?? "",
            description: raw.description ?? "No description available.",
          };
        });
        setProducts(data);
        setLoading(false);
      },
      () => {
        setProducts([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = products.filter(
    (p) => p.gender === activeGender && normalize(p.category) === normalize(activeCategory)
  );

  const totalSlots = 6;
  const display = [...filtered, ...Array(Math.max(0, totalSlots - filtered.length)).fill(null)];

  const handleAdd = (p: Product) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
    });
    setToast("Added to cart");
  };

  const changeCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  const goBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={goBack}
          className="mb-6 text-sm font-medium underline hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>

        {/* GENDER BUTTONS */}
        <section className="mb-6 flex gap-4">
          {(["men", "women"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setActiveGender(g)}
              className="px-5 py-2 rounded-full font-medium text-black border border-gray-300 hover:bg-gray-100 transition-all"
            >
              {g[0].toUpperCase() + g.slice(1)}
            </button>
          ))}
        </section>

        {/* CATEGORY BUTTONS */}
        <section className="mb-6 flex flex-wrap gap-3">
          {tabs[activeGender].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => changeCategory(cat)}
              className="px-4 py-1 rounded-full text-black border border-gray-300 hover:bg-gray-100 transition-all text-sm"
            >
              {cat}
            </button>
          ))}
        </section>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: totalSlots }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse h-72" />
              ))
            : display.map((p, idx) =>
                p ? (
                  <article
                    key={p.id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col transition-transform transform hover:scale-105 duration-200"
                  >
                    <div className="h-56 w-full mb-4 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={800}
                          height={600}
                          className="h-full object-cover w-full"
                          unoptimized
                        />
                      ) : (
                        <div className="text-gray-400 italic">No image</div>
                      )}
                    </div>

                    <h2 className="font-elegant font-semibold text-xl text-gray-900 mb-2 tracking-wide">{p.name}</h2>
                    <p className="text-gray-800 font-medium mb-4">GH₵{p.price}</p>

                    <div className="mt-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/product/${p.id}`)}
                        className="py-2 px-3 border rounded hover:border-gray-700 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </article>
                ) : (
                  <div key={`placeholder-${idx}`} className="p-4 bg-white/20 rounded-lg shadow-inner animate-pulse h-72" />
                )
              )}
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed right-6 bottom-6 bg-gray-900 text-white font-medium rounded shadow-lg px-5 py-2">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
