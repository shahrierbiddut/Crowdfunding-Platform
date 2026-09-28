"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { campaignService } from "@/services/campaignService";
import { contributionService } from "@/services/contributionService";
import { Loader2, FolderKanban, Coins, ArrowUpRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CreatorHome() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    pendingApprovals: 0
  });
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const camps = await campaignService.getMyCampaigns();
      const conts = await contributionService.getCreatorContributions();
      
      const active = camps.filter((c: any) => c.status === 'approved').length;
      let raised = 0;
      camps.forEach((c: any) => { raised += c.raisedAmount; });
      
      const pending = conts.filter((c: any) => c.status === 'pending');

      setStats({
        totalCampaigns: camps.length,
        activeCampaigns: active,
        totalRaised: raised,
        pendingApprovals: pending.length
      });
      setContributions(pending.slice(0, 5) as any);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await contributionService.updateContributionStatus(id, action);
      Swal.fire({
        icon: 'success',
        title: action === 'approved' ? 'Contribution Accepted' : 'Contribution Rejected',
        timer: 1500,
        showConfirmButton: false
      });
      fetchData();
      refreshUser();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Action Failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted mt-1">Here is the overview of your campaigns and earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">My Balance</h3>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{user?.credits.toLocaleString()} C</p>
          <div className="mt-4">
            <Link href="/dashboard/creator/withdrawals" className="text-sm text-primary hover:underline font-medium">
              Withdraw funds &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Total Raised</h3>
            <ArrowUpRight className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.totalRaised.toLocaleString()} C</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Active Campaigns</h3>
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.activeCampaigns}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-muted font-medium">Pending Approvals</h3>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-4">{stats.pendingApprovals}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Pending Contributions</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Campaign</th>
                  <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Supporter</th>
                  <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Amount</th>
                  <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contributions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted">No pending contributions right now.</td>
                  </tr>
                ) : (
                  contributions.map((c: any) => (
                    <tr key={c._id} className="hover:bg-background/50">
                      <td className="p-4 text-foreground font-medium">{c.campaign_title}</td>
                      <td className="p-4 text-muted">{c.supporter_name}</td>
                      <td className="p-4 text-primary font-semibold">{c.contribution_amount} C</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleAction(c._id, 'approved')} className="px-3 py-1.5 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">Accept</button>
                        <button onClick={() => handleAction(c._id, 'rejected')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
