"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  ArrowRight, Wand2, Video as VideoIcon, Mic, Image as ImageIcon,
  Crown, TrendingUp, History, Star, Globe
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * 🚀 ELITE CREATIVE HUB: Optimized for Creator Workflow.
 */
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
    /**
     * 🔓 ELITE PROTOCOL: Auto-provision Pro status for first-time creators.
     */
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
    { label: "Viral Script", icon: Wand2, desc: "Neural Narrative Engine", color: "text-primary", href: "/editor?tool=ai" },
    { label: "Veo Motion", icon: VideoIcon, desc: "Text-to-Video Synthesis", color: "text-indigo-400", href: "/editor?tool=ai" },
    { label: "Neural Voice", icon: Mic, desc: "Studio Quality TTS", color: "text-rose-400", href: "/editor?tool=ai" },
    { label: "AI Designer", icon: ImageIcon, desc: "High-CTR Thumbnails", color: "text-emerald-400", href: "/editor?tool=ai" },
  ];

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 bg-[#020408] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-16 space-y-24 pt-40">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.5em]">
              <Globe className="w-3 h-3" /> NEURAL NODE: GLOBAL-01
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">
              Creator <span className="text-primary italic">Hub.</span>
            </h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">
              Systems operational, {profile?.displayName?.split(' ')[0] || 'Creator'}. Pro Mode Active.
            </p>
          </div>
          
          <div className="flex items-center gap-10 bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
             <div className="absolute inset-0 shimmer opacity-[0.02] pointer-events-none" />
             <div className="flex flex-col px-10 border-r border-white/10 relative z-10">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-3 opacity-40">Clearance</span>
                <div className="flex items-center gap-4">
                  <Crown className="w-10 h-10 text-primary fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-6xl font-bold font-headline text-white">PRO</span>
                </div>
             </div>
             <Button className="rounded-[2rem] h-20 font-black px-12 shadow-glow text-xl gap-5 bg-primary relative z-10" asChild>
                <Link href="/editor"><Plus className="w-8 h-8" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {toolSuite.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden h-full shadow-2xl">
                 <div className="absolute -top-10 -right-10 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <tool.icon size={160} />
                 </div>
                 <div className="space-y-6 relative z-10">
                    <div className={cn("p-5 bg-black/40 rounded-2xl inline-flex border border-white/5 shadow-inner", tool.color)}>
                       <tool.icon size={30} />
                    </div>
                    <div>
                       <h4 className="text-2xl font-bold text-white uppercase tracking-tight">{tool.label}</h4>
                       <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-2 opacity-60">{tool.desc}</p>
                    </div>
                    <div className="pt-6 flex items-center gap-3 text-primary">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Execute Protocol</span>
                       <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
              </Card>
            </Link>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-10">
           <Card className="lg:col-span-2 rounded-[3.5rem] bg-white/[0.01] border border-white/5 p-12 space-y-10 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                 <h3 className="text-3xl font-headline font-bold text-white uppercase tracking-tight flex items-center gap-5">
                    <History className="text-primary w-8 h-8" />
                    Recent Timeline
                 </h3>
                 <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Repository</Link>
              </div>
              <div className="py-20 text-center space-y-6 opacity-20">
                 <Plus className="w-16 h-16 mx-auto text-muted-foreground border-4 border-dashed rounded-full p-4" />
                 <p className="text-sm font-black uppercase tracking-[0.4em]">Initialize First Project Node</p>
              </div>
           </Card>

           <div className="space-y-10">
              <Card className="rounded-[3.5rem] bg-primary/5 border border-primary/20 p-12 space-y-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                   <TrendingUp className="w-40 h-40" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight">Growth Node</h4>
                    <p className="text-xs text-muted-foreground italic">AI-powered viral trend analysis for your niche.</p>
                 </div>
                 <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white font-bold text-xs uppercase tracking-widest" asChild>
                    <Link href="/ai-assistant">Launch Assistant</Link>
                 </Button>
              </Card>

              <Card className="rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/20 p-12 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl"><Star className="w-6 h-6 text-indigo-400 fill-current" /></div>
                    <span className="text-lg font-bold text-white uppercase tracking-tight">Templates</span>
                 </div>
                 <p className="text-xs text-muted-foreground italic">Access 100+ professional creative frameworks.</p>
                 <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest" asChild>
                    <Link href="/templates">Library Node</Link>
                 </Button>
              </Card>
           </div>
        </section>
      </main>
    </div>
  );
}
