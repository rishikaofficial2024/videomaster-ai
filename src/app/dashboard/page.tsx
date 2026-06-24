
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, Zap, ArrowRight, Wand2, Video as VideoIcon, Mic, Image as ImageIcon,
  Cpu, TrendingUp, Rocket
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAdOverlay && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (adTimer === 0 && showAdOverlay) {
      completeAdReward();
    }
    return () => clearInterval(interval);
  }, [showAdOverlay, adTimer]);

  const completeAdReward = () => {
    if (!userProfileRef) return;
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
      description: "+20 Gemini AI Credits added." 
    });
  };

  const handleWatchAd = () => {
    if (!userProfileRef || adLoading) return;
    setAdLoading(true);
    setShowAdOverlay(true);
    setAdTimer(15);
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
              Gemini <span className="text-primary italic">Studio.</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium italic opacity-60">
              Welcome back, {profile?.displayName || 'Creator'}.
            </p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-50">Fuel Level</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">{profile?.credits?.toFixed(0) ?? 0}</span>
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
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Earn Free Credits</h3>
                    <p className="text-muted-foreground text-lg font-medium italic opacity-60">Watch a quick ad to replenish 20 credits instantly.</p>
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
                 <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase">REPLENISHING CREDITS</h2>
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
