"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Video, Gift, Play, Star, ArrowRight, CheckCircle2, X, Crown, Terminal as TerminalIcon, Copy, ShieldCheck, Zap, Calendar, BrainCircuit,
  Tornado, Share2, MessageCircle, Instagram, Twitter, Smartphone, AlertTriangle, Download
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

  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
  }, [db, user?.uid]);

  const { data: projects } = useCollection(projectsQuery);

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

  const copyShareLink = () => {
    const shareText = `🚀 Check out VideoMaster AI! I'm using it to make viral reels. Use my link to get 100 FREE credits: https://videomaster-ai.tech`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Viral Message Copied!",
      description: "Share this on WhatsApp or Instagram to invite creators.",
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
        
        {/* 🚨 PULSING TERMINAL LOCATOR STRIP */}
        <div className="relative group overflow-hidden rounded-[2.5rem]">
           <div className="absolute inset-0 bg-red-600 animate-pulse opacity-50" />
           <div className="relative bg-red-600/90 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-red-400/50 backdrop-blur-xl">
              <div className="flex items-center gap-6 text-white">
                 <div className="p-4 bg-white/20 rounded-full animate-bounce">
                    <AlertTriangle className="w-8 h-8" />
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black font-headline uppercase tracking-tight">Terminal Dhoondne Mein Help Chahiye?</h2>
                    <p className="text-sm font-bold opacity-80 italic">Aap 3 din se dhoond rahe hain, isliye maine naya MAP banaya hai.</p>
                 </div>
              </div>
              <Button size="lg" className="bg-white text-red-600 hover:bg-white/90 font-black rounded-[2rem] h-16 px-12 text-xl shadow-2xl group-hover:scale-105 transition-all" asChild>
                 <Link href="/terminal-guide">Dikhaiye Terminal Kahan Hai <ArrowRight className="ml-3 w-6 h-6" /></Link>
              </Button>
           </div>
        </div>

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
                 <Tornado className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                   ANTIGRAVITY MODE ENABLED • VIRAL SYNC ACTIVE
                 </span>
              </div>
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

        {/* 📱 ANDROID BUILD QUICK ACCESS */}
        <section>
          <Card className="rounded-[3.5rem] bg-emerald-500/5 border-emerald-500/20 p-10 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
               <div className="flex items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                     <Smartphone className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold font-headline text-white">Download My APK</h3>
                     <p className="text-muted-foreground font-medium italic">Get your Android App file directly from the Cloud.</p>
                  </div>
               </div>
               <Button className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-3 shadow-2xl shadow-emerald-600/20" asChild>
                  <Link href="/build-status">
                    <Download className="w-5 h-5" /> Download App (Hindi Guide)
                  </Link>
               </Button>
            </div>
          </Card>
        </section>

        {/* 📢 VIRAL EXPANSION HUB */}
        <section>
          <Card className="rounded-[3.5rem] bg-indigo-500/5 border-indigo-500/20 p-10 relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[80px]" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
               <div className="flex items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                     <Share2 className="w-10 h-10 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold font-headline text-white">Viral Expansion Hub</h3>
                     <p className="text-muted-foreground font-medium italic">Share the studio with other creators and grow your network.</p>
                  </div>
               </div>
               <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl border-indigo-500/30 text-indigo-400 font-bold hover:bg-indigo-500/10" onClick={copyShareLink}>
                     <Copy className="w-4 h-4 mr-2" /> Copy Invite Link
                  </Button>
                  <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 shadow-xl shadow-emerald-600/20" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out VideoMaster AI! I'm using it to make viral reels for FREE: https://videomaster-ai.tech")}`)}>
                     <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                  </Button>
               </div>
            </div>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
           <Card className="rounded-[3.5rem] bg-[#0a0d14] border-emerald-500/30 p-10 flex flex-col items-center justify-between gap-8 group overflow-hidden relative blue-glow">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px]" />
              <div className="flex items-center gap-8 text-center md:text-left relative z-10 w-full">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-10 h-10 text-emerald-400" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-headline text-white">Neural Assistant</h3>
                    <p className="text-muted-foreground font-medium italic">Get <span className="text-emerald-500 font-bold">Growth Tips.</span></p>
                 </div>
              </div>
              <Button variant="outline" className="h-16 w-full rounded-2xl border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/10" asChild>
                 <Link href="/ai-assistant">Launch Assistant <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
           </Card>

           <Card className="rounded-[3.5rem] bg-primary/5 border-primary/20 p-10 flex flex-col items-center justify-between gap-8 group overflow-hidden relative">
              <div className="flex items-center gap-8 text-center md:text-left relative z-10 w-full">
                 <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-primary/20">
                    <Gift className="w-10 h-10 text-primary" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-headline text-white">Daily Rewards</h3>
                    <p className="text-muted-foreground font-medium italic">Watch ads to keep everything <span className="text-primary font-bold">FREE.</span></p>
                 </div>
              </div>
              <Button 
                onClick={handleWatchAd} 
                disabled={adLoading}
                className="h-16 w-full rounded-2xl bg-primary font-bold shadow-xl shadow-primary/20 hover:scale-[1.02]"
              >
                 {adLoading ? <Loader2 className="animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                 Claim +20 Credits
              </Button>
           </Card>
        </section>

        {/* 📽️ RECENT PROJECTS GRID */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-headline font-bold text-white">Mission <span className="text-primary">Logs</span></h2>
              <Button variant="link" className="text-primary font-bold" asChild>
                 <Link href="/projects">View All Productions <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects?.map((p: any) => (
                <Card key={p.id} className="rounded-[2.5rem] bg-[#0a0d14] border-white/5 overflow-hidden group hover:border-primary/30 transition-all">
                   <div className="aspect-video relative">
                      <Image 
                        src={p.thumbnailUrl || `https://picsum.photos/seed/${p.id}/600/400`} 
                        alt={p.title} 
                        fill 
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      />
                      <Link href={`/editor?id=${p.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                         <div className="bg-primary p-4 rounded-full shadow-2xl">
                            <Plus className="w-6 h-6 text-white" />
                         </div>
                      </Link>
                   </div>
                   <div className="p-6">
                      <h4 className="font-bold text-white truncate">{p.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Status: {p.status || 'Draft'}</p>
                   </div>
                </Card>
              ))}
              <Link href="/editor" className="aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                 <div className="p-4 bg-white/5 rounded-full group-hover:bg-primary/20 transition-all">
                    <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                 </div>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">New Production</span>
              </Link>
           </div>
        </section>

      </main>
    </div>
  );
}
