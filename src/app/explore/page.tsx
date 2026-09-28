"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { categories, campaigns as mockCampaigns } from "@/data/mockData";
import api from "@/lib/axios";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("trending");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns from backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/campaigns?status=approved');
        
        // Map backend targetAmount to frontend fundingGoal
        const formattedCampaigns = res.data.map((c: any) => ({
          ...c,
          fundingGoal: c.targetAmount,
          percentage: Math.round((c.raisedAmount / c.targetAmount) * 100) || 0,
          id: c._id // use mongo _id as id
        }));
        
        // If DB is empty (not seeded yet), use mock data so UI isn't blank
        if (formattedCampaigns.length === 0) {
          setCampaigns(mockCampaigns);
        } else {
          setCampaigns(formattedCampaigns);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns, falling back to mock data", error);
        setCampaigns(mockCampaigns);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filtering and Sorting Logic
  const filteredAndSortedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // 1. Filter by Search Query
    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // 3. Sort
    switch (sortBy) {
      case "most-funded":
        result.sort((a, b) => b.raisedAmount - a.raisedAmount);
        break;
      case "almost-there":
        result.sort((a, b) => b.percentage - a.percentage);
        break;
      case "newest":
        // Since we don't have dates in mock data, we keep original order or shuffle
        // We'll just reverse for demonstration
        result.reverse();
        break;
      case "trending":
      default:
        // Keep original mock data order
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("trending");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Section */}
        <div className="bg-slate-900 py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
            >
              Explore Campaigns
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Discover inspiring projects and ideas from creators around the world. Your support can make them a reality.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12 bg-card p-4 rounded-2xl shadow-sm border border-border">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3 lg:w-64 shrink-0">
              <div className="w-12 h-12 bg-slate-50 border border-border rounded-xl flex items-center justify-center text-muted shrink-0">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full py-3.5 px-4 bg-slate-50 border border-border rounded-xl text-foreground font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none cursor-pointer appearance-none"
              >
                <option value="trending">Trending Now</option>
                <option value="most-funded">Most Funded</option>
                <option value="almost-there">Almost Funded</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 no-scrollbar">
            <Filter className="h-5 w-5 text-muted shrink-0 mr-2 hidden sm:block" />
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-foreground border border-border hover:border-primary/50 hover:bg-slate-50"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-foreground border border-border hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Campaigns Grid */}
          {filteredAndSortedCampaigns.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredAndSortedCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CampaignCard campaign={campaign} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-card rounded-2xl border border-dashed border-border"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No campaigns found</h3>
              <p className="text-muted max-w-md mx-auto mb-8">
                We couldn't find any campaigns matching your current filters. Try adjusting your search or category selection.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      
      <style jsx global>{`
        /* Hide scrollbar for category chips */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
