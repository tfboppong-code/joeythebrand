"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Hero() {
  // Animation variants with proper type
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } },
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12">

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0 translate-y-8">
          <img
            src="/images/hero.jpg"
            alt="Hero"
            className="max-h-[400px] w-auto object-contain rounded-2xl shadow-xl"
          />
        </div>

        {/* Text + Button */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-center space-y-4">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
            className="text-4xl md:text-5xl font-bold text-black leading-snug"
          >
            Welcome to <span className="text-burgundy">JOEY</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
            className="text-lg md:text-xl text-gray-900 max-w-md"
          >
            Explore our exclusive collection and elevate your style with premium fashion.
          </motion.p>

          {/* Continue Shopping Button centered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={buttonVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(128,0,32,0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <Link
  href="/login"
  className="inline-block py-3 px-8 bg-white/90 text-black font-semibold rounded-xl shadow-md hover:bg-white/100 transition-all"
>
  Continue Shopping
</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
