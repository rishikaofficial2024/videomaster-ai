
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, LayoutTemplate, FolderOpen, User, Crown, LayoutDashboard, Coins, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editor", href: "/editor", icon: Video },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Premium", href: "/premium", icon: Crown },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t md:top-0 md:bottom-auto md:border-t-0 md:border-b h-20 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl flex items-center justify-between">
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Video className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-500">
              <Coins className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-tight">
                {profile?.isPremium ? 'UNLIMITED' : `${profile?.credits ?? 0} Credits`}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-around md:justify-end md:gap-4 lg:gap-8">
          {profile?.isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex flex-col md:flex-row items-center gap-1.5 transition-all p-3 rounded-2xl group",
                pathname === "/admin" ? "text-red-500 bg-red-500/5" : "text-muted-foreground hover:text-red-400"
              )}
            >
              <ShieldAlert className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-bold tracking-tight">Admin</span>
            </Link>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1.5 transition-all p-3 rounded-2xl group relative",
                  isActive 
                    ? "text-primary bg-primary/5 md:bg-transparent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-1 rounded-lg transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <Icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "fill-current")} />
                </div>
                <span className="text-[10px] md:text-sm font-bold tracking-tight">{item.name}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full md:hidden" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
