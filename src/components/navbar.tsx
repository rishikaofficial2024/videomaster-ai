"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Crown, User, 
  Video, Bot, Settings, LayoutTemplate, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
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

  const isEditor = pathname === "/editor";

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel h-20 items-center justify-between px-10 rounded-full w-[95%] max-w-7xl transition-all duration-700 hover:w-[98%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-2.5 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Video className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">VideoMaster<span className="text-primary italic">AI</span></span>
        </Link>

        <div className="flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative group py-2",
                pathname === item.href ? "text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              {item.name}
              <div className={cn(
                "absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500",
                pathname === item.href ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-50"
              )} />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {profile?.isAdmin && (
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white border border-accent/30 px-5 py-2 rounded-full bg-accent/5 transition-all shadow-glow">
              MASTER HUB
            </Link>
          )}
          <Link href="/premium" className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
             <Zap className="w-3.5 h-3.5 fill-current" /> Upgrade
          </Link>
        </div>
      </nav>

      {/* MOBILE NAV */}
      {!isEditor && (
        <nav className="fixed bottom-6 left-6 right-6 z-50 glass-panel md:hidden h-24 flex items-center justify-around px-4 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all p-3 rounded-2xl",
                  isActive ? "text-primary scale-110 bg-primary/10" : "text-muted-foreground opacity-60"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                <span className="text-[8px] font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}