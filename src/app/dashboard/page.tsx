"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, History, LayoutTemplate, Zap,
  Tornado, Share2, Instagram, MessageCircle, Twitter
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, updateDoc, increment, collection, query, limit, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
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
      updateDoc(userProfileRef, updateData).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: updateData,
          }));
        });
      setAdLoading(false);
      setShowAdOverlay(false);
      toast({ title: "Credits Earned", description: "+20 AI Credits added to your core." });
    }, 15000);
  };

  const handleShare = () => {
    const text = "🚀 Create viral AI videos with VideoMaster AI! Get 100 FREE credits here: https://videomaster-ai.tech";
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      toast({ title: "Invite Copied", description: "Share your unique link with creators." });
    }
  };

  if (!mounted || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <div className="text-center space-y-8">
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto relative z-10" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Initializing Studio Neural Node</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 md:pt-24 bg-[#020408] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-24">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pt-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-4 h-4 animate-pulse" /> Performance Tier: Elite
            </div>
            <h1 className="text-6xl md:text-[7rem] font-headline font-bold tracking-tighter text-white leading-[0.85] text-gradient">
              Studio <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-xl italic leading-relaxed opacity-60">
              Master the art of viral production with high-fidelity AI tools.
            </p>
          </div>
          
          <div className="flex items-center gap-12 bg-white/[0.01] backdrop-blur-3xl p-10 rounded-[4rem] border border-white/5 shadow-2xl blue-glow relative overflow-hidden group">
             <div className="absolute inset-0 shimmer opacity-10" />
             <div className="flex flex-col px-10 border-r border-white/10 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 opacity-60">Neural Balance</span>
                <div className="flex items-center gap-4">
                  <Coins className="w-8 h-8 text-primary" />
                  <span className="text-6xl font-bold font-headline text-white">{profile?.credits ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-[2.5rem] h-24 font-black px-16 shadow-[0_20px_50px_rgba(59,130,246,0.3)] text-xl gap-5 hover:scale-105 active:scale-95 transition-all bg-primary relative z-10" asChild>
                <Link href="/editor"><Plus className="w-8 h-8" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        {/* 🎬 MASTERPIECE REEL */}
        <section className="space-y-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                    <History className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Project Registry</h3>
              </div>
              <Link href="/projects" className="text-[10px] font-black text-primary hover:tracking-[0.2em] transition-all uppercase tracking-[0.4em]">View Archive</Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {projectsLoading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-video bg-white/[0.03] animate-pulse rounded-[3rem]" />)
              ) : projects && projects.length > 0 ? (
                projects.map((p: any) => (
                  <Card key={p.id} className="group overflow-hidden rounded-[3rem] border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-primary/40 transition-all cursor-pointer shadow-2xl" onClick={() => router.push(`/editor?id=${p.id}`)}>
                     <div className="aspect-video relative overflow-hidden">
                        <img 
                           src={p.thumbnailUrl || `https://picsum.photos/seed/${p.id}/600/400`} 
                           alt={p.title} 
                           className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                           <h4 className="text-white font-bold truncate text-lg uppercase tracking-tight">{p.title || 'Untitled Node'}</h4>
                           <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,1)] animate-pulse" />
                              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">State: Verified</span>
                           </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[4px]">
                           <div className="p-6 bg-primary/25 rounded-full border border-primary/40 shadow-glow">
                              <Play className="w-10 h-10 text-white fill-current" />
                           </div>
                        </div>
                     </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-32 bg-white/[0.005] rounded-[4rem] border-2 border-dashed border-white/5 text-center space-y-10">
                   <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-10">
                      <LayoutTemplate className="w-14 h-14" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-3xl font-bold text-white uppercase tracking-widest opacity-20 text-gradient">No Neural Records Found</h4>
                      <p className="text-muted-foreground italic font-medium text-lg">Initialize your first creative sequence in the Editor.</p>
                   </div>
                   <Button variant="outline" className="rounded-[2rem] h-16 px-14 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/5 border-white/10" asChild>
                      <Link href="/editor">Launch Neural Engine</Link>
                   </Button>
                </div>
              )}
           </div>
        </section>

        {/* ⚡ REWARD PROTOCOL */}
        <section>
           <Card className="rounded-[4.5rem] bg-primary/[0.02] border-primary/10 p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-16 group overflow-hidden relative hover:bg-primary/[0.04] transition-all duration-1000 shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Zap className="w-80 h-84 text-primary" />
              </div>
              <div className="flex items-center gap-12 text-center lg:text-left relative z-10">
                 <div className="w-28 h-28 bg-primary/20 rounded-[3rem] flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
                    <Zap className="w-12 h-12 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-5xl font-bold font-headline text-white uppercase tracking-tight">Fuel Reserve</h3>
                    <p className="text-muted-foreground text-xl font-medium italic opacity-50">Sync attention for 15s to replenish +20 AI credits instantly.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-24 px-16 rounded-[2.5rem] bg-primary font-black text-2xl uppercase tracking-[0.2em] shadow-[0_25px_60px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all relative z-10">
                 {adLoading ? <Loader2 className="animate-spin mr-4 w-8 h-8" /> : <Play className="w-8 h-8 mr-4 fill-current" />}
                 WATCH & EARN
              </Button>
           </Card>
        </section>

        {/* 🌍 NETWORK EXPANSION */}
        <section className="bg-white/[0.01] border border-white/5 rounded-[5rem] p-16 md:p-24 relative overflow-hidden group shadow-2xl">
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20">
              <div className="space-y-10 text-center lg:text-left">
                 <div className="inline-flex items-center gap-4 px-5 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    <Tornado className="w-4 h-4 animate-spin-slow" /> Expansion Protocol Active
                 </div>
                 <h2 className="text-6xl md:text-[6rem] font-bold font-headline tracking-tighter text-white text-gradient leading-none">Viral <span className="text-indigo-500 italic">Growth</span></h2>
                 <p className="text-xl text-muted-foreground max-w-2xl italic leading-relaxed font-medium opacity-50">
                    Propagate your Studio link across the creator network to expand the global node.
                 </p>
              </div>
              <div className="flex flex-col gap-8 w-full lg:w-auto">
                 <Button onClick={handleShare} className="h-24 px-20 rounded-[3rem] bg-white text-black font-black text-2xl gap-5 hover:bg-white/90 shadow-2xl hover:scale-105 transition-all">
                    <Share2 className="w-8 h-8" /> INVITE CREATORS
                 </Button>
                 <div className="flex justify-center gap-14 opacity-20">
                    <Instagram className="w-10 h-10 hover:text-primary transition-colors cursor-pointer" />
                    <MessageCircle className="w-10 h-10 hover:text-primary transition-colors cursor-pointer" />
                    <Twitter className="w-10 h-10 hover:text-primary transition-colors cursor-pointer" />
                 </div>
              </div>
           </div>
        </section>

      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-[100px] flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center space-y-20 px-12 max-w-3xl">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/40 blur-[150px] rounded-full neural-pulse" />
                 <div className="w-48 h-40 flex flex-col items-center justify-center mx-auto relative z-10">
                    <span className="text-[10rem] font-black text-white font-headline tracking-tighter leading-none">{adTimer}</span>
                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] mt-4">Neural Sync In Progress</span>
                 </div>
              </div>
              <div className="space-y-8">
                 <h2 className="text-5xl font-headline font-bold text-white tracking-tighter uppercase leading-none">VERIFYING ATTENTION NODES</h2>
                 <p className="text-2xl text-muted-foreground italic font-medium opacity-50">Rewarding your unique node for verified sensory impressions.</p>
                 <div className="w-80 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden shadow-inner">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_25px_rgba(59,130,246,1)]" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
