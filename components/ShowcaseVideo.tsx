"use client";

import { motion } from "framer-motion";

export default function ShowcaseVideo({ src }: { src: string }) {
  return (
    <section className="relative w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-md h-[75vh] overflow-hidden rounded-2xl shadow-xl">
        <video
          src={src}
          autoPlay
          playsInline
          muted
          loop
          className="w-full h-full object-cover"
        />

        {/* Optional overlay for premium look */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gray-300/20 rounded-2xl"
        ></motion.div>
      </div>
    </section>
  );
}
