"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ADMIN_EMAIL } from "@/lib/admin";

interface ProductDoc {
  id: string;
  name: string;
  price: number;
  category?: string;
  gender?: string;
  image?: string;
  createdAt?: Date;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // auth guard for admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email?.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/admin/login");
        return;
      }
      setAuthChecking(false);
    });
    return () => unsub();
  }, [router]);

  // fetch products
  useEffect(() => {
    if (authChecking) return;

    const db = getFirestore();
    const col = collection(db, "products");

    const unsub = onSnapshot(
      col,
      (snap) => {
        const data = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
          id: d.id,
          ...(d.data() as Omit<ProductDoc, 'id'>)
        })) as ProductDoc[];
        setProducts(data);
        setLoading(false);
      },
      (err) => {
        console.error("products snapshot error:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [authChecking]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("delete error", err);
      alert("Failed to delete");
    }
  };

  if (authChecking) return <div className="p-8">Checking admin access...</div>;

  return (
    <main className="min-h-screen p-8 pt-24 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium underline hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>

        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin — Products</h1>
          <div className="flex gap-2">
            <Link
              href="/admin/products/add"
              className="px-4 py-2 bg-gray-200 text-black rounded"
            >
              + Add Product
            </Link>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Dashboard
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {loading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-6 rounded shadow">No products yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded shadow flex gap-4 items-center"
              >
                <div className="w-28 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                  {p.image ? (
                    <Image fill src={p.image} alt={p.name} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">GH₵{p.price}</div>
                  <div className="text-xs text-gray-500">
                    {p.gender ?? ""} • {p.category ?? ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
