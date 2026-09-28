"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await adminService.getAllWithdrawals();
      setRequests(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === 'approved') {
      const result = await Swal.fire({
        title: 'Confirm Payout',
        text: "Did you actually transfer the money to the creator's account?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, mark as approved'
      });

      if (!result.isConfirmed) return;
    }

    try {
      await adminService.updateWithdrawalStatus(id, newStatus);
      fetchRequests();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Request marked as ${newStatus}`,
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
        <h1 className="text-2xl font-bold text-foreground">Withdrawal Requests</h1>
        <p className="text-muted mt-1">Review and process creator payout requests.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Creator</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Method</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Credits</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Amount ($)</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">No withdrawal requests found.</td>
                </tr>
              ) : (
                requests.map((r: any) => (
                  <tr key={r._id} className="hover:bg-background/50">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{r.creator_name}</p>
                      <p className="text-xs text-muted">{r.creator_email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{r.payment_system}</p>
                      <p className="text-xs text-muted font-mono">{r.account_number}</p>
                    </td>
                    <td className="p-4 font-semibold text-amber-500">{r.withdrawal_credit} C</td>
                    <td className="p-4 font-semibold text-success">${r.withdrawal_amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.status === 'approved' ? 'bg-green-100 text-green-800' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusChange(r._id, 'approved')} className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">Approve Payout</button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">Processed</span>
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
