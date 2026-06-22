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
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
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
      <main className="max-w-7xl mx-auto p-6 space-y-16">
        
        {/* 🪄 MAGIC BUILD STRIP (EMERGENCY) */}
        <div className="relative group overflow-hidden rounded-[2.5rem]">
           <div className="absolute inset-0 bg-primary animate-pulse opacity-30" />
           <div className="relative bg-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-primary/50 backdrop-blur-3xl">
              <div className="flex items-center gap-6 text-white">
                 <div className="p-4 bg-primary rounded-full animate-bounce shadow-glow shadow-primary">
                    <Wand2 className="w-10 h-10" />
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black font-headline uppercase tracking-tight">MAGIC BUILD ENGINE</h2>
                    <p className="text-sm font-bold opacity-90 italic">Aapka Mobile = Remote Control. Bas command dabayein aur APK payein.</p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-4">
                 <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black rounded-[2rem] h-16 px-12 text-xl shadow-2xl group-hover:scale-105 transition-all" asChild>
                    <Link href="/build-status">APK Status Dekho <ArrowRight className="ml-3 w-6 h-6" /></Link>
                 </Button>
                 <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold rounded-[2rem] h-16 px-8" asChild>
                    <Link href="/terminal-guide">Terminal Guide</Link>
                 </Button>
              </div>
           </div>
        </div>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white">
              Studio <span className="text-primary italic">Live</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-xl italic">Create, Build, Dominate. Everything is automated.</p>
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
                    <h3 className="text-3xl font-bold font-headline text-white">Magic APK Download</h3>
                    <p className="text-muted-foreground font-medium italic">Direct link to your Android app.</p>
                 </div>
              </div>
              <Button className="h-16 w-full rounded-2xl bg-emerald-600 font-bold shadow-xl shadow-emerald-600/20" asChild>
                 <Link href="/build-status">Get My APK Now</Link>
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
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-16 w-full rounded-2xl bg-primary font-bold">
                 {adLoading ? <Loader2 className="animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                 Watch Ad & Earn
              </Button>
           </Card>
        </section>
      </main>
    </div>
  );
}
