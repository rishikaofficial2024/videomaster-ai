
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Play, Sparkles, Wand2, History, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Dashboard() {
  const templates = PlaceHolderImages.filter(img => img.id.includes("template"));

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Hello, Creator!</h1>
            <p className="text-muted-foreground">What will you create today?</p>
          </div>
          <Button size="lg" className="rounded-full px-8 h-12 gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href="/editor">
              <Plus className="w-5 h-5" /> New Project
            </Link>
          </Button>
        </div>

        {/* AI Quick Tools */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50">
            <Wand2 className="text-primary w-6 h-6" />
            <span className="text-xs font-semibold">Auto Captions</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50">
            <Sparkles className="text-accent w-6 h-6" />
            <span className="text-xs font-semibold">AI Hashtags</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50">
            <Play className="text-green-500 w-6 h-6" />
            <span className="text-xs font-semibold">Quick Export</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl bg-card/50">
            <History className="text-orange-400 w-6 h-6" />
            <span className="text-xs font-semibold">History</span>
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
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="min-w-[280px] group cursor-pointer overflow-hidden border-none shadow-md">
                <div className="aspect-video relative">
                  <Image
                    src={`https://picsum.photos/seed/project-${i}/600/400`}
                    alt="Project"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium">My Awesome Vlog #{i}</p>
                  <p className="text-xs text-muted-foreground">Edited 2 hours ago</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
