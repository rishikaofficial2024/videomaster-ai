"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, History, LayoutTemplate, Zap,
  Tornado, Share2, Instagram, MessageCircle, Twitter, ArrowRight,
  Globe, Smartphone, Terminal, ExternalLink, AlertCircle, CloudUpload
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, updateDoc, increment, collection, query, limit, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
      // Initiate background write for credits
      updateDoc(userProfileRef, updateData)
        .catch(async (err) => {
          // Centrally handle the permission error if it occurs
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
        description: "+20 AI Credits added to your creative node." 
      });
    }, 15000);
  };

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <div className="text-center space-y-8">
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto relative z-10" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Initializing Creative Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 md:pt-24 bg-[#020408] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-16">
        
        {/* ⚠️ CRITICAL DEPLOY ALERT */}
        <section className="animate-in fade-in slide-in-from-top-2 duration-700">
           <Card className="p-6 bg-amber-500/10 border-amber-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-amber-500/20 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Fix "Site Not Found" Error</h4>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">If your live link isn't opening, you must run <b>npm run web:deploy</b> in the Terminal.</p>
                 </div>
              </div>
              <Button className="h-14 px-10 rounded-2xl bg-amber-600 hover:bg-amber-700 font-black text-xs gap-3" onClick={() => router.push('/terminal-guide')}>
                 <Terminal className="w-4 h-4" /> VIEW DEPLOY STEPS
              </Button>
           </Card>
        </section>

        {/* 🚀 LAUNCH HUB */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="p-8 bg-emerald-500/10 border-emerald-500/20 rounded-[3rem] space-y-4 group hover:bg-emerald-500/20 transition-all cursor-pointer" onClick={() => window.open('https://studio-9489287013-59986.web.app', '_blank')}>
              <div className="flex items-center justify-between">
                 <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <Globe className="w-6 h-6 text-emerald-400" />
                 </div>
                 <ExternalLink className="w-4 h-4 text-emerald-500 opacity-40" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-white uppercase tracking-tight">Live Web Preview</h4>
                 <p className="text-xs text-muted-foreground italic">Check your studio live on the global network.</p>
              </div>
           </Card>

           <Card className="p-8 bg-primary/10 border-primary/20 rounded-[3rem] space-y-4 group hover:bg-primary/20 transition-all cursor-pointer" onClick={() => router.push('/build-status')}>
              <div className="flex items-center justify-between">
                 <div className="p-4 bg-primary/20 rounded-2xl">
                    <Smartphone className="w-6 h-6 text-primary" />
                 </div>
                 <ArrowRight className="w-4 h-4 text-primary opacity-40" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-white uppercase tracking-tight">Android APK Build</h4>
                 <p className="text-xs text-muted-foreground italic">Generate and download your mobile application.</p>
              </div>
           </Card>

           <Card className="p-8 bg-indigo-500/10 border-indigo-500/20 rounded-[3rem] space-y-4 group hover:bg-indigo-500/20 transition-all cursor-pointer" onClick={() => router.push('/terminal-guide')}>
              <div className="flex items-center justify-between">
                 <div className="p-4 bg-indigo-500/20 rounded-2xl">
                    <CloudUpload className="w-6 h-6 text-indigo-400" />
                 </div>
                 <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">FIX LINK ERROR</span>
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-white uppercase tracking-tight">Web Deploy Protocol</h4>
                 <p className="text-xs text-muted-foreground italic">Execute command to fix "Site Not Found" error.</p>
              </div>
           </Card>
        </section>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pt-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
              <Sparkles className="w-4 h-4 animate-pulse" /> Performance Level: Elite
            </div>
            <h1 className="text-7xl md:text-[8rem] font-headline font-black tracking-tighter text-white leading-[0.8] text-gradient">
              Creative <span className="text-primary italic">Node</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-xl italic leading-relaxed opacity-60">
              Your professional sanctuary for viral AI production.
            </p>
          </div>
          
          <div className="flex items-center gap-12 bg-white/[0.01] backdrop-blur-[60px] p-12 rounded-[4rem] border border-white/5 shadow-2xl blue-glow relative overflow-hidden group">
             <div className="absolute inset-0 shimmer opacity-10" />
             <div className="flex flex-col px-12 border-r border-white/10 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 opacity-50 text-center">Balance</span>
                <div className="flex items-center gap-4">
                  <Coins className="w-10 h-10 text-primary" />
                  <span className="text-7xl font-bold font-headline text-white">{profile?.credits?.toFixed(0) ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-[2.5rem] h-24 font-black px-16 shadow-[0_20px_60px_rgba(59,130,246,0.3)] text-xl gap-6 hover:scale-105 active:scale-95 transition-all bg-primary relative z-10" asChild>
                <Link href="/editor"><Plus className="w-10 h-10" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        {/* 🎬 PROJECT ARCHIVE */}
        <section className="space-y-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                    <History className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Recent Sequences</h3>
              </div>
              <Link href="/projects" className="text-[10px] font-black text-primary hover:tracking-[0.3em] transition-all uppercase tracking-[0.5em] flex items-center gap-3">
                 Explore All <ArrowRight className="w-3 h-3" />
              </Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {projectsLoading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-video bg-white/[0.03] animate-pulse rounded-[3.5rem]" />)
              ) : projects && projects.length > 0 ? (
                projects.map((p: any) => (
                  <Card key={p.id} className="group overflow-hidden rounded-[3.5rem] border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-primary/40 transition-all cursor-pointer shadow-2xl relative" onClick={() => router.push(`/editor?id=${p.id}`)}>
                     <div className="aspect-video relative overflow-hidden">
                        <img 
                           src={p.thumbnailUrl || `https://picsum.photos/seed/${p.id}/600/400`} 
                           alt={p.title} 
                           className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                           <h4 className="text-white font-bold truncate text-xl uppercase tracking-tight">{p.title || 'Untitled Sequence'}</h4>
                           <div className="flex items-center gap-2 mt-3">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)] animate-pulse" />
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">State: Fully Rendered</span>
                           </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[6px]">
                           <div className="p-8 bg-primary/30 rounded-full border border-primary/50 shadow-glow">
                              <Play className="w-12 h-12 text-white fill-current" />
                           </div>
                        </div>
                     </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-40 bg-white/[0.005] rounded-[5rem] border-2 border-dashed border-white/10 text-center space-y-12">
                   <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20 shadow-inner">
                      <LayoutTemplate className="w-16 h-16" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-bold text-white uppercase tracking-widest opacity-30">Archive Empty</h4>
                      <p className="text-muted-foreground italic font-medium text-xl max-w-sm mx-auto opacity-50">Initialize your first creative sequence in the high-fidelity editor.</p>
                   </div>
                   <Button variant="outline" className="rounded-[2.5rem] h-20 px-16 font-black text-[12px] uppercase tracking-[0.5em] hover:bg-white/5 border-white/10 transition-all" asChild>
                      <Link href="/editor">LAUNCH NEURAL ENGINE</Link>
                   </Button>
                </div>
              )}
           </div>
        </section>

        {/* ⚡ FUEL PROTOCOL */}
        <section>
           <Card className="rounded-[5rem] bg-primary/[0.02] border-primary/10 p-16 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-20 group overflow-hidden relative hover:bg-primary/[0.04] transition-all duration-1000 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Zap className="w-[400px] h-[400px] text-primary" />
              </div>
              <div className="flex items-center gap-16 text-center lg:text-left relative z-10">
                 <div className="w-32 h-32 bg-primary/20 rounded-[3.5rem] flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
                    <Zap className="w-14 h-14 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-6xl font-bold font-headline text-white uppercase tracking-tight">Fuel Reserve</h3>
                    <p className="text-muted-foreground text-2xl font-medium italic opacity-60 max-w-lg">Sync attention for 15s to replenish +20 AI credits to your node instantly.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-28 px-20 rounded-[3rem] bg-primary font-black text-3xl uppercase tracking-[0.2em] shadow-[0_30px_70px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all relative z-10">
                 {adLoading ? <Loader2 className="animate-spin mr-6 w-10 h-10" /> : <Play className="w-10 h-10 mr-6 fill-current" />}
                 WATCH & EARN
              </Button>
           </Card>
        </section>

      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-[120px] flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center space-y-24 px-12 max-w-4xl">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/40 blur-[180px] rounded-full neural-pulse" />
                 <div className="w-64 h-56 flex flex-col items-center justify-center mx-auto relative z-10">
                    <span className="text-[12rem] font-black text-white font-headline tracking-tighter leading-none">{adTimer}</span>
                    <span className="text-[14px] font-black text-primary uppercase tracking-[0.8em] mt-6">Attention Sync Active</span>
                 </div>
              </div>
              <div className="space-y-10">
                 <h2 className="text-6xl font-headline font-bold text-white tracking-tighter uppercase leading-none">VERIFYING NEURAL LOAD</h2>
                 <p className="text-3xl text-muted-foreground italic font-medium opacity-60">Validating sensory impressions to replenish your unique creative node.</p>
                 <div className="w-[500px] h-2 bg-white/5 rounded-full mx-auto overflow-hidden shadow-inner border border-white/5">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_35px_rgba(59,130,246,1)]" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
