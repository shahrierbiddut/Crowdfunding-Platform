"use client";

import { motion } from "framer-motion";

export default function PlatformImpact() {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-[20px] border-white/20" />
        <div className="absolute top-40 -left-20 w-64 h-64 rounded-full border-[10px] border-white/20" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-white/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Together, We Create Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80"
          >
            Every contribution brings an idea closer to reality. Join thousands of creators and supporters making a difference.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/20 text-center">
          {[
            { value: "10,000+", label: "Active Supporters" },
            { value: "1,250+", label: "Campaigns Created" },
            { value: "850+", label: "Campaigns Funded" },
            { value: "25,000+", label: "Contributions Made" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="px-4"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-white/80 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
