"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  ArrowRight, Wand2, Video as VideoIcon, Mic, Image as ImageIcon,
  Crown, TrendingUp, History, Star, Globe, Zap, LayoutTemplate,
  Activity, Search, User
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (mounted && userProfileRef && profile && (!profile.isPremium || profile.credits < 10000)) {
      updateDoc(userProfileRef, {
        isPremium: true,
        subscriptionPlan: "pro",
        credits: 999999,
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }
  }, [mounted, profile, userProfileRef]);

  const toolSuite = [
    { label: "Viral Script", icon: Wand2, desc: "AI Narrative Node", color: "text-primary", bg: "bg-primary/15", href: "/editor?tool=ai" },
    { label: "Veo Motion", icon: VideoIcon, desc: "Text-to-Video", color: "text-white", bg: "bg-white/5", href: "/editor?tool=ai" },
    { label: "Neural Voice", icon: Mic, desc: "Studio Voiceover", color: "text-primary", bg: "bg-primary/15", href: "/editor?tool=ai" },
    { label: "Elite Thumbnail", icon: ImageIcon, desc: "High-CTR Visuals", color: "text-white", bg: "bg-white/5", href: "/editor?tool=ai" },
  ];

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 bg-[#0f0f0f]">
      <Navbar />
      
      <main className="max-w-[95rem] mx-auto p-6 lg:p-12 space-y-16 pt-32 lg:pt-40">
        {/* HEADER AREA */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel text-primary text-[10px] font-black uppercase tracking-[0.4em] border-primary/30 shadow-glow">
                <Globe className="w-3.5 h-3.5" /> ELITE NODE: GOLD-RESERVE-01
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                <User className="w-3.5 h-3.5 text-primary" /> Created by Rinku Ganjawala
              </div>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-headline font-black tracking-tighter text-white leading-none uppercase">
              Creator <span className="text-gradient italic">Hub.</span>
            </h1>
            <p className="text-muted-foreground text-2xl md:text-3xl font-medium italic opacity-60">
              Welcome to the Gold Standard, {profile?.displayName?.split(' ')[0] || 'Creator'}.
            </p>
          </div>
          
          <div className="flex items-center gap-8 glass-panel p-8 md:p-12 rounded-[4rem] border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-white/5" />
             <div className="flex flex-col px-8 border-r border-white/20 relative z-10">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-3 opacity-40">Clearance</span>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Crown className="w-10 h-10 text-primary fill-current group-hover:scale-125 transition-all duration-500" />
                    <div className="absolute inset-0 blur-2xl bg-primary/50 rounded-full" />
                  </div>
                  <span className="text-6xl font-bold font-headline text-white tracking-tighter uppercase">ELITE</span>
                </div>
             </div>
             <Button className="rounded-full h-24 font-black px-12 shadow-glow text-2xl gap-5 bg-white text-black hover:bg-primary transition-all relative z-10 active:scale-95" asChild>
                <Link href="/editor"><Plus className="w-10 h-10" /> New Masterpiece</Link>
             </Button>
          </div>
        </header>

        {/* QUICK STATS / SEARCH */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search the repository..." 
                className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-full px-20 text-xl text-white focus:border-primary/50 transition-all outline-none placeholder:opacity-30 font-medium shadow-inner"
              />
           </div>
           <div className="flex gap-4 scrollbar-hide overflow-x-auto w-full lg:w-auto">
              {[
                { label: "Active Nodes", val: "24", icon: Activity },
                { label: "Power Level", val: "100%", icon: TrendingUp },
                { label: "Cloud Sync", val: "Verified", icon: Globe }
              ].map((stat, i) => (
                <div key={i} className="glass-panel px-10 py-5 rounded-full border-white/10 flex items-center gap-5 whitespace-nowrap shadow-xl">
                   <stat.icon className="w-5 h-5 text-primary opacity-50" />
                   <div className="flex flex-col">
                      <span className="text-xl font-bold text-white tracking-tighter">{stat.val}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* TOOL GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {toolSuite.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="premium-card p-10 group relative overflow-hidden h-full flex flex-col justify-between border-white/10 bg-white/[0.01]">
                 <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-15 group-hover:scale-150 transition-all duration-1000">
                    <tool.icon size={200} className="text-primary" />
                 </div>
                 <div className="space-y-8 relative z-10">
                    <div className={cn("p-6 rounded-[2.2rem] inline-flex shadow-inner border border-white/10 transition-all group-hover:rotate-12", tool.bg, tool.color)}>
                       <tool.icon size={36} />
                    </div>
                    <div>
                       <h4 className="text-3xl font-bold text-white uppercase tracking-tight leading-none mb-3">{tool.label}</h4>
                       <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-50">{tool.desc}</p>
                    </div>
                 </div>
                 <div className="pt-10 flex items-center justify-between relative LUXURY_ANIMATION">
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden mr-6">
                       <div className={cn("h-full w-0 group-hover:w-full transition-all duration-1000 bg-primary shadow-glow")} />
                    </div>
                    <ArrowRight size={24} className="text-primary group-hover:translate-x-3 transition-transform duration-500" />
                 </div>
              </Card>
            </Link>
          ))}
        </section>

        {/* RECENT PROJECTS & GROWTH */}
        <section className="grid lg:grid-cols-3 gap-12">
           <Card className="lg:col-span-2 premium-card p-12 space-y-12 relative overflow-hidden border-white/10 bg-white/[0.01]">
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12">
                 <History className="w-64 h-64 text-primary" />
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30 shadow-glow">
                       <History className="text-primary w-8 h-8" />
                    </div>
                    <h3 className="text-4xl font-headline font-black text-white uppercase tracking-tight">Project Archive</h3>
                 </div>
                 <Link href="/projects" className="px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">View Repository</Link>
              </div>
              
              <div className="py-24 text-center space-y-8 relative z-10 opacity-30">
                 <div className="w-24 h-24 mx-auto border-4 border-dashed border-muted-foreground rounded-full flex items-center justify-center p-6 mb-4">
                    <Plus className="w-full h-full text-muted-foreground" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-bold uppercase tracking-tight">Node Empty</h4>
                    <p className="text-sm font-medium italic">Your creative assets will be archived here.</p>
                 </div>
              </div>
           </Card>

           <div className="space-y-12">
              <Card className="glass-panel p-12 rounded-[4rem] border-white/10 space-y-10 relative overflow-hidden group hover:border-primary/40 transition-all bg-white/[0.01]">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000">
                   <TrendingUp className="w-60 h-60 text-primary" />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4 text-primary">
                       <TrendingUp size={28} />
                       <h4 className="text-3xl font-black font-headline uppercase tracking-tight">Growth Node</h4>
                    </div>
                    <p className="text-lg text-muted-foreground italic leading-relaxed opacity-70">AI-powered trend analysis for high-value engagement.</p>
                 </div>
                 <Button className="w-full h-20 rounded-full bg-white text-black hover:bg-primary transition-all font-black text-xs uppercase tracking-widest shadow-2xl relative z-10 active:scale-95" asChild>
                    <Link href="/ai-assistant">Launch Protocol</Link>
                 </Button>
              </Card>

              <Card className="glass-panel p-12 rounded-[4rem] border-white/10 space-y-8 relative overflow-hidden group hover:border-white/30 transition-all bg-white/[0.01]">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-white/10 rounded-2xl shadow-inner border border-white/10">
                       <LayoutTemplate className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Templates</h4>
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Luxury Presets</span>
                    </div>
                 </div>
                 <p className="text-base text-muted-foreground italic leading-relaxed opacity-70">Access professional frameworks for global dominance.</p>
                 <Button className="w-full h-16 rounded-full bg-black/50 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white/10" asChild>
                    <Link href="/templates">Enter Library</Link>
                 </Button>
              </Card>
           </div>
        </section>
      </main>
    </div>
  );
}
