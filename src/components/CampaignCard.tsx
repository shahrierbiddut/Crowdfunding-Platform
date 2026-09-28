"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CampaignProps {
  campaign: {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    raisedAmount: number;
    fundingGoal: number;
    percentage: number;
  };
}

export default function CampaignCard({ campaign }: CampaignProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          {campaign.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>
        <p className="text-muted text-sm line-clamp-2 mb-6 flex-grow">
          {campaign.description}
        </p>

        {/* Funding Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-end">
            <div className="font-bold text-2xl text-foreground">
              ${campaign.raisedAmount.toLocaleString()}
            </div>
            <div className="text-sm text-muted">
              raised of ${campaign.fundingGoal.toLocaleString()}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(campaign.percentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-success h-2.5 rounded-full"
            />
          </div>
          <div className="text-sm font-semibold text-success text-right">
            {campaign.percentage}% funded
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/campaigns/${campaign.id}`}
          className="w-full text-center bg-slate-50 hover:bg-primary text-foreground hover:text-white border border-border hover:border-primary font-medium py-3 rounded-xl transition-colors duration-300"
        >
          View Campaign
        </Link>
      </div>
    </motion.div>
  );
}
