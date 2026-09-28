"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { contributionService } from "@/services/contributionService";
import { Coins, HeartHandshake, Loader2, Target, Clock } from "lucide-react";
import Link from "next/link";

export default function SupporterHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContributions: 0,
    pendingContributions: 0,
    totalAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await contributionService.getMyContributions(1, 1000); // Fetch all to calculate stats
        const contributions = response.data;
        
        let totalAmount = 0;
        let pending = 0;

        contributions.forEach((c: any) => {
          if (c.status === 'approved') {
            totalAmount += c.contribution_amount;
          }
          if (c.status === 'pending') {
            pending += 1;
          }
        });

        setStats({
          totalContributions: contributions.length,
          pendingContributions: pending,
          totalAmount,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted mt-1">Here is an overview of your supporter dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Available Credits</h3>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{user?.credits.toLocaleString()}</p>
          <div className="mt-4">
            <Link href="/dashboard/supporter/purchase-credit" className="text-sm text-primary hover:underline font-medium">
              Buy more credits &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Total Amount Given</h3>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.totalAmount.toLocaleString()} C</p>
          <p className="text-sm text-muted mt-4">Approved contributions</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Total Projects Supported</h3>
            <HeartHandshake className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.totalContributions}</p>
          <div className="mt-4">
            <Link href="/dashboard/supporter/contributions" className="text-sm text-primary hover:underline font-medium">
              View history &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Pending Approvals</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.pendingContributions}</p>
          <p className="text-sm text-muted mt-4">Waiting for creator review</p>
        </div>
      </div>
      
      {/* Could add a Recent Contributions table here or recommended campaigns */}
    </div>
  );
}
