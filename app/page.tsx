"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import ShowcaseVideo from "@/components/ShowcaseVideo";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* First Video */}
      <ShowcaseVideo src="/videos/teaser.mp4" />

      {/* Slideshow Section */}
      <ShowcaseSlider />

      {/* Second Video */}
      <ShowcaseVideo src="/videos/promo.mp4" />

      {/* Footer */}
      <Footer />
    </>
  );
}
