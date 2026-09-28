"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Loader2, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import { uploadToImgBB } from "@/lib/imgbb";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["supporter", "creator"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "supporter",
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      let photoURL = "";
      if (imageFile) {
        photoURL = await uploadToImgBB(imageFile);
      }

      const response = await authService.register({
        ...data,
        photoURL,
      });

      login(response);
      
      const credits = response.role === 'supporter' ? 50 : 20;

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: `You have received ${credits} credits as a welcome bonus!`,
        confirmButtonColor: '#2563EB',
      }).then(() => {
        if (response.role === 'creator') router.push('/dashboard/creator-home');
        else router.push('/dashboard/supporter-home');
      });

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-sm border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted mt-2">Join our community and start making an impact</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-xl border border-border bg-background p-4 flex-col items-center hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <input type="radio" value="supporter" {...register("role")} className="peer sr-only" />
                  <span className="font-medium text-foreground mt-1">Supporter</span>
                  <span className="text-xs text-muted text-center mt-1">Back projects (+50 Credits)</span>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-border bg-background p-4 flex-col items-center hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <input type="radio" value="creator" {...register("role")} className="peer sr-only" />
                  <span className="font-medium text-foreground mt-1">Creator</span>
                  <span className="text-xs text-muted text-center mt-1">Start campaigns (+20 Credits)</span>
                </label>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Profile Picture (Optional)</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-border border-dashed rounded-xl cursor-pointer hover:bg-background/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-6 h-6 text-muted mb-2" />
                  <p className="text-xs text-muted truncate max-w-[200px]">{imageFile ? imageFile.name : 'Click to upload image'}</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
