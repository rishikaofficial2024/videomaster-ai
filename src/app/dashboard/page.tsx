
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Play, Sparkles, Wand2, History, 
  ChevronRight, Loader2, Crown, Coins, 
  Zap, MoreVertical, Video, ArrowUpRight, 
  ShieldCheck, BarChart3, Clock, Layout
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
  }, [db, user]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Recently";
    }
  };

  if (userLoading) {
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
        
        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                 {profile?.subscriptionPlan === 'pro' ? 'PRO STUDIO ACTIVE' : 'STARTER WORKSPACE'}
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">
              Welcome, <span className="text-primary italic">{user?.displayName?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-muted-foreground font-medium text-xl">What are we building today?</p>
          </div>
          
          <div className="flex items-center gap-6 bg-[#0a0d14]/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl">
             <div className="flex flex-col px-6 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Credits</span>
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

        {/* Global Analytics Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-[2.5rem] bg-[#0a0d14] border-white/5 p-8 blue-glow space-y-6">
              <div className="flex items-center justify-between">
                 <div className="p-3 bg-primary/10 rounded-2xl">
                    <BarChart3 className="w-5 h-5 text-primary" />
                 </div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</span>
              </div>
              <div className="space-y-1">
                 <h3 className="text-3xl font-bold font-headline">94.2%</h3>
                 <p className="text-xs text-muted-foreground font-medium">AI-powered workflow improvement</p>
              </div>
              <Progress value={94} className="h-1.5 bg-white/5" />
           </Card>

           <Card className="rounded-[2.5rem] bg-[#0a0d14] border-white/5 p-8 blue-glow space-y-6">
              <div className="flex items-center justify-between">
                 <div className="p-3 bg-orange-500/10 rounded-2xl">
                    <Video className="w-5 h-5 text-orange-500" />
                 </div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Production</span>
              </div>
              <div className="space-y-1">
                 <h3 className="text-3xl font-bold font-headline">{projects?.length || 0}</h3>
                 <p className="text-xs text-muted-foreground font-medium">Total projects in your studio</p>
              </div>
              <Progress value={projects?.length ? (projects.length / 50) * 100 : 0} className="h-1.5 bg-white/5" />
           </Card>

           <Card className="rounded-[2.5rem] bg-primary border-none p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Crown className="w-32 h-32 rotate-12" />
              </div>
              <div className="relative z-10 space-y-6">
                 <h3 className="text-2xl font-bold font-headline leading-tight">Unlock Elite <br/> Features</h3>
                 <p className="text-xs font-medium text-primary-foreground/80">Get 4K exports and priority AI rendering.</p>
                 <Button variant="secondary" className="w-full rounded-xl font-bold h-12 shadow-lg" asChild>
                    <Link href="/premium">Upgrade Now <ArrowUpRight className="ml-2 w-4 h-4" /></Link>
                 </Button>
              </div>
           </Card>
        </section>

        {/* Quick Tools */}
        <section className="space-y-8">
           <h2 className="text-2xl font-headline font-bold tracking-tight">Studio Tools</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Wand2, label: "Veo 2.0 Gen", href: "/editor?tool=gen", color: "text-blue-400 bg-blue-500/10" },
                { icon: Zap, label: "Viral SEO", href: "/editor?tool=optimization", color: "text-orange-400 bg-orange-500/10" },
                { icon: Clock, label: "Auto Transcribe", href: "/editor?tool=captions", color: "text-purple-400 bg-purple-500/10" },
                { icon: Layout, label: "Template Hub", href: "/templates", color: "text-emerald-400 bg-emerald-500/10" },
              ].map((tool, i) => (
                <Link key={i} href={tool.href} className="group p-6 rounded-[2rem] bg-[#0a0d14] border border-white/5 hover:border-primary/50 transition-all duration-500">
                   <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tool.color)}>
                      <tool.icon className="w-6 h-6" />
                   </div>
                   <h4 className="font-bold text-sm mb-1">{tool.label}</h4>
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Launch Tool</p>
                </Link>
              ))}
           </div>
        </section>

        {/* Recent Projects */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <h2 className="text-2xl font-headline font-bold tracking-tight">Cloud Storage</h2>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Recent activity in your studio</p>
            </div>
            <Link href="/projects" className="text-xs font-bold text-primary flex items-center hover:underline bg-[#0a0d14] px-4 py-2 rounded-xl border border-white/5">
              View Library <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-[#0a0d14] animate-pulse rounded-[2.5rem] border border-white/5" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden rounded-[2.5rem] border-white/5 bg-[#0a0d14] shadow-xl hover:shadow-2xl transition-all duration-500">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{project.title}</h3>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                             <span>{formatDate(project.updatedAt || project.createdAt)}</span>
                             <span>•</span>
                             <span>4K PRO</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-white/5"><MoreVertical className="w-5 h-5" /></Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-[#0a0d14] border-2 border-dashed border-white/5 rounded-[4rem] p-24 text-center">
              <div className="w-20 h-20 bg-[#0c0f17] rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Video className="w-8 h-8 text-primary opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-3">No Active Projects</h3>
              <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-sm font-medium leading-relaxed">Your creative studio is ready for its first masterpiece. Start generating with AI now.</p>
              <Button className="rounded-2xl h-14 px-10 font-bold shadow-2xl shadow-primary/30" asChild>
                <Link href="/editor">Launch New Session</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
