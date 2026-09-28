"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { User, Mail, Shield, Coins } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
      
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          <div className="shrink-0">
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt={user.name} 
                width={120} 
                height={120} 
                className="rounded-full object-cover border-4 border-background shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-sm">
                <User className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6 text-center sm:text-left w-full">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted mt-1 capitalize">{user.role} Account</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted" />
                <div className="text-left">
                  <p className="text-xs text-muted font-medium">Email Address</p>
                  <p className="font-semibold text-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="bg-background p-4 rounded-xl border border-border flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted" />
                <div className="text-left">
                  <p className="text-xs text-muted font-medium">Account Role</p>
                  <p className="font-semibold text-foreground capitalize">{user.role}</p>
                </div>
              </div>

              <div className="bg-background p-4 rounded-xl border border-border flex items-center gap-3 sm:col-span-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-xs text-muted font-medium">Available Balance</p>
                  <p className="font-semibold text-foreground text-lg">{user.credits.toLocaleString()} Credits</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
