
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, Sparkles, Loader2, Coins, 
  Play, History, LayoutTemplate, Zap,
  Tornado, Share2, MessageCircle, Instagram, Twitter
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, updateDoc, increment, collection, query, limit, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdBanner } from "@/components/ads/ad-banner";
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
      toast({ title: "Success! +20 Credits Earned" });
    }, 15000);
  };

  const handleShare = () => {
    const text = "🚀 Join VideoMaster AI! Generate viral reels & scripts instantly. Use my link to get 100 FREE credits: https://videomaster-ai.tech";
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      toast({ title: "Viral Message Copied!", description: "Share it on WhatsApp or Instagram now!" });
    }
  };

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05070a]">
        <div className="text-center space-y-4">
           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Initialising Studio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-16">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 pt-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Professional Production Mode
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none">
              Studio <span className="text-primary italic">Control</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-xl italic leading-relaxed">
              Generate viral AI scripts and cinematic video clips in seconds. 
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
             <Button className="rounded-[3rem] h-24 font-black px-14 shadow-[0_30px_70px_rgba(59,130,246,0.5)] text-xl gap-4 hover:scale-105 transition-all bg-primary" asChild>
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
                 <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Recent Masterpieces</h3>
              </div>
              <Link href="/projects" className="text-sm font-bold text-primary hover:underline uppercase tracking-widest">Explore Library</Link>
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
                           <h4 className="text-white font-bold truncate text-lg uppercase tracking-tight">{p.title || 'Untitled Project'}</h4>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                              {p.updatedAt ? "Sync Verified" : "Draft Mode"}
                           </p>
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
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Studio Empty</h4>
                      <p className="text-muted-foreground italic">Your high-value productions will appear here.</p>
                   </div>
                   <Button variant="outline" className="rounded-2xl border-white/10" asChild>
                      <Link href="/editor">Launch Neural Editor</Link>
                   </Button>
                </div>
              )}
           </div>
        </section>

        {/* 💳 REWARD CENTER */}
        <section className="grid grid-cols-1 gap-10">
           <Card className="rounded-[4rem] bg-primary/5 border-primary/30 p-12 flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden relative hover:bg-primary/[0.08] transition-all">
              <div className="flex items-center gap-10 text-center md:text-left relative z-10">
                 <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border-2 border-primary/20 shadow-2xl">
                    <Zap className="w-12 h-12 text-primary" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Fuel Your AI Core</h3>
                    <p className="text-muted-foreground text-lg font-medium italic">Watch a premium ad to earn +20 free AI credits instantly.</p>
                 </div>
              </div>
              <Button onClick={handleWatchAd} disabled={adLoading} className="h-24 px-16 rounded-[2rem] bg-primary font-black text-2xl uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                 {adLoading ? <Loader2 className="animate-spin mr-3 w-8 h-8" /> : <Play className="w-8 h-8 mr-3 fill-current" />}
                 WATCH & EARN +20
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
                    <Tornado className="w-4 h-4 animate-spin" /> Viral growth active
                 </div>
                 <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white">Expand Your <span className="text-indigo-400 italic">Reach</span></h2>
                 <p className="text-xl text-muted-foreground max-w-2xl italic leading-relaxed font-medium">
                    Invite creators to VideoMaster AI and strengthen the global neural network.
                 </p>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                 <Button onClick={handleShare} className="h-24 px-16 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 font-black text-2xl gap-6 shadow-2xl shadow-indigo-600/40">
                    <Share2 className="w-8 h-8" /> COPY INVITE LINK
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
           <AdBanner provider="Premium Studio Ads" variant="large" />
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
                 <p className="text-2xl text-muted-foreground italic font-medium max-w-md mx-auto">Encoding your rewarded credits. Do not close this terminal.</p>
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
