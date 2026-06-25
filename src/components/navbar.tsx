"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Compass, Crown, User, 
  Video, Bot, Settings, LayoutTemplate
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

  // Don't show navbar in Editor on small screens to save space
  const isEditor = pathname === "/editor";

  return (
    <>
      {/* Desktop Header Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-[#020408]/80 backdrop-blur-3xl border-b border-white/5 h-20 items-center justify-center px-10 transition-all duration-500 shadow-2xl">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="bg-primary rounded-xl p-2.5 shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all duration-500 rotate-0 group-hover:rotate-6">
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
                  "text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative group py-1",
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                {item.name}
                <div className={cn(
                  "absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-500",
                  pathname === item.href ? "opacity-100 scale-x-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-50"
                )} />
              </Link>
            ))}
            {profile?.isAdmin && (
              <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full bg-red-500/5 transition-all shadow-glow">
                MASTER
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar (Hidden in Editor to maximize space) */}
      {!isEditor && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#05070a]/95 backdrop-blur-3xl border-t border-white/5 md:hidden h-24 flex items-center justify-around px-6 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all p-3 rounded-2xl",
                  isActive ? "text-primary scale-110 bg-primary/5" : "text-muted-foreground opacity-60"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                <span className="text-[8px] font-black uppercase tracking-widest">{item.name}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
