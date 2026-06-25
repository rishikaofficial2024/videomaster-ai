
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Banknote, ShieldCheck, 
  Settings, Layers, Database, Activity, 
  BarChart3, Globe, Lock, ArrowLeft, Zap, Shield, Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const OWNER_EMAIL = "rinkukumarpaswan1796@gmail.com";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Creator Nodes", href: "/admin/users", icon: Users },
  { name: "Revenue Hub", href: "/admin/revenue", icon: Banknote },
  { name: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
  { name: "App Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();
  const isMaster = user?.email === OWNER_EMAIL;

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);
  const { data: profile } = useDoc(profileRef);

  return (
    <aside className="w-80 h-screen sticky top-0 bg-[#0a061c]/60 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 z-50">
      <div className="mb-12 flex flex-col gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.4em] group">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/50 transition-all border border-transparent shadow-xl">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Exit Master Hub
        </Link>
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-headline text-white tracking-tighter uppercase">
            {isMaster ? "Executive" : profile?.role === 'moderator' ? 'Moderator' : 'Admin'} <span className="text-primary italic">Node.</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              {isMaster ? "MASTER KEY ACTIVE" : "Authorized Personnel"}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-5 p-5 rounded-[1.8rem] transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-black shadow-glow font-black" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-black" : "group-hover:text-primary transition-colors")} />
              <span className="text-xs uppercase tracking-widest">{item.name}</span>
              {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-black rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {isMaster && (
        <div className="mt-6 mb-6 p-6 bg-primary/10 rounded-[2.5rem] border border-primary/20 shadow-2xl">
           <div className="flex items-center gap-4 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Master Control</span>
           </div>
           <p className="text-[10px] text-muted-foreground italic leading-relaxed">Full system governance protocol active for rinkukumarpaswan1796@gmail.com</p>
        </div>
      )}

      <div className="mt-auto space-y-6 pt-10 border-t border-white/5">
        <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Clearance</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{profile?.role?.toUpperCase() || 'VERIFIED'}</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[98%] shadow-glow" />
          </div>
        </div>
        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.5em] text-center opacity-20">BUILD_NODE_v4.5.2_ELITE_OWNER</p>
      </div>
    </aside>
  );
}
