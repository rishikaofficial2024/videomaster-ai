"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Play, Sparkles, Wand2, History, ChevronRight, Loader2, Crown, Coins, Zap, MoreVertical } from "lucide-react";
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
      limit(6)
    );
  }, [db, user]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);
  const templates = PlaceHolderImages.filter(img => img.id.includes("template"));

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
    <div className="min-h-screen pb-24 md:pt-24 bg-background hero-gradient">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Welcome Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">
              Hello, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Creator'}!</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">Your creative studio is ready for magic.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-2xl border shadow-sm">
             <div className="flex flex-col px-4 border-r">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Credits</span>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-orange-500" />
                  <span className="text-xl font-bold font-headline">{profile?.credits ?? 0}</span>
                </div>
             </div>
             <Button className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20" asChild>
                <Link href="/editor"><Plus className="w-5 h-5 mr-1" /> Create New</Link>
             </Button>
          </div>
        </header>

        {/* Quick AI Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Wand2, label: "AI Video", href: "/editor?tool=gen", color: "text-purple-600 bg-purple-50", desc: "Veo 2.0 Generation" },
            { icon: Zap, label: "AI Captions", href: "/editor?tool=captions", color: "text-blue-600 bg-blue-50", desc: "Auto Transcribe" },
            { icon: Sparkles, label: "Magic SEO", href: "/editor?tool=optimization", color: "text-orange-600 bg-orange-50", desc: "Viral Optimizer" },
            { icon: Crown, label: "Upgrade", href: "/premium", color: "text-yellow-600 bg-yellow-50", desc: "Unlimited Credits" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group p-6 rounded-[2rem] bg-white border hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">{item.label}</h3>
              <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
            </Link>
          ))}
        </section>

        {/* Recent Studio */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Recent Projects</h2>
            <Link href="/projects" className="text-sm font-bold text-primary flex items-center hover:underline">
              View All Studio <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-56 bg-muted animate-pulse rounded-[2rem]" />)}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                  <Link href={`/editor?id=${project.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                          <Play className="w-6 h-6 text-primary fill-current" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-xs text-muted-foreground font-medium">{formatDate(project.updatedAt || project.createdAt)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-md border-2 border-dashed rounded-[3rem] p-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your Studio is Empty</h3>
              <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Ready to create your first viral masterpiece? The AI is waiting.</p>
              <Button className="rounded-2xl h-12 px-8 font-bold" asChild>
                <Link href="/editor">Launch Studio</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Pro Templates */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Inspiration Gallery</h2>
            <Link href="/templates" className="text-sm font-bold text-primary flex items-center hover:underline">
              Explore Templates <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.slice(0, 4).map((template) => (
              <Link key={template.id} href={`/editor?templateId=${template.id}`} className="relative aspect-[9/16] rounded-[2rem] overflow-hidden group shadow-md hover:shadow-xl transition-all">
                <Image
                  src={template.imageUrl}
                  alt={template.description}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold leading-tight">{template.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}