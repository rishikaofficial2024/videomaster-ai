
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Play, Sparkles, Wand2, History, ChevronRight, Loader2, Crown, Coins, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";

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
      limit(5)
    );
  }, [db, user]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);
  const templates = PlaceHolderImages.filter(img => img.id.includes("template"));

  const [clientDate, setClientDate] = useState<string>("");

  useEffect(() => {
    setClientDate(new Date().toLocaleDateString());
  }, []);

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
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Mobile Header Card */}
        <section className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium">Welcome back,</p>
              <h1 className="text-3xl font-headline font-bold">{user?.displayName?.split(' ')[0] || 'Creator'}</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Credits</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-xl font-bold font-headline">{profile?.credits ?? 0}</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Status</span>
                <div className="flex items-center gap-1">
                  {profile?.isPremium ? (
                    <span className="flex items-center gap-1 text-sm font-bold bg-white/20 px-2 py-0.5 rounded-full"><Crown className="w-3 h-3" /> PRO</span>
                  ) : (
                    <span className="text-sm font-bold">Standard</span>
                  )}
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl h-14 font-bold gap-2 mt-2" asChild>
              <Link href="/editor">
                <Plus className="w-5 h-5" /> New Project
              </Link>
            </Button>
          </div>
        </section>

        {/* AI Quick Tools */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card border-none shadow-sm" asChild>
            <Link href="/editor?tool=captions">
              <Zap className="text-primary w-6 h-6" />
              <span className="text-xs font-bold text-foreground">AI Captions</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card border-none shadow-sm" asChild>
             <Link href="/editor?tool=optimization">
              <Sparkles className="text-accent w-6 h-6" />
              <span className="text-xs font-bold text-foreground">Magic SEO</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card border-none shadow-sm" asChild>
            <Link href="/projects">
              <Play className="text-green-500 w-6 h-6" />
              <span className="text-xs font-bold text-foreground">My Videos</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card border-none shadow-sm" asChild>
            <Link href="/premium">
              <Crown className="text-orange-400 w-6 h-6" />
              <span className="text-xs font-bold text-foreground">Upgrade</span>
            </Link>
          </Button>
        </section>

        {/* Recent Projects */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-headline font-bold text-foreground">Recent Studio</h2>
            <Link href="/projects" className="text-sm text-primary font-bold flex items-center gap-1">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="flex gap-4 py-4 overflow-x-auto">
              {[1, 2].map(i => <div key={i} className="min-w-[280px] h-48 bg-muted animate-pulse rounded-3xl" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {projects.map((project: any) => (
                <Card key={project.id} className="min-w-[280px] group cursor-pointer overflow-hidden border-none shadow-lg bg-card/50 rounded-3xl">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white fill-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-bold truncate text-foreground">{project.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(project.updatedAt || project.createdAt)}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card/30 border-2 border-dashed border-muted rounded-3xl p-12 text-center">
              <p className="text-muted-foreground mb-4">Your studio is empty. Ready to create?</p>
              <Button variant="secondary" className="rounded-xl font-bold" asChild>
                <Link href="/editor">Launch Studio</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Templates */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-headline font-bold text-foreground">Pro Templates</h2>
            <Link href="/templates" className="text-sm text-primary font-bold flex items-center gap-1">
              More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.slice(0, 4).map((template) => (
              <div key={template.id} className="relative aspect-[9/16] rounded-3xl overflow-hidden group shadow-md">
                <Image
                  src={template.imageUrl}
                  alt={template.description}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-bold line-clamp-1">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
