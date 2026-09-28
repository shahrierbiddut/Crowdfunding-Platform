"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { campaignService } from "@/services/campaignService";
import { uploadToImgBB } from "@/lib/imgbb";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Loader2, UploadCloud } from "lucide-react";

export default function AddCampaign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (!imageFile) {
      Swal.fire({ icon: 'error', title: 'Image Required', text: 'Please upload a cover image.' });
      return;
    }

    setIsLoading(true);
    try {
      const imageUrl = await uploadToImgBB(imageFile);
      
      await campaignService.createCampaign({
        ...data,
        targetAmount: Number(data.targetAmount),
        minimumContribution: Number(data.minimumContribution),
        image: imageUrl
      });

      Swal.fire({
        icon: 'success',
        title: 'Campaign Submitted',
        text: 'Your campaign has been sent to admin for approval.',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        router.push('/dashboard/creator/my-campaigns');
      });

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to create campaign',
        text: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Campaign</h1>
        <p className="text-muted mt-1">Start a new project and raise funds.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Campaign Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                placeholder="E.g., Revolutionary Smart Watch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Art">Art & Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
              <input
                type="date"
                {...register("deadline", { required: "Deadline is required" })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Amount (Credits)</label>
              <input
                type="number"
                {...register("targetAmount", { required: "Target amount is required" })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum Contribution (Credits)</label>
              <input
                type="number"
                {...register("minimumContribution", { required: "Minimum contribution is required" })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                placeholder="10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background resize-none"
                placeholder="Tell us about your campaign..."
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Reward Info (Optional)</label>
              <textarea
                {...register("rewardInfo")}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background resize-none"
                placeholder="E.g., Contributors over 1000 credits get early access..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Cover Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer hover:bg-background/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-muted mb-2" />
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{imageFile ? imageFile.name : 'Click to upload image'}</p>
                  <p className="text-xs text-muted mt-1">PNG, JPG, up to 5MB</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Submitting..." : "Submit Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
