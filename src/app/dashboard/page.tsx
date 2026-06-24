"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, Zap, ArrowRight, Wand2, Video as VideoIcon, Mic, Image as ImageIcon,
  Cpu, TrendingUp, ShieldCheck, Rocket
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
  const [adLoading, setAdLoading] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adTimer, setAdTimer] = useState(15);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  const handleWatchAd = () => {
    if (!userProfileRef || adLoading) return;
    setAdLoading(true);
    setShowAdOverlay(true);
    setAdTimer(15);
    
    // Defer timer side effect to post-hydration
    const interval = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimeout(() => {
      const updateData = { credits: increment(20), updatedAt: new Date().toISOString() };
      updateDoc(userProfileRef, updateData)
        .catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: updateData,
          } satisfies SecurityRuleContext));
        });

      setAdLoading(false);
      setShowAdOverlay(false);
      toast({ 
        title: "Credits Replenished", 
        description: "+20 AI Credits added to your account." 
      });
    }, 15000);
  };

  const toolSuite = [
    { label: "Gemini Script", icon: Wand2, desc: "Viral Narrative Engine", color: "text-primary", href: "/editor?tool=ai" },
    { label: "Gemini Video", icon: VideoIcon, desc: "Text-to-Video synthesis", color: "text-indigo-400", href: "/editor?tool=ai" },
    { label: "Gemini Voice", icon: Mic, desc: "High-Fidelity studio TTS", color: "text-rose-400", href: "/editor?tool=audio" },
    { label: "AI Designer", icon: ImageIcon, desc: "4K High-CTR Thumbnails", color: "text-emerald-400", href: "/editor?tool=ai" },
  ];

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <div className="text-center space-y-8">
           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Synchronizing Gemini Fast AI...</p>
        </div>
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
              Gemini <span className="text-primary italic">Studio.</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium italic opacity-60">
              Welcome, {profile?.displayName || 'Creator'}. Launch a tool to begin viral expansion.
            </p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative group">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-50">Fuel Level</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">{profile?.credits?.toFixed(0) ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-2xl h-16 font-black px-10 shadow-glow text-lg gap-4 bg-primary group-hover:scale-105 transition-all" asChild>
                <Link href="/editor"><Plus className="w-6 h-6" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        <section className="space-y-10">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                 <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Gemini Fast AI Suite</h3>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {toolSuite.map((tool, i) => (
                <Link key={i} href={tool.href}>
                  <Card className="group p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden h-full shadow-xl">
                     <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-all duration-700">
                        <tool.icon size={100} />
                     </div>
                     <div className="space-y-4 relative z-10">
                        <div className={cn("p-4 bg-black/40 rounded-2xl inline-flex border border-white/5", tool.color)}>
                           <tool.icon size={24} />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white uppercase tracking-tight">{tool.label}</h4>
                           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{tool.desc}</p>
                        </div>
                        <div className="pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                           <span className="text-[10px] font-black uppercase tracking-widest">Execute AI Tool</span>
                           <ArrowRight size={14} />
                        </div>
                     </div>
                  </Card>
                </Link>
              ))}
           </div>
        </section>

        <section>
           <Card className="rounded-[4rem] bg-primary/[0.02] border-primary/10 p-12 flex flex-col lg:flex-row items-center justify-between gap-12 group overflow-hidden relative hover:bg-primary/[0.04] transition-all duration-1000 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-all">
                 <TrendingUp className="w-64 h-64 text-primary" />
              </div>
              <div className="flex items-center gap-10 relative z-10">
                 <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border border-primary/30 shadow-xl">
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Earn Credits</h3>
                    <p className="text-muted-foreground text-lg font-medium italic opacity-60">Watch a quick ad to replenish 20 AI credits instantly for free.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-20 px-12 rounded-[2rem] bg-primary font-black text-xl uppercase tracking-widest shadow-xl relative z-10">
                 {adLoading ? <Loader2 className="animate-spin mr-4 w-8 h-8" /> : <Play className="w-6 h-6 mr-4 fill-current" />}
                 WATCH & EARN
              </Button>
           </Card>
        </section>

      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-[120px] flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center space-y-16 max-w-2xl">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/40 blur-[180px] rounded-full neural-pulse" />
                 <div className="relative z-10">
                    <span className="text-[10rem] font-black text-white font-headline tracking-tighter leading-none">{adTimer}</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase">VERIFYING ATTENTION</h2>
                 <p className="text-xl text-muted-foreground italic font-medium opacity-60">Replenishing Gemini Fast AI Credits...</p>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
