"use client";

import { useEffect, useState } from "react";
import { campaignService } from "@/services/campaignService";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignService.getAllCampaigns(); 
        
        // Ensure we only show approved campaigns to supporters
        let allCampaigns = [];
        if (Array.isArray(res)) allCampaigns = res;
        else if (res && Array.isArray(res.data)) allCampaigns = res.data;
        
        const approved = allCampaigns.filter((c: any) => c.status === 'approved');
        setCampaigns(approved as any);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explore Campaigns</h1>
        <p className="text-muted mt-1">Discover and support creative projects directly from your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign: any) => {
          const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
          
          return (
            <div key={campaign._id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  {campaign.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-foreground line-clamp-1">{campaign.title}</h3>
                <p className="text-muted text-sm mt-2 line-clamp-2 flex-1">{campaign.description}</p>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-primary">{campaign.raisedAmount} C raised</span>
                    <span className="text-muted">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Link 
                  href={`/campaigns/${campaign._id}`}
                  className="mt-6 w-full py-3 bg-background hover:bg-primary hover:text-white text-primary border border-primary/20 hover:border-primary font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted">
            No approved campaigns available right now. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
