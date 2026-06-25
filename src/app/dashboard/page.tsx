"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Video, Wand2, Sparkles, TrendingUp, History, Play, MoreVertical, Search, Star, Youtube, Instagram, ChevronRight, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-4 border-b pb-10 border-border/50">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
               <Zap className="h-3 w-3" /> Production Node Active
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-none">Welcome Back, {user?.displayName?.split(' ')[0] || 'Creator'}</h1>
            <p className="text-xl text-muted-foreground font-medium italic opacity-60">Ready to engineer your next viral masterpiece?</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <Input placeholder="Search your assets..." className="h-14 pl-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border group-focus-within:ring-2 group-focus-within:ring-primary transition-all" />
            </div>
            <Button asChild size="lg" className="rounded-2xl shadow-2xl shadow-primary/30 h-14 px-10 font-black uppercase tracking-widest text-xs gap-3 active:scale-95 transition-all">
              <Link href="/editor">
                <Plus className="h-5 w-5" /> New Project
              </Link>
            </Button>
          </div>
        </header>

        {/* Quick Tools Grid */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">Neural Power Tools</h2>
              <Link href="/ai-tools" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Browse All Hubs <ChevronRight size={14} /></Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {quickTools.map((tool, i) => (
               <Link key={i} href={tool.href} className="group">
                 <Card className={cn("premium-card h-full border-2 border-transparent transition-all group-hover:border-primary/50 group-hover:bg-primary/[0.02]", tool.border)}>
                   <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                     <div className={cn("p-5 rounded-3xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6", tool.bg, tool.color)}>
                       <tool.icon className="h-10 w-10" />
                     </div>
                     <div className="space-y-2">
                       <h3 className="text-xl font-black uppercase tracking-tight">{tool.name}</h3>
                       <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">{tool.desc}</p>
                     </div>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12 pt-8">
          {/* Recent Projects */}
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b pb-6 border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-xl"><History className="h-6 w-6 text-primary" /></div>
                <h2 className="text-3xl font-black tracking-tight">Recent <span className="text-primary italic">Projects</span></h2>
              </div>
              <Button variant="ghost" asChild className="rounded-full font-bold">
                <Link href="/projects">View Archive <ChevronRight size={16} /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                  <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project: any) => (
                  <Card key={project.id} className="group overflow-hidden rounded-[2rem] premium-card border-none ring-1 ring-border/50">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="video preview"
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 gap-4">
                         <div className="p-4 bg-white rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                            <Play className="h-8 w-8 text-primary fill-current ml-1" />
                         </div>
                         <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Continue Editing</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                         4K Ready
                      </div>
                    </div>
                    <CardContent className="p-6 flex justify-between items-center bg-card">
                       <div className="space-y-1">
                          <h3 className="text-lg font-black truncate max-w-[200px] uppercase tracking-tight group-hover:text-primary transition-colors">{project.title || "Untitled Masterpiece"}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Modified Yesterday
                          </p>
                       </div>
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 transition-all">
                         <MoreVertical className="h-6 w-6" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed bg-muted/10 h-[400px] flex flex-col items-center justify-center text-center p-12 rounded-[3rem] group hover:bg-muted/20 transition-all">
                <div className="bg-primary/10 p-8 rounded-full mb-8 group-hover:scale-110 transition-transform">
                  <Video className="h-16 w-16 text-primary opacity-40" />
                </div>
                <h3 className="font-black text-3xl mb-4">Awaiting Your First Vision</h3>
                <p className="text-muted-foreground text-lg max-w-xs mb-10 font-medium italic">
                  The studio is idle. Start your creative journey by establishing your first project node.
                </p>
                <Button size="lg" asChild className="rounded-full h-16 px-12 font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
                  <Link href="/editor">Open Master Studio</Link>
                </Button>
              </Card>
            )}
          </section>

          {/* Side Panels */}
          <aside className="space-y-12">
            {/* AI Assistant Card */}
            <Card className="rounded-[3rem] border-none shadow-[0_30px_60px_-15px_rgba(0,112,243,0.3)] bg-primary text-primary-foreground overflow-hidden group relative">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Sparkles className="h-48 w-48" />
              </div>
              <CardHeader className="p-10 pb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><Star className="h-6 w-6 fill-current" /></div>
                   <CardTitle className="text-3xl font-black uppercase tracking-tight leading-none">Neural <br/> Growth Assistant</CardTitle>
                </div>
                <CardDescription className="text-primary-foreground/70 text-lg font-medium italic">Your personalized AI content strategist.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8 relative z-10">
                <p className="text-lg leading-relaxed font-medium opacity-90">
                  "Add dynamic captions to your current project. Data shows a **40% increase** in viewer retention for vertical formats."
                </p>
                <Button variant="secondary" className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-xs gap-3 hover:scale-105 transition-all">
                  Access Neural Hub <ChevronRight size={18} />
                </Button>
              </CardContent>
            </Card>

            {/* Growth Stats / Tips */}
            <section className="space-y-6">
               <div className="flex items-center gap-4 px-2">
                 <div className="p-2 bg-emerald-500/10 rounded-xl"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
                 <h3 className="text-xl font-black tracking-tight uppercase">Elite Insights</h3>
               </div>
               <div className="space-y-4">
                  {[
                    { text: "Viral Hook: Start with a question to peak curiosity.", icon: Star, color: "text-amber-500" },
                    { text: "Trending: 'Cyberpunk Aesthetic' is peaking on Reels.", icon: Star, color: "text-primary" },
                    { text: "SEO Tip: Use 3 niche-specific hashtags in your desc.", icon: Star, color: "text-emerald-500" }
                  ].map((tip, i) => (
                    <Card key={i} className="premium-card p-6 rounded-2xl group cursor-default">
                      <div className="flex items-center gap-5">
                        <div className={cn("p-2 rounded-lg bg-muted group-hover:bg-background transition-colors", tip.color)}><tip.icon className="h-5 w-5 fill-current" /></div>
                        <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{tip.text}</p>
                      </div>
                    </Card>
                  ))}
               </div>
               <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-2 border-border/50 group" asChild>
                  <Link href="/support" className="flex items-center justify-center gap-2">
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
