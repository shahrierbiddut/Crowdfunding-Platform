"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CampaignCard from "./CampaignCard";
import { campaigns } from "@/data/mockData";

export default function TopFundedCampaigns() {
  // Take exactly 6 campaigns
  const topCampaigns = campaigns.slice(0, 6);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Top Funded Campaigns
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted"
            >
              Discover the campaigns making the biggest impact right now.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/explore"
              className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors group"
            >
              Explore All Campaigns
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Campaign Grid (Exactly 6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 w-full bg-white border border-border text-foreground font-semibold py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Explore All Campaigns
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
