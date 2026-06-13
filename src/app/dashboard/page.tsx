
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Play, Sparkles, Wand2, History, ChevronRight, Loader2, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useMemo } from "react";

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

  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Hello, {user?.displayName?.split(' ')[0] || 'Creator'}!</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">Credits: {profile?.credits ?? 0}</p>
              {profile?.isPremium && (
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
          </div>
          <Button size="lg" className="rounded-full px-8 h-12 gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href="/editor">
              <Plus className="w-5 h-5" /> New Project
            </Link>
          </Button>
        </div>

        {/* AI Quick Tools */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50" asChild>
            <Link href="/editor?tool=captions">
              <Wand2 className="text-primary w-6 h-6" />
              <span className="text-xs font-semibold">Auto Captions</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50" asChild>
             <Link href="/editor?tool=optimization">
              <Sparkles className="text-accent w-6 h-6" />
              <span className="text-xs font-semibold">AI Hashtags</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50" asChild>
            <Link href="/projects">
              <Play className="text-green-500 w-6 h-6" />
              <span className="text-xs font-semibold">My Videos</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50" asChild>
            <Link href="/premium">
              <History className="text-orange-400 w-6 h-6" />
              <span className="text-xs font-semibold">Upgrade</span>
            </Link>
          </Button>
        </section>

        {/* Recent Projects */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-headline font-bold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="flex gap-4 py-4 overflow-x-auto">
              {[1, 2].map(i => <div key={i} className="min-w-[280px] h-48 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {projects.map((project: any) => (
                <Card key={project.id} className="min-w-[280px] group cursor-pointer overflow-hidden border-none shadow-md">
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
                    <CardContent className="p-3">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt?.seconds * 1000 || project.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card/50 border-2 border-dashed border-muted rounded-2xl p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any projects yet.</p>
              <Button variant="secondary" asChild>
                <Link href="/editor">Start your first project</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Templates */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-headline font-bold">Trending Templates</h2>
            <Link href="/templates" className="text-sm text-primary flex items-center gap-1">
              Explore <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden group">
                <Image
                  src={template.imageUrl}
                  alt={template.description}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-semibold line-clamp-1">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
