"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function AddProduct() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"men" | "women">("men");
  const [imageFileName, setImageFileName] = useState("");

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

  const normalizeCategory = (v: string) => v?.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !imageFileName) {
      setError("Fill all fields (image filename required)");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const db = getFirestore();
      const imagePath = imageFileName.startsWith("/") ? imageFileName : `/products/${imageFileName}`;
      await addDoc(collection(db, "products"), {
        name: name.trim(),
        price: Number(price) || 0,
        category: normalizeCategory(category),
        gender,
        image: imagePath,
        createdAt: serverTimestamp(),
      });
      router.push("/admin/products");
    } catch (err) {
      console.error("add product error", err);
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (authChecking) return <div className="p-8">Checking admin...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-100 pt-24"> {/* added pt-24 to push content down */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium underline hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-4">Add Product (manual image)</h2>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="p-2 border rounded w-full" required />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
            <input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="p-2 border rounded w-full" required />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
            <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. Shirts)" className="p-2 border rounded w-full" required />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as "men" | "women")} className="p-2 border rounded w-full">
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label htmlFor="imageFileName" className="block text-sm font-medium mb-1">Image Filename</label>
            <input id="imageFileName" value={imageFileName} onChange={(e) => setImageFileName(e.target.value)} placeholder="shirt1.jpg" className="p-2 border rounded w-full" required />
            <p className="text-xs text-gray-500 mt-1">Example: <code>shirt1.jpg</code> — file should live at <code>/public/products/shirt1.jpg</code></p>
          </div>

          <div className="flex gap-2">
            <button disabled={saving} className="px-4 py-2 bg-burgundy text-white rounded">{saving ? "Saving..." : "Add Product"}</button>
            <button type="button" onClick={() => router.push("/admin/products")} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}
