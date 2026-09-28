"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import { Loader2, Users, FolderKanban, Wallet, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    pendingCampaigns: 0,
    pendingWithdrawals: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await adminService.getAllUsers();
        const campaigns = await adminService.getAllCampaigns();
        const withdrawals = await adminService.getAllWithdrawals();

        let pendingCamps = 0;
        let pendingWiths = 0;

        if(Array.isArray(campaigns)) pendingCamps = campaigns.filter(c => c.status === 'pending').length;
        if(Array.isArray(withdrawals)) pendingWiths = withdrawals.filter(w => w.status === 'pending').length;

        setStats({
          totalUsers: users?.length || 0,
          totalCampaigns: campaigns?.length || 0,
          pendingCampaigns: pendingCamps,
          pendingWithdrawals: pendingWiths
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted mt-1">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Total Users</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.totalUsers}</p>
          <div className="mt-4">
            <Link href="/dashboard/admin/manage-users" className="text-sm text-primary group-hover:underline font-medium">
              Manage Users &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Total Campaigns</h3>
            <FolderKanban className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.totalCampaigns}</p>
          <div className="mt-4">
            <Link href="/dashboard/admin/manage-campaigns" className="text-sm text-primary group-hover:underline font-medium">
              Manage Campaigns &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Pending Campaigns</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.pendingCampaigns}</p>
          <div className="mt-4">
            <Link href="/dashboard/admin/manage-campaigns" className="text-sm text-primary group-hover:underline font-medium">
              Review Campaigns &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Pending Withdrawals</h3>
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.pendingWithdrawals}</p>
          <div className="mt-4">
            <Link href="/dashboard/admin/withdrawal-requests" className="text-sm text-primary group-hover:underline font-medium">
              Process Payouts &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
