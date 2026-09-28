"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { campaignService } from "@/services/campaignService";
import { Loader2, PlusCircle, CheckCircle, Clock, XCircle, Edit, Trash2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Modal State
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getMyCampaigns();
      setCampaigns(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Delete Campaign?',
      html: `Are you sure you want to delete <b>${title}</b>?<br/><br/><span style="color:red;font-size:14px;">Warning: All approved contributions will be refunded to supporters from your account. This action cannot be undone!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Processing Refund & Deletion...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        await campaignService.deleteCampaign(id);
        
        Swal.fire('Deleted!', 'Campaign has been deleted and funds refunded.', 'success');
        fetchCampaigns();
      } catch (error: any) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to delete campaign.', 'error');
      }
    }
  };

  const openEditModal = (campaign: any) => {
    setEditingCampaign(campaign);
    reset({
      title: campaign.title,
      description: campaign.description,
      rewardInfo: campaign.rewardInfo || ""
    });
  };

  const onUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      await campaignService.updateCampaign(editingCampaign._id, data);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Campaign updated successfully',
        showConfirmButton: false,
        timer: 1500
      });
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'pending': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3"/> Pending Review</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3"/> Rejected</span>;
      default: return null;
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Campaigns</h1>
          <p className="text-muted mt-1">Manage and track your fundraising projects.</p>
        </div>
        <Link href="/dashboard/creator/add-campaign" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign: any) => {
          const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
          
          return (
            <div key={campaign._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative h-48 w-full">
                <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(campaign.status)}
                </div>
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button 
                    onClick={() => openEditModal(campaign)}
                    className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                    title="Edit Campaign"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(campaign._id, campaign.title)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{campaign.title}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-primary">{campaign.raisedAmount} C raised</span>
                    <span className="text-muted">Target: {campaign.targetAmount} C</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted">Min Contribution</p>
                    <p className="font-semibold text-foreground">{campaign.minimumContribution} C</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Deadline</p>
                    <p className="font-semibold text-foreground">{new Date(campaign.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {campaigns.length === 0 && (
          <div className="col-span-full bg-card border border-border border-dashed rounded-2xl p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No campaigns yet</h3>
            <p className="text-muted mb-6">Start your first campaign to raise funds for your project.</p>
            <Link href="/dashboard/creator/add-campaign" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Create Campaign
            </Link>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setEditingCampaign(null)} className="absolute top-6 right-6 text-muted hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-6">Edit Campaign</h2>
            
            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Campaign Title</label>
                <input
                  {...register("title", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Story / Description</label>
                <textarea
                  {...register("description", { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reward Info (Optional)</label>
                <textarea
                  {...register("rewardInfo")}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingCampaign(null)}
                  className="px-6 py-3 rounded-xl font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
