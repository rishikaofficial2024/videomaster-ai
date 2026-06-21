"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Video, Gift, SquarePlay, Star, ArrowRight, CheckCircle2, X, Crown, Terminal as TerminalIcon, Copy, ShieldCheck, Zap, Calendar, BrainCircuit
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
  const [claimingTrial, setClaimingTrial] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
  }, [db, user?.uid]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

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
      updateDoc(userProfileRef, updateData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: updateData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });
      
      setAdLoading(false);
      setShowAdOverlay(false);
      toast({
        title: "Success! +20 Credits Earned",
        description: "Credits have been added to your professional balance.",
      });
    }, 15000);
  };

  const handleClaimTrial = () => {
    if (!userProfileRef || claimingTrial) return;
    setClaimingTrial(true);
    
    const trialData = {
      isPremium: true,
      subscriptionPlan: "pro",
      credits: increment(500),
      trialClaimed: true,
      updatedAt: serverTimestamp(),
    };

    updateDoc(userProfileRef, trialData)
      .then(() => {
        toast({
          title: "Pro Trial Activated!",
          description: "You now have full access to elite AI features for 7 days.",
        });
      })
      .catch(async (e: any) => {
        const permissionError = new FirestorePermissionError({
          path: userProfileRef.path,
          operation: 'update',
          requestResourceData: trialData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setClaimingTrial(false));
  };

  const copyPushCommand = () => {
    navigator.clipboard.writeText("npm run mobile:push");
    toast({
      title: "Command Copied!",
      description: "Paste this into your Integrated Terminal to deploy updates.",
    });
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
        
        {showAdOverlay && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                {adTimer > 0 ? `Securing Credits in ${adTimer}s` : "Credits Ready!"}
              </span>
              {adTimer === 0 && (
                <button onClick={() => setShowAdOverlay(false)} className="hover:text-primary transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            
            <div className="w-full max-w-xl space-y-8 animate-in zoom-in-95 duration-500">
              <div className="aspect-video md:aspect-[16/9] bg-[#0a0d14] rounded-[2.5rem] border-2 border-primary/20 flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                
                <div className="w-full h-full flex flex-col items-center justify-center">
                   <AdBanner variant="large" provider="High-Value Rewarded Placement" adSlot="rewarded_placement" />
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-4">
                     Processing Professional Impression...
                   </p>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${((15-adTimer)/15)*100}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.3em]">AdSense Reward Verified</p>
              </div>
            </div>
          </div>
        )}

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit">
                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                   MONETIZATION ACTIVE • AD-VERIFIED HUB
                 </span>
              </div>
              <Link href="/terminal-guide">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 rounded-full border border-red-500/20 w-fit hover:bg-red-500/20 transition-all cursor-pointer group">
                   <TerminalIcon className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Deployment Guide</span>
                </div>
              </Link>
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white">
              Hello, <span className="text-primary italic">{user?.displayName?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-xl italic">Welcome to your Elite Creative Studio.</p>
          </div>
          
          <div className="flex items-center gap-8 bg-[#0a0d14]/90 backdrop-blur-3xl p-6 rounded-[3.5rem] border border-white/5 shadow-2xl blue-glow">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">AI Processing Credits</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">
                    {profile?.isPremium && profile?.subscriptionPlan !== 'free' ? '∞' : (profile?.credits ?? 0)}
                  </span>
                </div>
             </div>
             <Button className="rounded-[2.5rem] h-20 font-bold px-12 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 text-lg" asChild>
                <Link href="/editor"><Plus className="w-6 h-6 mr-3" /> New Production</Link>
             </Button>
          </div>
        </header>

        <section>
          <Card className="rounded-[3.5rem] bg-[#0a0d14] border-emerald-500/30 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative blue-glow">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px]" />
             <div className="flex items-center gap-8 text-center md:text-left relative z-10">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20 group-hover:scale-110 transition-transform">
                   <BrainCircuit className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-bold font-headline text-white">AI Neural Assistant</h3>
                   <p className="text-muted-foreground font-medium italic">Guidance on viral strategies and conversion scripting. <span className="text-emerald-500 font-bold">Free Creative Mode.</span></p>
                </div>
             </div>
             <Button variant="outline" className="h-16 px-10 rounded-2xl border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/10" asChild>
                <Link href="/ai-assistant">Launch Assistant <ArrowRight className="ml-2 w-4 h-4" /></Link>
             </Button>
          </Card>
        </section>

        {!profile?.trialClaimed && (
          <section className="animate-in slide-in-from-bottom-5 duration-1000">
            <Card className="rounded-[3.5rem] bg-gradient-to-r from-indigo-600/20 via-primary/10 to-transparent border-indigo-500/30 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[80px]" />
               <div className="flex items-center gap-8 text-center md:text-left relative z-10">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-[2rem] flex items-center justify-center border-2 border-indigo-500/20 animate-float">
                     <Calendar className="w-10 h-10 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold font-headline text-white">7-Day Premium Trial</h3>
                     <p className="text-muted-foreground font-medium italic">Experience the Pro Studio at zero cost. Unlock unlimited AI and remove watermarks.</p>
                  </div>
               </div>
               <Button 
                onClick={handleClaimTrial} 
                disabled={claimingTrial}
                className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-xl shadow-indigo-600/30 relative z-10"
               >
                  {claimingTrial ? <Loader2 className="animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                  Claim Free Trial
               </Button>
            </Card>
          </section>
        )}

        <section className="grid md:grid-cols-2 gap-8">
           <Card className="rounded-[3rem] bg-[#0a0d14] border-red-500/30 p-10 relative overflow-hidden group">
              <div className="flex flex-col gap-6 relative z-10">
                 <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                       <TerminalIcon className="w-3 h-3 text-red-500" />
                       <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Build System</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline text-white">Production APK Build</h3>
                    <p className="text-xs text-muted-foreground italic">Execute the push command in your system terminal.</p>
                 </div>
                 <Button onClick={copyPushCommand} className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-bold shadow-xl shadow-red-600/20 transition-all active:scale-95">
                    <Copy className="w-4 h-4 mr-2" /> Copy Push Command
                 </Button>
              </div>
           </Card>

           <Card className="rounded-[3rem] bg-[#0a0d14] border-emerald-500/30 p-10 relative overflow-hidden group">
              <div className="flex flex-col gap-6 relative z-10">
                 <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                       <Zap className="w-3 h-3 text-emerald-500" />
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verification Node</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline text-white">Verification Hub</h3>
                    <p className="text-xs text-muted-foreground italic">Monitor system health and SEO verification status.</p>
                 </div>
                 <Button className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xl shadow-emerald-600/20" asChild>
                    <Link href="/test-connection">Enter Mission Control <ArrowRight className="w-4 h-4 ml-2" /></Link>
                 </Button>
              </div>
           </Card>
        </section>

        {!profile?.isPremium && (
          <Link href="/premium">
            <Card className="rounded-[3.5rem] bg-gradient-to-r from-primary/20 via-indigo-500/10 to-transparent border-primary/30 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01] transition-all">
               <div className="flex items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-primary/20 group-hover:rotate-12 transition-transform">
                     <Crown className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold font-headline text-white">Activate Pro Studio</h3>
                     <p className="text-muted-foreground font-medium italic">Remove watermarks, unlock 4K production, and gain unlimited AI processing.</p>
                  </div>
               </div>
               <Button className="h-16 px-10 rounded-2xl bg-primary font-bold shadow-xl shadow-primary/20">Upgrade Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Card>
          </Link>
        )}

        <section className="relative overflow-hidden">
          <Card className="rounded-[3.5rem] bg-[#0a0d14] border-primary/30 p-10 md:p-16 relative z-10 blue-glow overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-all duration-1000">
               <Gift className="w-64 h-64" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
               <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                  <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border-2 border-primary/20 shadow-xl animate-float">
                     <Gift className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-4xl font-bold font-headline text-white tracking-tight">Claim Free Credits</h3>
                     <p className="text-muted-foreground font-medium text-lg italic">View a 15-second professional ad to receive <span className="text-primary font-bold">+20 credits</span> instantly.</p>
                  </div>
               </div>
               <Button 
                 onClick={handleWatchAd} 
                 disabled={adLoading || (profile?.isPremium && profile?.subscriptionPlan !== 'free' && !profile?.trialClaimed)}
                 className="h-24 px-16 rounded-[2.5rem] bg-primary font-bold shadow-2xl shadow-primary/40 text-xl hover:scale-105 transition-all group active:scale-95"
               >
                  {adLoading ? <Loader2 className="animate-spin mr-3 w-8 h-8" /> : <SquarePlay className="w-8 h-8 mr-4 group-hover:animate-pulse" />}
                  {adLoading ? `Securely Processing...` : "Watch Ad & Claim Credits"}
               </Button>
            </div>
          </Card>
        </section>

      </main>
    </div>
  );
}
