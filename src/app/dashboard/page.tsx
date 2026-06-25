"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Video, Wand2, Sparkles, History, Play, 
  MoreVertical, Search, Star, Youtube, Instagram, 
  ChevronRight, Zap, ExternalLink, Upload, 
  CloudUpload, LayoutDashboard, Clock, FileVideo,
  TrendingUp, Tornado, Activity
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("updatedAt", "desc"),
      limit(4)
    );
  }, [user, db]);

  const { data: projects, loading } = useCollection(projectsQuery);

  const quickTools = [
    { name: "AI Script", icon: Wand2, desc: "Neural narratives", href: "/ai-tools/script", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "YT Shorts", icon: Youtube, desc: "Viral conversion", href: "/editor?mode=shorts", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { name: "Auto Caption", icon: Sparkles, desc: "Subtitle engine", href: "/editor?mode=caption", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { name: "Design Node", icon: Instagram, desc: "Art generation", href: "/ai-tools/thumbnail", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#03010a] hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-[100rem] mx-auto p-6 md:p-16 space-y-16 mt-24">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 pt-8 border-b pb-16 border-white/5">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em]">
               <Zap className="h-4 w-4 animate-pulse" /> PRODUCTION NODE ONLINE
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter leading-[0.8] uppercase text-white">
              Studio <span className="text-primary italic">Hub.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium italic opacity-60">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Creator'}. Select a creative protocol.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
             <div className="relative flex-1 sm:w-96 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input placeholder="Search project registry..." className="h-20 pl-16 rounded-[2.5rem] bg-white/[0.03] border-white/10 text-xl focus:border-primary/50 transition-all font-medium shadow-inner" />
             </div>
             <div className="flex gap-4">
                <Button asChild size="lg" variant="outline" className="rounded-[2.5rem] h-20 px-10 font-black uppercase tracking-[0.2em] text-[11px] gap-4 border-2 bg-white/5 hover:bg-white/10 transition-all shadow-xl">
                  <Link href="/editor">
                    <CloudUpload className="h-6 w-6 text-primary" /> INGEST MEDIA
                  </Link>
                </Button>
                <Button asChild size="lg" className="rounded-[2.5rem] shadow-2xl shadow-primary/40 h-20 px-12 font-black uppercase tracking-[0.2em] text-[11px] gap-4 active:scale-95 transition-all">
                  <Link href="/editor">
                    <Plus className="h-6 w-6" /> NEW SEQUENCE
                  </Link>
                </Button>
             </div>
          </div>
        </header>

        {/* Neural Toolset */}
        <section className="space-y-10">
           <div className="flex items-center justify-between px-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/40">NEURAL PROTOCOLS</h2>
              <Link href="/ai-tools" className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">Explore Hubs <ChevronRight size={16} /></Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
             {quickTools.map((tool, i) => (
               <Link key={i} href={tool.href} className="group">
                 <Card className={cn("premium-card h-full rounded-[4rem] border-2 border-transparent transition-all group-hover:border-primary/40 group-hover:bg-primary/5", tool.border)}>
                   <CardContent className="p-12 flex flex-col items-center text-center gap-8">
                     <div className={cn("p-8 rounded-[2.5rem] shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6", tool.bg, tool.color)}>
                       <tool.icon className="h-12 w-12" />
                     </div>
                     <div className="space-y-3">
                       <h3 className="text-3xl font-black uppercase tracking-tight text-white">{tool.name}</h3>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">{tool.desc}</p>
                     </div>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-16 pt-12">
          {/* Active Matrix Registry */}
          <section className="lg:col-span-3 space-y-12">
            <div className="flex items-center justify-between border-b pb-12 border-white/5">
              <div className="flex items-center gap-8">
                <div className="p-5 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl"><History className="h-10 w-10 text-primary" /></div>
                <div className="space-y-2">
                   <h2 className="text-5xl font-black tracking-tight uppercase text-white leading-none">Active <span className="text-primary italic">Matrix.</span></h2>
                   <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-30">Your private creative node persistence</p>
                </div>
              </div>
              <Button variant="ghost" asChild className="rounded-full h-14 font-black text-[10px] uppercase tracking-[0.4em] px-10 hover:bg-primary/10 transition-all">
                <Link href="/projects">FULL ARCHIVE <ChevronRight size={18} className="ml-3" /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-12">
                {[1, 2].map(i => (
                  <div key={i} className="h-80 rounded-[4rem] bg-white/[0.02] animate-pulse border border-white/5" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-12">
                {projects.map((project: any) => (
                  <Card key={project.id} className="group overflow-hidden rounded-[4rem] premium-card border-white/5 shadow-2xl relative">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/800/450`} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[2s] opacity-70"
                        data-ai-hint="video fragment"
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 gap-8 backdrop-blur-md">
                         <div className="p-8 bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.4)] scale-50 group-hover:scale-100 transition-all duration-700">
                            <Play className="h-12 w-12 text-primary fill-current ml-2" />
                         </div>
                         <span className="text-[11px] font-black text-white uppercase tracking-[0.8em] animate-pulse">RESTORE NODE</span>
                      </div>
                      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-2xl px-5 py-2 rounded-full text-[9px] font-black text-white uppercase tracking-[0.4em] border border-white/10 shadow-2xl">
                         4K MASTER
                      </div>
                    </div>
                    <CardContent className="p-12 flex justify-between items-center bg-[#0a0d14]">
                       <div className="space-y-4">
                          <h3 className="text-3xl font-black truncate max-w-[280px] uppercase tracking-tight group-hover:text-primary transition-colors text-white">{project.title || "Untitled Masterpiece"}</h3>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black flex items-center gap-4">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse" /> 
                             {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "SYNCED NOW"}
                          </div>
                       </div>
                       <Button variant="ghost" size="icon" className="h-16 w-16 rounded-3xl hover:bg-primary/10 transition-all">
                         <MoreVertical className="h-8 w-8 text-muted-foreground" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-4 border-dashed border-white/5 bg-white/[0.01] h-[600px] flex flex-col items-center justify-center text-center p-20 rounded-[5rem] group hover:bg-white/[0.02] transition-all shadow-inner">
                <div className="bg-primary/10 p-12 rounded-[3.5rem] mb-12 group-hover:scale-110 transition-all duration-700 border-2 border-primary/20 shadow-[0_0_100px_rgba(0,112,243,0.1)]">
                  <Tornado className="h-24 w-24 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-black text-5xl mb-8 uppercase tracking-tight text-white leading-none">REGISTRY IDLE.</h3>
                <p className="text-2xl text-muted-foreground max-w-md mb-16 font-medium italic opacity-60">
                  The studio node is awaiting your initial creative broadcast.
                </p>
                <Button size="lg" asChild className="rounded-full h-24 px-20 font-black text-2xl shadow-2xl shadow-primary/40 transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white">
                  <Link href="/editor" className="flex items-center gap-6">
                    ACCESS MASTER STUDIO <ChevronRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </Card>
            )}
          </section>

          {/* Neural Feedback Metrics */}
          <aside className="space-y-16">
            <Card className="rounded-[4rem] border-none shadow-[0_50px_100px_-20px_rgba(0,112,243,0.3)] bg-primary text-primary-foreground overflow-hidden group relative">
              <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-[1.5s]">
                 <Sparkles className="h-80 w-80" />
              </div>
              <CardContent className="p-12 space-y-12 relative z-10">
                <div className="space-y-8">
                   <div className="p-5 bg-white/20 rounded-[2.5rem] backdrop-blur-2xl w-fit shadow-2xl border border-white/20"><Star className="h-10 w-10 fill-current" /></div>
                   <h3 className="text-5xl font-black uppercase tracking-tight leading-[0.85]">Neural <br/> Growth <span className="italic opacity-60">Hub.</span></h3>
                </div>
                <p className="text-2xl leading-tight font-black italic opacity-90 border-l-4 border-white/40 pl-8 uppercase tracking-tighter">
                  "Retention peak detected at 00:04. Recommending neon overlay protocol."
                </p>
                <Button variant="secondary" className="w-full h-24 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] gap-5 hover:scale-105 active:scale-95 transition-all shadow-2xl bg-white text-primary">
                  INTELLIGENCE NODE <Activity size={24} />
                </Button>
              </CardContent>
            </Card>

            <section className="space-y-10">
               <div className="flex items-center gap-6 px-6">
                 <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] shadow-2xl"><TrendingUp className="h-8 w-8 text-emerald-500" /></div>
                 <h3 className="text-2xl font-black tracking-tight uppercase text-white">Elite Insights</h3>
               </div>
               <div className="space-y-6">
                  {[
                    { text: "Viral Hook: Frame 01 must peak dopamine.", icon: Zap, color: "text-amber-500" },
                    { text: "Trending: 'Cyberpunk Retro' peaking in India.", icon: Sparkles, color: "text-primary" },
                    { text: "SEO Node: Use 5 niche tags for +40% reach.", icon: FileVideo, color: "text-emerald-500" }
                  ].map((tip, i) => (
                    <Card key={i} className="premium-card p-10 rounded-[2.5rem] group cursor-default border-white/5 hover:border-primary/40 bg-white/[0.02]">
                      <div className="flex items-center gap-8">
                        <div className={cn("p-4 rounded-2xl bg-black/40 group-hover:bg-white/5 transition-all shadow-inner border border-white/5", tip.color)}><tip.icon className="h-8 w-8 fill-current" /></div>
                        <p className="text-lg font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors text-white/80">{tip.text}</p>
                      </div>
                    </Card>
                  ))}
               </div>
               <Button variant="outline" className="w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] border-2 border-white/5 group hover:border-primary/40 transition-all" asChild>
                  <Link href="/support" className="flex items-center justify-center gap-4">
                    MARKETING LEDGER <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
               </Button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
