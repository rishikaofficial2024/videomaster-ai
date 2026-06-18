
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Play, Sparkles, Wand2, History, 
  ChevronRight, Loader2, Crown, Coins, 
  Zap, MoreVertical, Video, ArrowUpRight, 
  ShieldCheck, BarChart3, Clock, Layout,
  Cpu, Activity, Globe, ExternalLink, MonitorPlay, AlertTriangle, Gift
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

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [adLoading, setAdLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use useMemoFirebase to stabilize the Firestore reference
  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  // Use useMemoFirebase to stabilize the Firestore query
  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
  }, [db, user?.uid]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  const handleWatchAd = async () => {
    if (!userProfileRef) return;
    setAdLoading(true);
    toast({
      title: "Loading Rewarded Video...",
      description: "Ad started. Please watch for 15 seconds to earn +20 credits.",
    });

    setTimeout(async () => {
      updateDoc(userProfileRef, {
        credits: increment(20)
      }).catch(() => {});
      setAdLoading(false);
      toast({
        title: "Success! +20 Credits",
        description: "Your reward has been added.",
      });
    }, 15000);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    if (!mounted) return "...";
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Recently";
    }
  };

  if (userLoading || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                   {profile?.subscriptionPlan === 'pro' ? 'PRO STUDIO ACTIVE' : 'STARTER WORKSPACE'}
                 </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">
              Welcome, <span className="text-primary italic">{user?.displayName?.split(' ')[0] || 'Creator'}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 bg-[#0a0d14]/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl">
             <div className="flex flex-col px-6 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">AI Credits</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-3xl font-bold font-headline">
                    {profile?.isPremium ? '∞' : (profile?.credits ?? 0)}
                  </span>
                </div>
             </div>
             <Button className="rounded-2xl h-16 font-bold px-10 shadow-2xl shadow-primary/30 transition-all hover:scale-105" asChild>
                <Link href="/editor"><Plus className="w-6 h-6 mr-2" /> New Project</Link>
             </Button>
          </div>
        </header>

        <section className="relative overflow-hidden group">
          <Card className="rounded-[3rem] bg-[#0a0d14] border-primary/20 p-8 md:p-12 relative z-10 blue-glow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20">
                     <Gift className="w-10 h-10 text-primary animate-bounce" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-bold font-headline">Earn +20 Credits</h3>
                     <p className="text-muted-foreground font-medium">Watch a short video ad and fuel your creativity.</p>
                  </div>
               </div>
               <Button 
                 onClick={handleWatchAd} 
                 disabled={adLoading || profile?.isPremium}
                 className="h-20 px-12 rounded-2xl bg-primary font-bold shadow-2xl shadow-primary/40 text-lg"
               >
                  {adLoading ? <Loader2 className="animate-spin mr-3 w-6 h-6" /> : <MonitorPlay className="w-6 h-6 mr-3" />}
                  {adLoading ? "Ad playing..." : "Watch Ad & Earn"}
               </Button>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-[2.5rem] bg-[#0a0d14] border-white/5 p-8 blue-glow space-y-6">
              <div className="flex items-center justify-between">
                 <div className="p-3 bg-primary/10 rounded-2xl"><Activity className="w-5 h-5 text-primary" /></div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</span>
              </div>
              <h3 className="text-3xl font-bold font-headline">98.5%</h3>
              <Progress value={98} className="h-1.5 bg-white/5" />
           </Card>

           <Card className="rounded-[2.5rem] bg-primary border-none p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="relative z-10 space-y-6">
                 <h3 className="text-2xl font-bold font-headline leading-tight">Elite <br/> Creator Hub</h3>
                 <Button variant="secondary" className="w-full rounded-xl font-bold h-12" asChild>
                    <Link href="/premium">Go Ad-Free <ArrowUpRight className="ml-2 w-4 h-4" /></Link>
                 </Button>
              </div>
           </Card>
        </section>

        <AdBanner provider="Premium AdMob Network" />

        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-headline font-bold">Project Library</h2>
            <Link href="/projects" className="text-xs font-bold text-primary flex items-center hover:underline">
              Browse All <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-[#0a0d14] animate-pulse rounded-[2.5rem]" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden rounded-[2.5rem] border-white/5 bg-[#0a0d14] shadow-xl transition-all duration-500">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6">
                       <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{project.title}</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{formatDate(project.updatedAt || project.createdAt)}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-[#0a0d14] border-2 border-dashed border-white/5 rounded-[4rem] p-24 text-center">
              <Button className="rounded-2xl h-14 px-10 font-bold" asChild>
                <Link href="/editor">Launch New Session</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
