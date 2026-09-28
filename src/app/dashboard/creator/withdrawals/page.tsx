"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withdrawalService } from "@/services/withdrawalService";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function Withdrawals() {
  const { user, refreshUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const watchCredit = watch("withdrawal_credit");
  const estimatedDollar = watchCredit ? (Number(watchCredit) / 20).toFixed(2) : "0.00";

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await withdrawalService.getMyWithdrawals();
      setWithdrawals(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await withdrawalService.createWithdrawal({
        withdrawal_credit: Number(data.withdrawal_credit),
        payment_system: data.payment_system,
        account_number: data.account_number
      });

      Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Your withdrawal request has been sent to admin for processing.',
      });
      
      reset();
      fetchWithdrawals();
      refreshUser();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Withdraw Funds</h1>
        <p className="text-muted mt-1">Convert your earned credits into real money.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg text-foreground mb-6">New Request</h2>
            
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Withdrawal Rules:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Exchange rate: 20 Credits = $1</li>
                  <li>Minimum withdrawal: 200 Credits ($10)</li>
                </ul>
              </div>
            </div>

            <div className="mb-6 p-4 bg-background border border-border rounded-xl">
              <p className="text-sm text-muted mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-amber-500">{user?.credits.toLocaleString()} C</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount to Withdraw (Credits)</label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("withdrawal_credit", { 
                      required: "Amount is required",
                      min: { value: 200, message: "Minimum 200 credits" },
                      max: { value: user?.credits || 0, message: "Insufficient balance" }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    placeholder="200"
                  />
                  <div className="absolute right-3 top-3 text-muted font-medium">C</div>
                </div>
                {errors.withdrawal_credit && <p className="text-red-500 text-xs mt-1">{errors.withdrawal_credit.message as string}</p>}
                {watchCredit && !errors.withdrawal_credit && (
                  <p className="text-success text-xs mt-1 font-medium">You will receive approx. ${estimatedDollar}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
                <select
                  {...register("payment_system", { required: "Method is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                >
                  <option value="">Select Method</option>
                  <option value="Stripe">Stripe (Bank Transfer)</option>
                  <option value="Bkash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
                {errors.payment_system && <p className="text-red-500 text-xs mt-1">{errors.payment_system.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Number / Email</label>
                <input
                  type="text"
                  {...register("account_number", { required: "Account detail is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  placeholder="e.g. +8801700000000 or stripe@email.com"
                />
                {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number.message as string}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (user?.credits || 0) < 200}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-lg text-foreground">Withdrawal History</h2>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="p-4 font-semibold text-sm text-muted uppercase">Date</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase">Method</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase">Credits</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase">Amount</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                      </td>
                    </tr>
                  ) : withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-muted">
                        No withdrawal requests yet.
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((w: any) => (
                      <tr key={w._id} className="hover:bg-background/50">
                        <td className="p-4 text-sm text-muted">{new Date(w.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-medium text-foreground">
                          {w.payment_system}
                          <div className="text-xs text-muted font-normal mt-0.5">{w.account_number}</div>
                        </td>
                        <td className="p-4 font-semibold text-amber-500">{w.withdrawal_credit} C</td>
                        <td className="p-4 font-semibold text-success">${w.withdrawal_amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            w.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {w.status}
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
      </div>
    </div>
  );
}
