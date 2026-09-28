"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl p-10 md:p-16 border border-border shadow-2xl shadow-slate-200/50"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Have an Idea Worth Sharing?
          </h2>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Turn your vision into a campaign and connect with people who believe in what you are building. It takes less than 5 minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/start"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-1"
            >
              Start a Campaign
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border-2 border-border text-foreground font-bold text-lg hover:border-muted hover:bg-slate-50 transition-all shadow-sm transform hover:-translate-y-1"
            >
              Explore Campaigns
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
