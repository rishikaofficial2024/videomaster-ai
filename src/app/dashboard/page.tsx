"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Video, Gift, Play, Star, ArrowRight, CheckCircle2, X, Crown, Terminal as TerminalIcon, Copy, ShieldCheck, Zap, Calendar, BrainCircuit,
  Tornado, Share2, MessageCircle, Instagram, Twitter, Smartphone, AlertTriangle, Download, FileText, Wand2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AdBanner } from "@/components/ads/ad-banner";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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
      const updateData = { credits: increment(20) };
      updateDoc(userProfileRef, updateData).catch(async (e) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: updateData,
          }));
        });
      setAdLoading(false);
      setShowAdOverlay(false);
      toast({ title: "Success! +20 Credits Earned" });
    }, 15000);
  };

  const copyCommand = () => {
    navigator.clipboard.writeText("npm run mobile:push");
    toast({ title: "Command Copied!", description: "Now paste it in the Terminal." });
  };

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05070a]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        
        {/* 🪄 MAGIC BUILD ENGINE (ULTIMATE UI) */}
        <div className="relative group overflow-hidden rounded-[3.5rem] shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-purple-500/40 to-primary/40 animate-pulse" />
           <div className="relative bg-[#0a0d14]/90 p-10 flex flex-col lg:flex-row items-center justify-between gap-10 border-2 border-primary/50 backdrop-blur-3xl">
              <div className="flex items-center gap-8 text-white">
                 <div className="p-6 bg-primary rounded-full animate-float shadow-[0_0_60px_rgba(59,130,246,1)]">
                    <Wand2 className="w-14 h-14" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-4xl font-black font-headline uppercase tracking-tighter leading-none">MAGIC APK ENGINE</h2>
                    <p className="text-lg font-bold text-primary-foreground/80 italic">Mobile = Remote Control. APK builds in the Cloud.</p>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                 <div className="bg-black/60 rounded-[2.5rem] p-5 border border-white/10 flex items-center justify-between gap-8 px-10">
                    <code className="text-primary font-bold text-xl">npm run mobile:push</code>
                    <Button variant="ghost" size="icon" onClick={copyCommand} className="hover:bg-primary/20 text-primary transition-all">
                       <Copy className="w-7 h-7" />
                    </Button>
                 </div>
                 <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black rounded-[2.5rem] h-20 px-14 text-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-all" asChild>
                    <Link href="/terminal-guide">FIND TERMINAL NOW <ArrowRight className="ml-3 w-8 h-8" /></Link>
                 </Button>
              </div>
           </div>
        </div>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white">
              Studio <span className="text-primary italic">Live</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-xl italic">Create, Build, Dominate. Everything is automated for you.</p>
          </div>
          
          <div className="flex items-center gap-8 bg-[#0a0d14]/90 backdrop-blur-3xl p-6 rounded-[3.5rem] border border-white/5 shadow-2xl blue-glow">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">AI Credits</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">{profile?.credits ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-[2.5rem] h-20 font-bold px-12 shadow-2xl shadow-primary/40 text-lg" asChild>
                <Link href="/editor"><Plus className="w-6 h-6 mr-3" /> New Project</Link>
             </Button>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
           <Card className="rounded-[3.5rem] bg-[#0a0d14] border-emerald-500/30 p-10 flex flex-col items-center justify-between gap-8 group overflow-hidden relative blue-glow">
              <div className="flex items-center gap-8 text-center md:text-left relative z-10 w-full">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20">
                    <Smartphone className="w-10 h-10 text-emerald-400" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-headline text-white">Download APK</h3>
                    <p className="text-muted-foreground font-medium italic">Your build status and direct link.</p>
                 </div>
              </div>
              <Button className="h-16 w-full rounded-2xl bg-emerald-600 font-bold shadow-xl shadow-emerald-600/20 text-lg" asChild>
                 <Link href="/build-status">APK STATUS DEKHO</Link>
              </Button>
           </Card>

           <Card className="rounded-[3.5rem] bg-primary/5 border-primary/20 p-10 flex flex-col items-center justify-between gap-8 group overflow-hidden relative">
              <div className="flex items-center gap-8 text-center md:text-left relative z-10 w-full">
                 <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-primary/20">
                    <Zap className="w-10 h-10 text-primary" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-headline text-white">Earn Free AI</h3>
                    <p className="text-muted-foreground font-medium italic">Watch ads for +20 Credits.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-16 w-full rounded-2xl bg-primary font-bold text-lg">
                 {adLoading ? <Loader2 className="animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                 Watch Ad & Earn
              </Button>
           </Card>
        </section>

        <section className="pt-10">
           <AdBanner provider="Elite Network Hub" />
        </section>
      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-500">
           <div className="text-center space-y-10 px-10">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full" />
                 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-4 border-primary relative z-10">
                    <span className="text-4xl font-black text-white">{adTimer}</span>
                 </div>
              </div>
              <div className="space-y-4">
                 <h2 className="text-3xl font-headline font-bold text-white tracking-tight uppercase">High-Value Reward Ad</h2>
                 <p className="text-muted-foreground italic font-medium">Do not close. Neural Credits syncing in {adTimer}s...</p>
                 <div className="w-64 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
