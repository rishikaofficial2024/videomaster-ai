
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Play, Sparkles, Wand2, History, ChevronRight, Loader2, Crown, Coins, Zap, MoreVertical, Video, ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

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
    <div className="min-h-screen pb-32 md:pt-32 bg-background hero-gradient">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-16">
        
        {/* Diagnostic & Onboarding Alert */}
        <div className="flex items-center justify-between px-6 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-yellow-500" />
            <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
              System Ready? Check your AI & Cloud connection here:
            </p>
          </div>
          <Button variant="link" size="sm" className="text-yellow-600 font-bold p-0 h-auto" asChild>
            <Link href="/test-connection">Run Diagnostics <ChevronRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        {/* Monetization / Credits Bar */}
        {!profile?.isPremium && (
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl blue-glow">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                   <Crown className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-bold">Unlock Pro Power</h3>
                   <p className="text-sm text-muted-foreground font-medium">Upgrade to Pro for unlimited AI and 4K exports.</p>
                </div>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-48 space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>Credits Used</span>
                      <span>{profile?.credits ?? 0} / 100 Left</span>
                   </div>
                   <Progress value={profile?.credits ?? 0} className="h-2" />
                </div>
                <Button className="rounded-xl font-bold h-12 px-8" asChild>
                   <Link href="/premium">Upgrade <ArrowUpRight className="ml-2 w-4 h-4" /></Link>
                </Button>
             </div>
          </div>
        )}

        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit">
               <Sparkles className="w-3 h-3 text-primary" />
               <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                 {profile?.subscriptionPlan === 'pro' ? 'PRO STUDIO' : 'BASIC WORKSPACE'}
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Ready to create, <span className="text-primary italic">{user?.displayName?.split(' ')[0] || 'Creator'}?</span>
            </h1>
            <p className="text-muted-foreground font-medium text-xl">Your AI-powered video studio is waiting for magic.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-background/80 backdrop-blur-xl p-3 rounded-3xl border shadow-xl blue-glow">
             <div className="flex flex-col px-6 border-r border-primary/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">AI Credits</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold font-headline">
                    {profile?.isPremium ? '∞' : (profile?.credits ?? 0)}
                  </span>
                </div>
             </div>
             <Button className="rounded-2xl h-14 font-bold px-8 shadow-2xl shadow-primary/30 transition-all hover:scale-105" asChild>
                <Link href="/editor"><Plus className="w-6 h-6 mr-2" /> Start Project</Link>
             </Button>
          </div>
        </header>

        {/* Quick AI Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Wand2, label: "AI Video", href: "/editor?tool=gen", color: "text-blue-600 bg-blue-50", desc: "Veo 2.0 Generation" },
            { icon: Zap, label: "AI Captions", href: "/editor?tool=captions", color: "text-cyan-600 bg-cyan-50", desc: "Auto Transcribe" },
            { icon: Sparkles, label: "Magic SEO", href: "/editor?tool=optimization", color: "text-indigo-600 bg-indigo-50", desc: "Viral Optimizer" },
            { icon: Crown, label: "Go Pro", href: "/premium", color: "text-primary bg-primary/10", desc: "Monetize Content" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group p-8 rounded-[2.5rem] bg-background border-2 border-primary/5 hover:border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 blue-glow">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${item.color} shadow-sm`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-1">{item.label}</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">{item.desc}</p>
            </Link>
          ))}
        </section>

        {/* Recent Studio */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <h2 className="text-3xl font-headline font-bold tracking-tight">Recent Projects</h2>
               <p className="text-muted-foreground font-medium">Continue where you left off</p>
            </div>
            <Link href="/projects" className="text-sm font-bold text-primary flex items-center hover:underline bg-background px-4 py-2 rounded-full border shadow-sm">
              All Projects <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-background animate-pulse rounded-[2.5rem] border" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden rounded-[2.5rem] border-primary/5 bg-background shadow-xl hover:shadow-2xl transition-all duration-500 blue-glow">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90">
                          <Play className="w-8 h-8 text-primary fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{formatDate(project.updatedAt || project.createdAt)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary"><MoreVertical className="w-5 h-5" /></Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-background/40 backdrop-blur-xl border-4 border-dashed border-primary/20 rounded-[4rem] p-24 text-center blue-glow">
              <div className="w-24 h-24 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Video className="w-12 h-12 text-primary opacity-30" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Your Studio is Empty</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg">The AI is ready to transform your raw footage into cinematic gold. Let's start!</p>
              <Button className="rounded-2xl h-16 px-12 font-bold text-lg shadow-2xl shadow-primary/30" asChild>
                <Link href="/editor">Launch New Project</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
