
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Play, Star, Filter, LayoutTemplate, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const templates = useMemo(() => PlaceHolderImages.filter(img => img.id.includes("template")), []);

  const categories = [
    { id: "all", label: "All" },
    { id: "vlog", label: "Vlog" },
    { id: "gaming", label: "Gaming" },
    { id: "business", label: "Business" },
    { id: "tech", label: "Tech" },
    { id: "food", label: "Food" },
    { id: "fashion", label: "Fashion" },
    { id: "travel", label: "Travel" },
    { id: "fitness", label: "Fitness" },
    { id: "luxury", label: "Luxury" },
    { id: "action", label: "Action" },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || t.id.includes(`template-${activeCategory}`);
      return matchesSearch && matchesCategory;
    });
  }, [templates, search, activeCategory]);

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Assets</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Video <span className="text-primary italic">Templates</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium italic opacity-60">100+ high-fidelity starters for viral dominance.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search templates..." 
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 text-white" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-2xl">
               <div className="flex flex-col px-4 border-r border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold font-headline text-primary">{templates.length}</span>
               </div>
               <LayoutTemplate className="w-8 h-8 text-primary/40" />
            </div>
          </div>
        </header>

        {/* 🏷️ CATEGORY FILTER */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                activeCategory === cat.id 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group relative aspect-[9/16] rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-2xl cursor-pointer hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]">
              <Link href={`/editor?templateId=${template.id}`} className="block h-full">
                <Image
                  src={template.imageUrl}
                  alt={template.description}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-1000 opacity-60"
                  data-ai-hint={template.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-1 mb-4 opacity-40">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight line-clamp-2 mb-6 group-hover:text-primary transition-colors">{template.description}</h3>
                  <div className="flex items-center justify-between mt-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Launch Studio</span>
                    <div className="bg-primary p-3 rounded-2xl text-white shadow-xl shadow-primary/40">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </section>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-40 bg-white/[0.005] rounded-[5rem] border-2 border-dashed border-white/10 space-y-8">
            <Search className="w-20 h-20 text-muted-foreground mx-auto opacity-20" />
            <div className="space-y-2">
               <h3 className="text-3xl font-bold text-white uppercase tracking-tight">No Templates Detected</h3>
               <p className="text-muted-foreground italic text-lg">Try adjusting your category or search protocol.</p>
            </div>
            <Button variant="outline" className="h-14 px-10 rounded-2xl" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
               Reset Protocols
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
