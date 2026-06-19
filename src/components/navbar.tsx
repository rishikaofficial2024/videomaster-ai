
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, LayoutTemplate, FolderOpen, User, Crown, LayoutDashboard, Coins, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editor", href: "/editor", icon: Video },
  { name: "Designs", href: "/templates", icon: LayoutTemplate },
  { name: "Videos", href: "/projects", icon: FolderOpen },
  { name: "Pro Plan", href: "/premium", icon: Crown },
  { name: "Aap", href: "/profile", icon: User },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-3xl border-t md:top-0 md:bottom-auto md:border-t-0 md:border-b h-20 flex items-center justify-center px-6 shadow-2xl">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-primary rounded-2xl p-2 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <Video className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-3 bg-primary/10 px-5 py-2 rounded-2xl border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-700">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                {profile?.isPremium ? 'Unlimited Credits' : `${profile?.credits ?? 0} Credits`}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-around md:justify-end md:gap-4 lg:gap-10">
          {profile?.isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex flex-col md:flex-row items-center gap-1.5 transition-all p-3 rounded-2xl group",
                pathname === "/admin" ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-400"
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
                    ? "text-primary bg-primary/10 md:bg-transparent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <Icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "fill-current")} />
                </div>
                <span className="text-[10px] md:text-sm font-bold tracking-tight">{item.name}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full md:hidden shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
