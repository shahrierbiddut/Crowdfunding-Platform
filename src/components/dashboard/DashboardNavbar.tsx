"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, User, Coins, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { notificationService } from "@/services/notificationService";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-muted hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
        </Link>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        
        {user.role !== 'admin' && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
            <Coins className="w-4 h-4" />
            <span className="font-semibold text-sm">{user.credits.toLocaleString()} Credits</span>
          </div>
        )}

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }}
            className="relative text-muted hover:text-foreground transition-colors focus:outline-none"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-card rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-background flex justify-between items-center">
                <span className="font-bold text-sm text-foreground">Notifications</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted">No notifications yet.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((n: any) => (
                      <div key={n._id} className={`p-4 transition-colors ${n.read ? 'bg-card' : 'bg-blue-50/50'}`}>
                        <p className="text-sm text-foreground">{n.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                          {!n.read && (
                            <button onClick={() => handleMarkAsRead(n._id)} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted capitalize">{user.role}</p>
            </div>
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt={user.name} 
                width={40} 
                height={40} 
                className="rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User className="w-5 h-5" />
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
              <Link 
                href="/dashboard/profile" 
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-sm text-foreground hover:bg-background"
              >
                My Profile
              </Link>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
