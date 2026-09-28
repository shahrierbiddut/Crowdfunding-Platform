"use client";

import { useEffect, useState, use } from "react";
import { campaignService } from "@/services/campaignService";
import { contributionService } from "@/services/contributionService";
import { reportService } from "@/services/reportService";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Loader2, Heart, Flag, Clock, Target, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function CampaignDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showContribute, setShowContribute] = useState(false);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [resolvedParams.id]);

  const fetchCampaign = async () => {
    try {
      const res = await campaignService.getCampaignById(resolvedParams.id);
      setCampaign(res);
    } catch (error) {
      console.error(error);
      router.push('/explore'); // Redirect if not found
    } finally {
      setIsLoading(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'supporter') {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Only supporters can back projects. Please login with a supporter account.' });
      return;
    }

    const numAmount = Number(amount);
    if (numAmount < campaign.minimumContribution) {
      Swal.fire({ icon: 'error', title: 'Invalid Amount', text: `Minimum contribution is ${campaign.minimumContribution} C.` });
      return;
    }
    if (numAmount > user.credits) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Insufficient Credits', 
        text: 'You do not have enough credits.',
        confirmButtonText: 'Buy Credits',
        showCancelButton: true
      }).then((res) => {
        if(res.isConfirmed) router.push('/dashboard/supporter/purchase-credit');
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await contributionService.createContribution({
        campaign_id: campaign._id,
        contribution_amount: numAmount
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your contribution has been sent for approval.',
      });
      
      setShowContribute(false);
      setAmount("");
      refreshUser();
      fetchCampaign();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setIsReporting(true);
    try {
      await reportService.createReport({
        campaign_id: campaign._id,
        reason
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Report Submitted',
        text: 'Admin will review this campaign shortly.',
      });
      
      setShowReport(false);
      setReason("");
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message || 'Something went wrong.' });
    } finally {
      setIsReporting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!campaign) return null;

  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg mb-12">
          {/* Header Image */}
          <div className="relative h-[300px] md:h-[400px] w-full bg-muted">
            <Image 
              src={campaign.image} 
              alt={campaign.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-primary">
              {campaign.category}
            </div>
            {campaign.status !== 'approved' && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                {campaign.status}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Content */}
            <div className="p-8 lg:p-12 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{campaign.title}</h1>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">{campaign.creatorName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm text-muted">Created by</p>
                  <p className="font-semibold text-foreground">{campaign.creatorName}</p>
                </div>
              </div>

              <div className="prose prose-p:text-muted prose-headings:text-foreground max-w-none">
                <h3 className="text-xl font-bold mb-3">About this campaign</h3>
                <p className="whitespace-pre-line text-lg leading-relaxed">{campaign.description}</p>
                
                {campaign.rewardInfo && (
                  <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                    <h4 className="text-primary font-bold mb-2 flex items-center gap-2"><Target className="w-5 h-5"/> Rewards</h4>
                    <p className="text-muted">{campaign.rewardInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar (Funding info) */}
            <div className="p-8 lg:p-12 bg-background/50 flex flex-col justify-between">
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-primary">{campaign.raisedAmount} C</span>
                    <span className="text-muted mb-1">of {campaign.targetAmount} C</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{progress.toFixed(1)}% funded</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-foreground">{daysLeft}</p>
                      <p className="text-sm text-muted">Days to go</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-foreground">{campaign.minimumContribution} C</p>
                      <p className="text-sm text-muted">Minimum contribution</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {campaign.status === 'approved' ? (
                  <button 
                    onClick={() => setShowContribute(true)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-white" /> Back this project
                  </button>
                ) : (
                  <button disabled className="w-full bg-muted text-muted-foreground font-bold py-4 rounded-xl cursor-not-allowed">
                    Campaign not active
                  </button>
                )}

                <button 
                  onClick={() => setShowReport(true)}
                  className="w-full mt-4 bg-transparent border border-border hover:border-red-500 hover:text-red-500 text-muted font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Flag className="w-4 h-4" /> Report Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Contribute Modal */}
      {showContribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowContribute(false)} className="absolute top-6 right-6 text-muted hover:text-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-2">Back this project</h2>
            <p className="text-muted mb-6">Enter the amount of credits you want to contribute.</p>
            
            <form onSubmit={handleContribute}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Contribution Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min={campaign.minimumContribution}
                    className="w-full px-4 py-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 bg-background text-lg font-bold"
                    placeholder={`${campaign.minimumContribution}`}
                  />
                  <div className="absolute right-4 top-4 text-muted font-bold">Credits</div>
                </div>
                <p className="text-xs text-muted mt-2">Minimum: {campaign.minimumContribution} C</p>
                {user && (
                  <p className="text-xs text-success mt-1 font-medium">Your balance: {user.credits} C</p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Contribution"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowReport(false)} className="absolute top-6 right-6 text-muted hover:text-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-foreground">Report Campaign</h2>
            </div>
            <p className="text-muted mb-6 text-sm">Let us know if you think this campaign violates our community guidelines.</p>
            
            <form onSubmit={handleReport}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Reason for reporting</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-red-500/20 bg-background resize-none"
                  placeholder="Please provide details..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isReporting}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isReporting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
