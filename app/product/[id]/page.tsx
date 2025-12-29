"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const db = getFirestore();
      const docRef = doc(db, "products", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setProduct({
          id: snap.id,
          name: data.name ?? "",
          price: data.price ?? 0,
          images: data.images ?? [data.image ?? data.img ?? ""],
          description: data.description ?? "Blue stripped shirt and pants, fit for any occasion.",
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-24">Loading...</p>;
  if (!product) return <p className="text-center mt-24">Product not found.</p>;

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-24 font-sans relative">
      {/* Floating Back Button */}
<button
  onClick={() => router.back()}
  className="fixed top-[80px] left-6 text-sm font-medium underline hover:text-gray-700 z-50"
>
  ← Back
</button>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Image + Carousel */}
        <div className="flex-1 relative">
          <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.images[currentIndex]}
              alt={product.name}
              fill
              className="object-cover w-full h-full"
              unoptimized
            />

            {/* Premium Overlay Arrows */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-colors"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-colors"
            >
              ▶
            </button>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-2 justify-center">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-20 h-20 rounded overflow-hidden border-2 ${
                  currentIndex === idx ? "border-burgundy" : "border-gray-300"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} width={80} height={80} className="object-cover w-full h-full" unoptimized />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-6 justify-start">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800">GH₵{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          <button
            onClick={() =>
              addToCart({ id: product.id, name: product.name, price: product.price })
            }
            className="mt-4 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
