"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Video, Gift, Play, Star, ArrowRight, CheckCircle2, X, Crown, Terminal as TerminalIcon, Copy, ShieldCheck, Zap, Calendar, BrainCircuit,
  Tornado, Share2, MessageCircle, Instagram, Twitter, Smartphone, AlertTriangle, Download, FileText, Wand2, History, LayoutTemplate, Activity
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, updateDoc, increment, serverTimestamp, collection, query, limit, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AdBanner } from "@/components/ads/ad-banner";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
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
      orderBy("updatedAt", "desc"),
      limit(4)
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

  const handleShare = () => {
    const text = "🚀 Join VideoMaster AI! Generate viral reels & scripts instantly. Use my link to get 100 FREE credits: https://videomaster-ai.tech";
    navigator.clipboard.writeText(text);
    toast({ title: "Viral Message Copied!", description: "Share it on WhatsApp or Instagram now!" });
  };

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05070a]">
        <div className="text-center space-y-4">
           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Syncing Neural Node</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        
        {/* 🪄 MAGIC BUILD ENGINE (ELITE V3) */}
        <div className="relative group overflow-hidden rounded-[4rem] shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-indigo-600/30 to-primary/30 animate-pulse" />
           <div className="relative bg-[#0a0d14]/95 p-10 flex flex-col lg:flex-row items-center justify-between gap-10 border-2 border-primary/40 backdrop-blur-3xl">
              <div className="flex items-center gap-10 text-white">
                 <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="p-8 bg-primary rounded-full animate-float shadow-[0_0_80px_rgba(59,130,246,0.8)] relative z-10">
                       <Wand2 className="w-16 h-14" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                       <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Elite Status: Optimized
                    </div>
                    <h2 className="text-5xl font-black font-headline uppercase tracking-tighter leading-none">MAGIC APK ENGINE</h2>
                    <p className="text-xl font-bold text-muted-foreground italic">Mobile = Remote Control. APK builds in the Cloud.</p>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                 <div className="bg-black/60 rounded-[2.5rem] p-6 border border-white/10 flex items-center justify-between gap-10 px-12 group hover:border-primary/50 transition-all cursor-pointer" onClick={copyCommand}>
                    <code className="text-primary font-bold text-2xl tracking-tight">npm run mobile:push</code>
                    <Copy className="w-8 h-8 text-primary/40 group-hover:text-primary transition-all" />
                 </div>
                 <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black rounded-[2.5rem] h-24 px-16 text-2xl shadow-[0_0_60px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-all" asChild>
                    <Link href="/terminal-guide">FIND TERMINAL NOW <ArrowRight className="ml-4 w-8 h-8" /></Link>
                 </Button>
              </div>
           </div>
        </div>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 pt-8">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none">
              Studio <span className="text-primary italic">Live</span>
            </h1>
            <p className="text-muted-foreground text-2xl font-medium max-w-xl italic leading-relaxed">
              Create viral assets, earn free credits, and build your app in 1-click. 
            </p>
          </div>
          
          <div className="flex items-center gap-10 bg-[#0a0d14]/80 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/5 shadow-2xl blue-glow">
             <div className="flex flex-col px-10 border-r border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Available Credits</span>
                <div className="flex items-center gap-4">
                  <Coins className="w-8 h-8 text-primary" />
                  <span className="text-6xl font-bold font-headline text-white">{profile?.credits ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-[3rem] h-24 font-black px-14 shadow-[0_30px_70px_rgba(59,130,246,0.5)] text-xl gap-4 hover:scale-105 transition-all" asChild>
                <Link href="/editor"><Plus className="w-8 h-8" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        {/* 🎬 RECENT PROJECTS FEED */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-2xl">
                    <History className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Recent Projects</h3>
              </div>
              <Link href="/projects" className="text-sm font-bold text-primary hover:underline uppercase tracking-widest">View All Projects</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {projectsLoading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-[2.5rem]" />)
              ) : projects && projects.length > 0 ? (
                projects.map((p: any) => (
                  <Card key={p.id} className="group overflow-hidden rounded-[2.5rem] border-white/5 bg-[#0a0d14]/60 backdrop-blur-xl hover:border-primary/40 transition-all cursor-pointer shadow-lg" onClick={() => router.push(`/editor?id=${p.id}`)}>
                     <div className="aspect-video relative overflow-hidden">
                        <img 
                           src={p.thumbnailUrl || `https://picsum.photos/seed/${p.id}/600/400`} 
                           alt={p.title} 
                           className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                           <h4 className="text-white font-bold truncate text-lg uppercase tracking-tight">{p.title || 'Untitled Masterpiece'}</h4>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Edited {new Date(p.updatedAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-sm">
                           <Play className="w-12 h-12 text-white fill-current" />
                        </div>
                     </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5 text-center space-y-6">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                      <LayoutTemplate className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">No Projects Found</h4>
                      <p className="text-muted-foreground italic">Start your first AI production to see it here.</p>
                   </div>
                   <Button variant="outline" className="rounded-2xl border-white/10" asChild>
                      <Link href="/editor">Launch Studio Editor</Link>
                   </Button>
                </div>
              )}
           </div>
        </section>

        <section className="grid md:grid-cols-2 gap-10">
           <Card className="rounded-[4rem] bg-[#0a0d14] border-emerald-500/30 p-12 flex flex-col items-center justify-between gap-10 group overflow-hidden relative blue-glow hover:bg-emerald-500/[0.02] transition-all">
              <div className="flex items-center gap-10 text-center md:text-left relative z-10 w-full">
                 <div className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center border-2 border-emerald-500/20 shadow-2xl">
                    <Smartphone className="w-12 h-12 text-emerald-400" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Android Center</h3>
                    <p className="text-muted-foreground text-lg font-medium italic">Check build status and get your direct APK link.</p>
                 </div>
              </div>
              <Button className="h-20 w-full rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 font-black shadow-2xl shadow-emerald-600/30 text-xl uppercase tracking-widest" asChild>
                 <Link href="/build-status">APK STATUS DEKHO</Link>
              </Button>
           </Card>

           <Card className="rounded-[4rem] bg-primary/5 border-primary/30 p-12 flex flex-col items-center justify-between gap-10 group overflow-hidden relative hover:bg-primary/[0.08] transition-all">
              <div className="flex items-center gap-10 text-center md:text-left relative z-10 w-full">
                 <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border-2 border-primary/20 shadow-2xl">
                    <Zap className="w-12 h-12 text-primary" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Earn Free AI</h3>
                    <p className="text-muted-foreground text-lg font-medium italic">Watch high-value ads to fuel your studio core.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-20 w-full rounded-[2rem] bg-primary font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/30">
                 {adLoading ? <Loader2 className="animate-spin mr-3 w-6 h-6" /> : <Play className="w-6 h-6 mr-3 fill-current" />}
                 WATCH AD & EARN +20
              </Button>
           </Card>
        </section>

        {/* 🚀 EXPANSION HUB */}
        <section className="bg-indigo-600/10 border-2 border-indigo-600/20 rounded-[4rem] p-16 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Share2 className="w-64 h-64 text-indigo-400" />
           </div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-6 text-center lg:text-left">
                 <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-indigo-600/20 rounded-full border border-indigo-600/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    <Tornado className="w-4 h-4 animate-spin" /> Viral expansion active
                 </div>
                 <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white">Viral Growth <span className="text-indigo-400 italic">Hub</span></h2>
                 <p className="text-xl text-muted-foreground max-w-2xl italic leading-relaxed font-medium">
                    The more people use VideoMaster AI, the stronger the neural network becomes. Share your unique link and grow the community.
                 </p>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                 <Button onClick={handleShare} className="h-24 px-16 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 font-black text-2xl gap-6 shadow-2xl shadow-indigo-600/40">
                    <Share2 className="w-8 h-8" /> COPY VIRAL LINK
                 </Button>
                 <div className="flex justify-center gap-8 opacity-40">
                    <Instagram className="w-8 h-8" />
                    <MessageCircle className="w-8 h-8" />
                    <Twitter className="w-8 h-8" />
                 </div>
              </div>
           </div>
        </section>

        <section className="pt-12">
           <AdBanner provider="Elite Network Hub" variant="large" />
        </section>
      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-500">
           <div className="text-center space-y-12 px-10 max-w-2xl">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/40 blur-[150px] rounded-full neural-pulse" />
                 <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto border-4 border-primary relative z-10 shadow-2xl">
                    <span className="text-6xl font-black text-white font-headline">{adTimer}</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-5xl font-headline font-bold text-white tracking-tighter uppercase leading-none">NEURAL SYNC IN PROGRESS</h2>
                 <p className="text-2xl text-muted-foreground italic font-medium max-w-md mx-auto">Do not close this node. Your high-value credits are being encoded.</p>
                 <div className="w-80 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,1)]" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
