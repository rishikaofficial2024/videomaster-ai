"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, Zap, ArrowRight, Wand2, Video as VideoIcon, Mic, Image as ImageIcon,
  Cpu, TrendingUp, Rocket, Crown
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  // Auto-upgrade to Pro if not already
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
    { label: "Gemini Script", icon: Wand2, desc: "Viral Narrative Engine", color: "text-primary", href: "/editor?tool=ai" },
    { label: "Gemini Video", icon: VideoIcon, desc: "Text-to-Video synthesis", color: "text-indigo-400", href: "/editor?tool=ai" },
    { label: "Gemini Voice", icon: Mic, desc: "High-Fidelity studio TTS", color: "text-rose-400", href: "/editor?tool=audio" },
    { label: "AI Designer", icon: ImageIcon, desc: "4K High-CTR Thumbnails", color: "text-emerald-400", href: "/editor?tool=ai" },
  ];

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 bg-[#020408] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-20 pt-32">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-white leading-none uppercase">
              Free <span className="text-primary italic">Studio.</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium italic opacity-60">
              Welcome back, {profile?.displayName || 'Creator'}. Enjoy Unlimited Pro Access.
            </p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-50">Status</span>
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">PRO</span>
                </div>
             </div>
             <Button className="rounded-2xl h-16 font-black px-10 shadow-glow text-lg gap-4 bg-primary" asChild>
                <Link href="/editor"><Plus className="w-6 h-6" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {toolSuite.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="group p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden h-full shadow-xl">
                 <div className="space-y-4 relative z-10">
                    <div className={cn("p-4 bg-black/40 rounded-2xl inline-flex border border-white/5", tool.color)}>
                       <tool.icon size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white uppercase tracking-tight">{tool.label}</h4>
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{tool.desc}</p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-primary">
                       <span className="text-[10px] font-black uppercase tracking-widest">Execute AI Tool</span>
                       <ArrowRight size={14} />
                    </div>
                 </div>
              </Card>
            </Link>
          ))}
        </section>

        <section>
           <Card className="rounded-[4rem] bg-primary/[0.02] border-primary/10 p-12 flex flex-col lg:flex-row items-center justify-between gap-12 group overflow-hidden relative shadow-2xl">
              <div className="flex items-center gap-10 relative z-10">
                 <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border border-primary/30 shadow-xl">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">100% Free Forever</h3>
                    <p className="text-muted-foreground text-lg font-medium italic opacity-60">Enjoy unlimited access to all professional Gemini AI tools without any cost.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 px-8 py-6 rounded-[2rem] border border-white/10">
                <Coins className="w-6 h-6 text-primary" />
                <span className="text-2xl font-black font-headline text-white">UNLIMITED</span>
              </div>
           </Card>
        </section>
      </main>
    </div>
  );
}
