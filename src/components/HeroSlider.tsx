"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    heading: "Discover Ideas Worth Supporting",
    description:
      "Explore meaningful projects, creative ideas, and community-driven campaigns from people turning their visions into reality.",
    primaryCTA: "Explore Campaigns",
    primaryHref: "/explore",
    secondaryCTA: "How It Works",
    secondaryHref: "/how-it-works",
    image: "/images/hero-discover.jpg",
  },
  {
    id: 2,
    heading: "Your Idea Deserves a Chance",
    description:
      "Launch your campaign, share your story, and connect with supporters who believe in your vision.",
    primaryCTA: "Start a Campaign",
    primaryHref: "/start",
    secondaryCTA: "Learn More",
    secondaryHref: "/learn",
    image: "/images/hero-create.jpg",
  },
  {
    id: 3,
    heading: "Small Contributions. Real Impact.",
    description:
      "Support projects you believe in and help creators move one step closer to their goals.",
    primaryCTA: "Explore Projects",
    primaryHref: "/explore",
    secondaryCTA: "Join the Community",
    secondaryHref: "/register",
    image: "/images/hero-support.jpg",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] pt-20 bg-background overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        loop
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="w-full h-full relative">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                className="object-cover opacity-15 md:opacity-20 pointer-events-none"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="max-w-2xl"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                    {slide.heading}
                  </h1>
                  <p className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={slide.primaryHref}
                      className="inline-flex justify-center items-center px-8 py-3.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    >
                      {slide.primaryCTA}
                    </Link>
                    <Link
                      href={slide.secondaryHref}
                      className="inline-flex justify-center items-center px-8 py-3.5 rounded-xl bg-white border border-border text-foreground font-medium hover:border-muted hover:bg-gray-50 transition-all shadow-sm"
                    >
                      {slide.secondaryCTA}
                    </Link>
                  </div>
                </motion.div>

                {/* Main Visual Image for Desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true }}
                  className="hidden lg:block relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background-color: var(--primary);
          opacity: 0.3;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: var(--primary);
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: scale(0.8);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          transform: scale(0.9);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
