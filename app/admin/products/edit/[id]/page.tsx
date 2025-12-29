"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ADMIN_EMAIL } from "@/lib/admin";

interface ProductData {
  name?: string;
  price?: number;
  category?: string;
  gender?: "men" | "women";
  image?: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"men" | "women">("men");
  const [imageFileName, setImageFileName] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing product id");
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/admin/login");
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          setError("Product not found");
        } else {
          const data = snap.data() as ProductData;
          setName(data.name ?? "");
          setPrice(data.price != null ? String(data.price) : "");
          setCategory(data.category ?? "");
          setGender(data.gender ?? "men");

          const img = data.image ?? "";
          setImageFileName(img.replace(/^\/products\//, ""));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [id, router]);

  const saveProduct = async () => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const db = getFirestore();
      const docRef = doc(db, "products", id);

      const imagePath = imageFileName.startsWith("/")
        ? imageFileName
        : `/products/${imageFileName}`;

      await updateDoc(docRef, {
        name: name.trim(),
        price: Number(price) || 0,
        category: category.trim(),
        gender,
        image: imagePath,
      });

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 pt-24">Loading...</div>;
  }

  return (
    <main className="min-h-screen pt-24 p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium underline hover:text-gray-700"
        >
          ← Back
        </button>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>

          {error && <div className="mb-3 text-red-600">{error}</div>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProduct();
            }}
            className="grid gap-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "men" | "women")}
                className="w-full p-2 border rounded"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="imageFileName"
                className="block text-sm font-medium mb-1"
              >
                Image Filename
              </label>
              <input
                id="imageFileName"
                value={imageFileName}
                onChange={(e) => setImageFileName(e.target.value)}
                placeholder="dress1.jpg"
                className="w-full p-2 border rounded"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must exist in <code>/public/products/</code>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-burgundy text-white rounded"
              >
                {saving ? "Saving..." : "Done"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
