"use client";

import { useEffect, useState } from "react";
import { paymentService } from "@/services/paymentService";
import { Loader2 } from "lucide-react";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await paymentService.getMyPayments();
        setPayments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted mt-1">View your credit purchase history via Stripe.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Date</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Amount</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Credits Received</th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    No payment history found.
                  </td>
                </tr>
              ) : (
                payments.map((p: any) => (
                  <tr key={p._id} className="hover:bg-background/50 transition-colors">
                    <td className="p-4 text-xs font-mono text-muted">{p.transaction_id}</td>
                    <td className="p-4 text-muted text-sm">{new Date(p.paidAt || p.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-foreground font-semibold">${p.amount}</td>
                    <td className="p-4 text-success font-medium">+{p.credits} C</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {p.status}
                      </span>
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
