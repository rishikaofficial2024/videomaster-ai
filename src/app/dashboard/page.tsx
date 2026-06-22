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

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020408]">
        <div className="text-center space-y-6">
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto relative z-10" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Authenticating Studio Node</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#020408] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-20">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pt-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" /> High Performance Mode
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white leading-[0.9] text-gradient">
              Studio <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl italic leading-relaxed opacity-70">
              Your central hub for high-conversion AI scripts and cinematic visual production.
            </p>
          </div>
          
          <div className="flex items-center gap-10 bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/5 shadow-2xl blue-glow">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-60">Balance</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">{profile?.credits ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-[2rem] h-20 font-black px-12 shadow-2xl shadow-primary/20 text-lg gap-4 hover:scale-105 active:scale-95 transition-all bg-primary" asChild>
                <Link href="/editor"><Plus className="w-6 h-6" /> NEW PROJECT</Link>
             </Button>
          </div>
        </header>

        {/* 🎬 MASTERPIECE REEL */}
        <section className="space-y-10">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <History className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <h3 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Recent Productions</h3>
              </div>
              <Link href="/projects" className="text-[10px] font-black text-primary hover:tracking-[0.2em] transition-all uppercase tracking-widest">Library View</Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {projectsLoading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-[2rem]" />)
              ) : projects && projects.length > 0 ? (
                projects.map((p: any) => (
                  <Card key={p.id} className="group overflow-hidden rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all cursor-pointer shadow-xl" onClick={() => router.push(`/editor?id=${p.id}`)}>
                     <div className="aspect-video relative overflow-hidden">
                        <img 
                           src={p.thumbnailUrl || `https://picsum.photos/seed/${p.id}/600/400`} 
                           alt={p.title} 
                           className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                           <h4 className="text-white font-bold truncate text-base uppercase tracking-tight">{p.title || 'Untitled'}</h4>
                           <div className="flex items-center gap-2 mt-1.5">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Sync Active</span>
                           </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                           <div className="p-5 bg-primary/20 rounded-full border border-primary/40">
                              <Play className="w-8 h-8 text-white fill-current" />
                           </div>
                        </div>
                     </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-28 bg-white/[0.01] rounded-[4rem] border-2 border-dashed border-white/5 text-center space-y-8">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-10">
                      <LayoutTemplate className="w-12 h-12" />
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-2xl font-bold text-white uppercase tracking-widest opacity-40 text-gradient">The Studio is Quiet</h4>
                      <p className="text-muted-foreground italic font-medium">Your high-value productions will be indexed here.</p>
                   </div>
                   <Button variant="outline" className="rounded-2xl border-white/10 h-12 px-10 font-black text-[10px] uppercase tracking-widest hover:bg-white/5" asChild>
                      <Link href="/editor">Launch Neural Engine</Link>
                   </Button>
                </div>
              )}
           </div>
        </section>

        {/* ⚡ REWARD PROTOCOL */}
        <section>
           <Card className="rounded-[4rem] bg-primary/[0.03] border-primary/20 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative hover:bg-primary/[0.05] transition-all duration-700">
              <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Zap className="w-64 h-64 text-primary" />
              </div>
              <div className="flex items-center gap-10 text-center md:text-left relative z-10">
                 <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
                    <Zap className="w-10 h-10 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Fuel Reserve</h3>
                    <p className="text-muted-foreground text-lg font-medium italic opacity-60">Watch a 15s sequence to replenish +20 AI credits instantly.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-20 px-12 rounded-[2rem] bg-primary font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                 {adLoading ? <Loader2 className="animate-spin mr-3 w-6 h-6" /> : <Play className="w-6 h-6 mr-3 fill-current" />}
                 WATCH & EARN
              </Button>
           </Card>
        </section>

        {/* 🌍 NETWORK EXPANSION */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="space-y-8 text-center lg:text-left">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-600/10 rounded-full border border-indigo-600/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em]">
                    <Tornado className="w-3.5 h-3.5 animate-spin-slow" /> Viral Node Active
                 </div>
                 <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white text-gradient">Viral <span className="text-indigo-500 italic">Growth</span></h2>
                 <p className="text-lg text-muted-foreground max-w-2xl italic leading-relaxed font-medium opacity-60">
                    Share your studio link with fellow creators to expand the neural network.
                 </p>
              </div>
              <div className="flex flex-col gap-6 w-full lg:w-auto">
                 <Button onClick={handleShare} className="h-20 px-14 rounded-[2rem] bg-white text-black font-black text-xl gap-4 hover:bg-white/90 shadow-2xl">
                    <Share2 className="w-6 h-6" /> INVITE CREATORS
                 </Button>
                 <div className="flex justify-center gap-10 opacity-30">
                    <Instagram className="w-7 h-7 hover:text-primary transition-colors cursor-pointer" />
                    <MessageCircle className="w-7 h-7 hover:text-primary transition-colors cursor-pointer" />
                    <Twitter className="w-7 h-7 hover:text-primary transition-colors cursor-pointer" />
                 </div>
              </div>
           </div>
        </section>

      </main>

      {showAdOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center space-y-16 px-12 max-w-2xl">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full neural-pulse" />
                 <div className="w-36 h-32 flex flex-col items-center justify-center mx-auto relative z-10">
                    <span className="text-8xl font-black text-white font-headline tracking-tighter">{adTimer}</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-2">Encoding</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase leading-none">NEURAL SYNC IN PROGRESS</h2>
                 <p className="text-xl text-muted-foreground italic font-medium opacity-60">Rewarding your node for verified attention impressions.</p>
                 <div className="w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,1)]" style={{ width: `${(15 - adTimer) / 15 * 100}%` }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
