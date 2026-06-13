
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Play, Star, ChevronRight, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useMemo } from "react";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const templates = PlaceHolderImages.filter(img => img.id.includes("template"));

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => 
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [templates, search]);

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Video Templates</h1>
            <p className="text-muted-foreground">Choose a starter and add your magic</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates (e.g. vlog, gaming)..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group relative aspect-[9/16] rounded-2xl overflow-hidden border-none shadow-xl cursor-pointer">
              <Link href={`/editor?templateId=${template.id}`}>
                <Image
                  src={template.imageUrl}
                  alt={template.description}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  data-ai-hint={template.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm line-clamp-2">{template.description}</h3>
                  <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/70 uppercase font-bold tracking-widest">Use Template</span>
                    <div className="bg-primary p-2 rounded-full text-white">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </section>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No templates found</h3>
            <p className="text-muted-foreground">Try searching for something else like "vlog" or "action".</p>
          </div>
        )}
      </main>
    </div>
  );
}
