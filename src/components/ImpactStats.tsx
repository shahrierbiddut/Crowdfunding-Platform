"use client";

import { motion } from "framer-motion";
import { Users, Target, CircleDollarSign, LayoutGrid } from "lucide-react";

const stats = [
  { id: 1, name: "Supporters", value: "10K+", icon: Users },
  { id: 2, name: "Projects Funded", value: "500+", icon: Target },
  { id: 3, name: "Credits Contributed", value: "$2M+", icon: CircleDollarSign },
  { id: 4, name: "Categories", value: "50+", icon: LayoutGrid },
];

export default function ImpactStats() {
  return (
    <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl shadow-xl shadow-slate-200/50 border border-border overflow-hidden"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={24} strokeWidth={2} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-muted">
                {stat.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
