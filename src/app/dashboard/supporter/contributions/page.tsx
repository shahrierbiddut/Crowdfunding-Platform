"use client";

import { useEffect, useState } from "react";
import { contributionService } from "@/services/contributionService";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default function MyContributions() {
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContributions(page);
  }, [page]);

  const fetchContributions = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const res = await contributionService.getMyContributions(currentPage, 10);
      setContributions(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3"/> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3"/> Rejected & Refunded</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Contributions</h1>
          <p className="text-muted mt-1">Track all the campaigns you have supported.</p>
        </div>
        <Link href="/dashboard/supporter/explore" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Explore Campaigns
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Campaign</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Creator</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Amount</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Date</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : contributions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    You haven't made any contributions yet.
                  </td>
                </tr>
              ) : (
                contributions.map((c: any) => (
                  <tr key={c._id} className="hover:bg-background/50 transition-colors">
                    <td className="p-4 text-foreground font-medium">{c.campaign_title}</td>
                    <td className="p-4 text-muted">{c.creator_name}</td>
                    <td className="p-4 text-foreground font-semibold">{c.contribution_amount.toLocaleString()} C</td>
                    <td className="p-4 text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{getStatusBadge(c.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border border-border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border border-border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
