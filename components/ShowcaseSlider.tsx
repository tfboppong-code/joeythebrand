"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg",
  "/images/slide4.jpg",
];

export default function ShowcaseSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden 
                        bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 
                        mt-4">
      {images.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: current === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 h-full w-auto object-contain mx-auto"
        />
      ))}

      {/* Optional subtle overlay */}
      <div className="absolute inset-0 bg-gray-300/20"></div>

      {/* Arrows */}
      <button
        onClick={() =>
          setCurrent((current - 1 + images.length) % images.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
      >
        ‹
      </button>

      <button
        onClick={() => setCurrent((current + 1) % images.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
      >
        ›
      </button>
    </section>
  );
}
