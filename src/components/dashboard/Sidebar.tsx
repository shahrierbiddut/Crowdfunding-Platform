"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Compass, 
  HeartHandshake, 
  CreditCard, 
  History, 
  PlusCircle, 
  FolderKanban, 
  Wallet, 
  Users, 
  LogOut,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const supporterLinks = [
    { name: "Dashboard", href: "/dashboard/supporter-home", icon: LayoutDashboard },
    { name: "Explore Campaigns", href: "/dashboard/supporter/explore", icon: Compass },
    { name: "My Contributions", href: "/dashboard/supporter/contributions", icon: HeartHandshake },
    { name: "Buy Credits", href: "/dashboard/supporter/purchase-credit", icon: CreditCard },
    { name: "Payment History", href: "/dashboard/supporter/payment-history", icon: History },
  ];

  const creatorLinks = [
    { name: "Dashboard", href: "/dashboard/creator-home", icon: LayoutDashboard },
    { name: "Add Campaign", href: "/dashboard/creator/add-campaign", icon: PlusCircle },
    { name: "My Campaigns", href: "/dashboard/creator/my-campaigns", icon: FolderKanban },
    { name: "Withdrawals", href: "/dashboard/creator/withdrawals", icon: Wallet },
    { name: "Payment History", href: "/dashboard/creator/payment-history", icon: History },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin-home", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
    { name: "Manage Campaigns", href: "/dashboard/admin/manage-campaigns", icon: FolderKanban },
    { name: "Withdrawal Requests", href: "/dashboard/admin/withdrawal-requests", icon: Wallet },
    { name: "Reports", href: "/dashboard/admin/reports", icon: ShieldAlert },
  ];

  let links = supporterLinks;
  if (user.role === 'creator') links = creatorLinks;
  if (user.role === 'admin') links = adminLinks;

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex-col hidden lg:flex sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold text-foreground">FundFlow</span>
        </Link>
        <div className="mt-2 text-xs font-semibold text-muted uppercase tracking-wider">
          {user.role} PANEL
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/dashboard/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/dashboard/profile"
              ? "bg-primary text-white"
              : "text-muted hover:bg-background hover:text-foreground"
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
