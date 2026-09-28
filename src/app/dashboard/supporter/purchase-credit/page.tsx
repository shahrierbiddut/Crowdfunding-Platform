"use client";

import { useState, useEffect } from "react";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

const PACKAGES = [
  { id: 1, credits: 100, amount: 10 },
  { id: 2, credits: 300, amount: 25 },
  { id: 3, credits: 800, amount: 60 },
  { id: 4, credits: 1500, amount: 110 },
];

export default function PurchaseCredit() {
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Check if returning from Stripe checkout
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    const dummyCredits = url.searchParams.get("dummy_credits");
    const dummyAmount = url.searchParams.get("dummy_amount");

    if (sessionId) {
      verifyPayment(sessionId, dummyCredits, dummyAmount);
    }
  }, []);

  const verifyPayment = async (sessionId: string, dummyCredits: string | null, dummyAmount: string | null) => {
    setVerifying(true);
    try {
      await paymentService.verifyPayment(sessionId, dummyCredits, dummyAmount);
      await refreshUser(); // Update credit balance in context
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your credits have been added to your account.',
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.response?.data?.message || 'Could not verify payment.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handlePurchase = async (pkg: typeof PACKAGES[0]) => {
    setIsLoading(true);
    try {
      const res = await paymentService.createCheckoutSession({ credits: pkg.credits, amount: pkg.amount });
      // Redirect to Stripe
      window.location.href = res.url;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-foreground">Purchase Credits</h1>
        <p className="text-muted mt-2">Get credits to support campaigns you care about. Securely processed by Stripe.</p>
      </div>

      {verifying && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl flex items-center justify-center gap-3 mb-6">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Verifying your payment and adding credits...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow hover:border-primary relative overflow-hidden group">
            {pkg.id === 3 && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{pkg.credits}</h3>
            <p className="text-sm font-medium text-muted uppercase tracking-wider">Credits</p>
            
            <div className="my-6 border-t border-border"></div>
            
            <p className="text-3xl font-bold text-foreground mb-6">${pkg.amount}</p>
            
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Buy Now
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-12 text-sm text-muted">
        <ShieldCheck className="w-5 h-5 text-success" />
        <span>Payments are securely processed by Stripe. We do not store your card details.</span>
      </div>
    </div>
  );
}
