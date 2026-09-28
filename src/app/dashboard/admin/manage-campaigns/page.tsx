"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Loader2, ExternalLink } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await adminService.getAllCampaigns();
      setCampaigns(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminService.updateCampaignStatus(id, newStatus);
      fetchCampaigns();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Campaign ${newStatus}`,
        showConfirmButton: false,
        timer: 1500
      });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Campaigns</h1>
        <p className="text-muted mt-1">Review and approve or reject creator campaigns.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Campaign</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Creator</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Target</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">No campaigns found.</td>
                </tr>
              ) : (
                campaigns.map((c: any) => (
                  <tr key={c._id} className="hover:bg-background/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{c.title}</span>
                        <Link href={`/campaigns/${c._id}`} target="_blank" className="text-primary hover:text-primary-dark">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{c.creatorName}</td>
                    <td className="p-4 font-semibold">{c.targetAmount} C</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.status === 'approved' ? 'bg-green-100 text-green-800' :
                        c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        c.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {c.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusChange(c._id, 'approved')} className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-green-600">Approve</button>
                          <button onClick={() => handleStatusChange(c._id, 'rejected')} className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600">Reject</button>
                        </div>
                      ) : (
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
