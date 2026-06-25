"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Video, Wand2, Sparkles, TrendingUp, History, Play, MoreVertical, Search, Star, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import Image from "next/image";

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
    { name: "AI Script", icon: Wand2, desc: "Write viral scripts", href: "/ai-tools/script", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "YT Shorts", icon: Youtube, desc: "Create short videos", href: "/editor?mode=shorts", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Auto Caption", icon: Sparkles, desc: "Generate subtitles", href: "/editor?mode=caption", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Thumbnail", icon: Instagram, desc: "Design eye-catching art", href: "/ai-tools/thumbnail", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back, {user?.displayName?.split(' ')[0] || 'Creator'}</h1>
            <p className="text-muted-foreground">Ready to create your next viral masterpiece?</p>
          </div>
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 h-14 px-8">
            <Link href="/editor">
              <Plus className="mr-2 h-5 w-5" /> Create New Project
            </Link>
          </Button>
        </header>

        {/* Quick Tools Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickTools.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <Card className="hover:shadow-md transition-all group cursor-pointer border-none shadow-sm overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className={`p-4 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Projects */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                Recent Projects
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/projects" className="text-sm font-medium">View All</Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project: any) => (
                  <Card key={project.id} className="overflow-hidden border-none shadow-sm group">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={project.thumbnailUrl || "https://picsum.photos/seed/editor/400/225"} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint="video thumbnail"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="icon" className="rounded-full bg-white text-primary hover:bg-white/90">
                           <Play className="h-5 w-5 fill-current" />
                         </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 flex justify-between items-center bg-card">
                       <div className="space-y-0.5">
                          <h3 className="font-bold truncate max-w-[200px]">{project.title || "Untitled Project"}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Modified Yesterday</p>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed bg-transparent h-64 flex flex-col items-center justify-center text-center p-8 rounded-3xl">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <Video className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
                <h3 className="font-bold text-lg">No projects yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs mb-6">
                  Start your creative journey by making your first video project.
                </p>
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/editor">New Masterpiece</Link>
                </Button>
              </Card>
            )}
          </section>

          {/* Side Panels */}
          <aside className="space-y-10">
            {/* AI Assistant */}
            <Card className="rounded-3xl border-none shadow-md bg-primary text-primary-foreground overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">Your personal design partner</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-sm leading-relaxed opacity-90">
                  "I can help you write scripts, optimize for SEO, or suggest better transitions for your vlog."
                </p>
                <Button variant="secondary" className="w-full rounded-full font-bold">
                  Ask AI Anything
                </Button>
              </CardContent>
            </Card>

            {/* Growth Stats / Tips */}
            <section className="space-y-4">
               <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                 <TrendingUp className="h-4 w-4 text-primary" />
                 Growth Tips
               </h3>
               <div className="space-y-3">
                  {[
                    { text: "Add captions to your Shorts for 40% higher retention.", icon: Star },
                    { text: "Use trending audio loops for better Instagram Reels reach.", icon: Star },
                    { text: "High-contrast thumbnails get 3x more clicks.", icon: Star }
                  ].map((tip, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-2xl">
                      <CardContent className="p-4 flex items-center gap-3">
                        <tip.icon className="h-4 w-4 text-yellow-500 shrink-0" />
                        <p className="text-xs font-medium leading-tight">{tip.text}</p>
                      </CardContent>
                    </Card>
                  ))}
               </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}