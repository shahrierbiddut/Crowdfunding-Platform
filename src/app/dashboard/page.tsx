"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/dashboard/admin-home');
      } else if (user.role === 'creator') {
        router.replace('/dashboard/creator-home');
      } else {
        router.replace('/dashboard/supporter-home');
      }
    }
  }, [user, loading, router]);

  return null;
}
