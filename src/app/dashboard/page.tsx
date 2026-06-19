
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Sparkles, ChevronRight, Loader2, Coins, 
  ArrowUpRight, Video, Activity, Gift, MonitorPlay, Star, ArrowRight, Globe, CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, increment } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
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
    if (!userProfileRef) return;
    setAdLoading(true);
    toast({
      title: "Ad Shuru Ho Gaya Hai!",
      description: "Bas 15 second wait karein aur +20 credits payein.",
    });

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
      toast({
        title: "Mubarak Ho! +20 Credits",
        description: "Aapke account mein credits jud gaye hain.",
      });
    }, 15000);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Abhi abhi";
    if (!mounted) return "...";
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Haal hi mein";
    }
  };

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-16">
        
        {/* Simplified Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className={cn("flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit")}>
                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                   APP IS LIVE & SEARCH READY
                 </span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white">
              Hello, <span className="text-primary italic">{user?.displayName?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-xl italic">Aaj kaunsi viral video banani hai?</p>
          </div>
          
          {/* Quick Stats - Bigger & Clearer */}
          <div className="flex items-center gap-8 bg-[#0a0d14]/90 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/5 shadow-2xl blue-glow">
             <div className="flex flex-col px-8 border-r border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Aapke Credits</span>
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-5xl font-bold font-headline text-white">
                    {profile?.isPremium ? '∞' : (profile?.credits ?? 0)}
                  </span>
                </div>
             </div>
             <Button className="rounded-[2rem] h-20 font-bold px-12 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 text-lg" asChild>
                <Link href="/editor"><Plus className="w-6 h-6 mr-3" /> Nayi Video</Link>
             </Button>
          </div>
        </header>

        {/* Free Credits Section - More Prominent */}
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
                     <h3 className="text-4xl font-bold font-headline text-white tracking-tight">Free Credits Chahiye?</h3>
                     <p className="text-muted-foreground font-medium text-lg italic">Bas ek short ad dekho aur <span className="text-primary font-bold">+20 credits</span> turant payein.</p>
                  </div>
               </div>
               <Button 
                 onClick={handleWatchAd} 
                 disabled={adLoading || profile?.isPremium}
                 className="h-24 px-16 rounded-[2rem] bg-primary font-bold shadow-2xl shadow-primary/40 text-xl hover:scale-105 transition-all group active:scale-95"
               >
                  {adLoading ? <Loader2 className="animate-spin mr-3 w-8 h-8" /> : <MonitorPlay className="w-8 h-8 mr-4 group-hover:animate-pulse" />}
                  {adLoading ? "Ad chal raha hai..." : "Ad Dekho aur Earn Karo"}
               </Button>
            </div>
          </Card>
        </section>

        {/* Display Ads - Monetization Rasta */}
        <AdBanner provider="Network Hub" />

        {/* Project Library - Simple Grid */}
        <section className="space-y-10">
          <div className="flex justify-between items-end px-4">
            <div>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Aapke Purane Designs</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Sabhi projects yahan save hain</p>
            </div>
            <Link href="/projects" className="text-sm font-bold text-primary flex items-center hover:underline group">
              Saare Dekho <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => <div key={i} className="h-72 bg-[#0a0d14] animate-pulse rounded-[3rem]" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {projects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden rounded-[3rem] border-white/5 bg-[#0a0d14] shadow-2xl transition-all duration-500 hover:border-primary/30">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-8">
                       <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors text-white">{project.title}</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">{formatDate(project.updatedAt || project.createdAt)} ko banaya</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-[#0a0d14] border-4 border-dashed border-white/5 rounded-[4rem] p-32 text-center space-y-8 group hover:border-primary/20 transition-all">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                 <Video className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold font-headline text-white">Abhi koi project nahi hai</h3>
                 <p className="text-muted-foreground font-medium italic">Chaliye, pehli viral video aaj hi banate hain!</p>
              </div>
              <Button className="rounded-[2rem] h-16 px-12 font-bold shadow-xl shadow-primary/20" asChild>
                <Link href="/editor">Naya Kaam Shuru Karo</Link>
              </Button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
