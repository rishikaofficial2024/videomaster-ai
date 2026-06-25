"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Video, Wand2, Sparkles, History, Play, 
  MoreVertical, Search, Star, Youtube, Instagram, 
  ChevronRight, Zap, ExternalLink, Upload, 
  CloudUpload, LayoutDashboard, Clock, FileVideo
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
    { name: "AI Script", icon: Wand2, desc: "Write viral scripts", href: "/ai-tools/script", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "YT Shorts", icon: Youtube, desc: "Create short videos", href: "/editor?mode=shorts", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { name: "Auto Caption", icon: Sparkles, desc: "Generate subtitles", href: "/editor?mode=caption", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { name: "Thumbnail", icon: Instagram, desc: "Design eye-catching art", href: "/ai-tools/thumbnail", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 mt-20">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 pt-4 border-b pb-12 border-border/50">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
               <Zap className="h-3 w-3" /> Creative Node Active
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">Studio <span className="text-primary italic">Hub.</span></h1>
            <p className="text-xl text-muted-foreground font-medium italic opacity-60">Welcome back, {user?.displayName?.split(' ')[0] || 'Creator'}. Let's build something viral.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
             <div className="relative flex-1 sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input placeholder="Search project registry..." className="h-16 pl-12 rounded-[1.5rem] bg-muted/30 border-none ring-1 ring-border group-focus-within:ring-2 group-focus-within:ring-primary transition-all text-base" />
             </div>
             <div className="flex gap-4">
                <Button asChild size="lg" variant="outline" className="rounded-[1.5rem] h-16 px-8 font-black uppercase tracking-widest text-[10px] gap-3 border-2 hover:bg-primary/5 transition-all">
                  <Link href="/editor">
                    <Upload className="h-5 w-5" /> Import Media
                  </Link>
                </Button>
                <Button asChild size="lg" className="rounded-[1.5rem] shadow-2xl shadow-primary/30 h-16 px-10 font-black uppercase tracking-widest text-[10px] gap-3 active:scale-95 transition-all">
                  <Link href="/editor">
                    <Plus className="h-5 w-5" /> New Project
                  </Link>
                </Button>
             </div>
          </div>
        </header>

        {/* Neural Quick Actions */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Neural Power Nodes</h2>
              <Link href="/ai-tools" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-2">Explore All Hubs <ChevronRight size={14} /></Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {quickTools.map((tool, i) => (
               <Link key={i} href={tool.href} className="group">
                 <Card className={cn("premium-card h-full border-2 border-transparent transition-all group-hover:border-primary/50 group-hover:bg-primary/[0.02] rounded-[2.5rem]", tool.border)}>
                   <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                     <div className={cn("p-6 rounded-3xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6", tool.bg, tool.color)}>
                       <tool.icon className="h-10 w-10" />
                     </div>
                     <div className="space-y-2">
                       <h3 className="text-2xl font-black uppercase tracking-tight">{tool.name}</h3>
                       <p className="text-[10px] font-black text-muted-foreground/60 leading-relaxed uppercase tracking-widest">{tool.desc}</p>
                     </div>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12 pt-8">
          {/* Recent Matrix Projects */}
          <section className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between border-b pb-8 border-border/50">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-muted rounded-[1.5rem] shadow-inner"><History className="h-8 w-8 text-primary" /></div>
                <div className="space-y-1">
                   <h2 className="text-4xl font-black tracking-tight uppercase leading-none">Recent <span className="text-primary italic">Matrix</span></h2>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Your synchronized creative versions</p>
                </div>
              </div>
              <Button variant="ghost" asChild className="rounded-full font-black text-[10px] uppercase tracking-widest px-6 hover:bg-primary/10">
                <Link href="/projects">Full Archive <ChevronRight size={16} className="ml-2" /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-10">
                {[1, 2].map(i => (
                  <div key={i} className="h-72 rounded-[2.5rem] bg-muted animate-pulse" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-10">
                {projects.map((project: any) => (
                  <Card key={project.id} className="group overflow-hidden rounded-[3rem] premium-card border-none ring-1 ring-border/50 shadow-2xl relative">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/800/450`} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        data-ai-hint="video preview"
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 gap-6 backdrop-blur-sm">
                         <div className="p-6 bg-white rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.2)] scale-50 group-hover:scale-100 transition-transform duration-500">
                            <Play className="h-10 w-10 text-primary fill-current ml-1" />
                         </div>
                         <span className="text-[10px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Restore Node</span>
                      </div>
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                         4K MASTER
                      </div>
                    </div>
                    <CardContent className="p-8 flex justify-between items-center bg-card">
                       <div className="space-y-2">
                          <h3 className="text-xl font-black truncate max-w-[200px] uppercase tracking-tight group-hover:text-primary transition-colors">{project.title || "Untitled Sequence"}</h3>
                          <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> 
                             {isClient ? (project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Active Now") : "Syncing..."}
                          </div>
                       </div>
                       <Button variant="ghost" size="icon" className="h-14 w-14 rounded-[1.2rem] hover:bg-primary/10 transition-all">
                         <MoreVertical className="h-7 w-7" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed bg-muted/10 h-[500px] flex flex-col items-center justify-center text-center p-16 rounded-[4rem] group hover:bg-muted/20 transition-all shadow-inner">
                <div className="bg-primary/10 p-10 rounded-[3rem] mb-10 group-hover:scale-110 transition-transform border-2 border-primary/20 shadow-2xl">
                  <CloudUpload className="h-20 w-20 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-black text-4xl mb-6 uppercase tracking-tight">Registry Node Idle</h3>
                <p className="text-xl text-muted-foreground max-w-sm mb-12 font-medium italic opacity-60">
                  The studio is awaiting your first vision. Import media or start a new sequence to begin.
                </p>
                <Button size="lg" asChild className="rounded-full h-20 px-16 font-black text-xl shadow-2xl shadow-primary/40 transition-all active:scale-95 group">
                  <Link href="/editor" className="flex items-center gap-4">
                    Open Master Studio <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            )}
          </section>

          {/* Neural Side Matrix */}
          <aside className="space-y-12">
            {/* AI Growth Intelligence */}
            <Card className="rounded-[4rem] border-none shadow-[0_40px_80px_-20px_rgba(0,112,243,0.4)] bg-primary text-primary-foreground overflow-hidden group relative">
              <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Sparkles className="h-64 w-64" />
              </div>
              <CardContent className="p-12 space-y-10 relative z-10">
                <div className="space-y-6">
                   <div className="p-4 bg-white/20 rounded-[1.8rem] backdrop-blur-md w-fit shadow-xl border border-white/20"><Star className="h-8 w-8 fill-current" /></div>
                   <h3 className="text-4xl font-black uppercase tracking-tight leading-[0.9]">Neural <br/> Growth <span className="italic opacity-60">Hub.</span></h3>
                </div>
                <p className="text-xl leading-relaxed font-medium italic opacity-90 border-l-4 border-white/20 pl-6">
                  "Dynamic captions detected: 40% retention boost projected for current vertical sequence."
                </p>
                <Button variant="secondary" className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-[10px] gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Access Intelligence Node <ChevronRight size={18} />
                </Button>
              </CardContent>
            </Card>

            {/* Elite Market Data */}
            <section className="space-y-8">
               <div className="flex items-center gap-6 px-4">
                 <div className="p-3 bg-emerald-500/10 rounded-[1rem] shadow-inner"><TrendingUp className="h-6 w-6 text-emerald-500" /></div>
                 <h3 className="text-xl font-black tracking-tight uppercase">Elite Insights</h3>
               </div>
               <div className="space-y-6">
                  {[
                    { text: "Viral Hook: Frame 01 must peak curiosity.", icon: Zap, color: "text-amber-500" },
                    { text: "Trending: 'Neural Aesthetics' peaking globally.", icon: Sparkles, color: "text-primary" },
                    { text: "SEO Node: Use 3 niche tags in description.", icon: FileVideo, color: "text-emerald-500" }
                  ].map((tip, i) => (
                    <Card key={i} className="premium-card p-8 rounded-[2rem] group cursor-default border-white/5 hover:border-primary/20 bg-white/[0.02]">
                      <div className="flex items-center gap-6">
                        <div className={cn("p-3 rounded-xl bg-muted group-hover:bg-background transition-all shadow-inner", tip.color)}><tip.icon className="h-6 w-6 fill-current" /></div>
                        <p className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{tip.text}</p>
                      </div>
                    </Card>
                  ))}
               </div>
               <Button variant="outline" className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[9px] border-2 border-border/50 group hover:border-primary/50" asChild>
                  <Link href="/support" className="flex items-center justify-center gap-3">
                    View Full Marketing Guide <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
               </Button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
