"use client";

import { motion } from "framer-motion";
import { Search, FileText, CreditCard, TrendingUp } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Discover",
    description: "Explore campaigns and find projects that matter to you.",
    icon: Search,
  },
  {
    id: 2,
    title: "Choose",
    description: "Read the campaign story and decide how you want to contribute.",
    icon: FileText,
  },
  {
    id: 3,
    title: "Support",
    description: "Use your platform credits to support the campaign.",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Make an Impact",
    description: "Track the progress of the projects you support.",
    icon: TrendingUp,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted"
          >
            From discovering an idea to helping it grow, supporting a campaign takes only a few simple steps.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 relative z-10 group hover:border-primary/20 transition-colors duration-300">
                  <step.icon size={32} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
