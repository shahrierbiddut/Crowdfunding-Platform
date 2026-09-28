"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'supporter' | 'creator' | 'admin'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        // Not authenticated
        router.replace("/login");
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        // Authenticated but wrong role
        if (user.role === 'admin') router.replace("/dashboard/admin-home");
        else if (user.role === 'creator') router.replace("/dashboard/creator-home");
        else router.replace("/dashboard/supporter-home");
      }
    }
  }, [loading, token, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering children briefly before redirect happens
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
