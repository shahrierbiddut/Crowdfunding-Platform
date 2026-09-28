"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Loader2, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportService.getAllReports();
      setReports(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await reportService.updateReportStatus(id, newStatus);
      fetchReports();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Report marked as ${newStatus}`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Reports</h1>
        <p className="text-muted mt-1">Review flagged campaigns from users.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Reported Campaign</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Reporter</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider max-w-xs">Reason</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted">
                    <ShieldAlert className="w-8 h-8 mx-auto text-muted mb-2 opacity-50" />
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((r: any) => (
                  <tr key={r._id} className="hover:bg-background/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{r.campaign_title}</span>
                        <Link href={`/campaigns/${r.campaign_id}`} target="_blank" className="text-primary hover:text-primary-dark">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{r.reporter_name}</p>
                      <p className="text-xs text-muted">{r.reporter_email}</p>
                    </td>
                    <td className="p-4 text-sm text-muted max-w-xs truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r._id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
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
