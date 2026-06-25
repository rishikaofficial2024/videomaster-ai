
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Sparkles, Loader2, Download, Wand2, Youtube, Eye, MousePointer2, Info, ArrowLeft, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AiThumbnailMaker() {
  const [prompt, setTopic] = useState("");
  const [style, setStyle] = useState("high-contrast");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    // Simulate AI Image Generation
    setTimeout(() => {
      setImageUrl(`https://picsum.photos/seed/${Math.random()}/1280/720`);
      setIsGenerating(false);
      toast({ title: "Masterpiece Rendered", description: "High-CTR visual node is ready for broadcast." });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#03010a] hero-gradient pb-32">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 mt-32 space-y-20">
        <header className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em] group">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/40 transition-all border border-transparent shadow-xl">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Neural Hub
           </Link>
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl">
                 <ImageIcon className="h-4 w-4" /> VISUAL DESIGN NODE
              </div>
              <h1 className="text-6xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">Art <span className="text-primary italic">Logic.</span></h1>
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto italic font-medium opacity-60 leading-relaxed">
                Generate click-worthy 4K visual assets powered by Imagen 4.0 Pro.
              </p>
           </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-12 pt-10">
           {/* Controls Node */}
           <div className="space-y-8">
              <Card className="border-white/5 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] overflow-hidden shadow-2xl blue-glow">
                 <CardHeader className="bg-primary p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                       <Zap size={80} className="text-white" />
                    </div>
                    <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight text-white relative z-10">Design Matrix</CardTitle>
                    <CardDescription className="text-lg font-bold text-white/60 italic relative z-10 uppercase tracking-widest">Visual Configuration</CardDescription>
                 </CardHeader>
                 <CardContent className="p-12 space-y-12">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Context Ingestion</label>
                       <Input 
                        placeholder="Visual description..." 
                        value={prompt}
                        onChange={(e) => setTopic(e.target.value)}
                        className="rounded-[1.5rem] h-20 bg-black/40 border-white/10 text-xl px-8 focus:border-primary/50 transition-all font-medium shadow-inner"
                       />
                    </div>

                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Art Protocol</label>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'high-contrast', label: 'Viral High-C', icon: Sparkles },
                            { id: 'minimalist', label: 'Clean/Apple', icon: Youtube },
                            { id: 'gaming', label: 'Neon/Gaming', icon: Wand2 },
                            { id: 'vlog', label: 'Blogger/Soft', icon: Eye }
                          ].map(s => (
                            <button 
                              key={s.id}
                              onClick={() => setStyle(s.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all gap-3 shadow-xl",
                                style === s.id ? "border-primary bg-primary/10 ring-4 ring-primary/10" : "border-white/5 bg-white/5 hover:border-white/20"
                              )}
                            >
                               <s.icon className={cn("h-6 w-6", style === s.id ? "text-primary" : "text-muted-foreground")} />
                               <span className={cn("text-[9px] font-black uppercase tracking-widest", style === s.id ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    <Button 
                      className="w-full h-24 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/40 gap-6 group active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white" 
                      disabled={isGenerating || !prompt}
                      onClick={handleGenerate}
                    >
                       {isGenerating ? <Loader2 className="h-8 w-8 animate-spin" /> : <Sparkles className="h-8 w-8 animate-pulse" />}
                       RENDER 4K
                    </Button>
                 </CardContent>
              </Card>

              <Card className="rounded-[3rem] border-white/5 bg-white/[0.02] p-10 space-y-6 shadow-2xl">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4 text-primary">
                   <Info className="h-5 w-5" /> PRO TIPS
                 </h4>
                 <ul className="text-sm space-y-4 text-muted-foreground font-medium italic">
                    <li className="flex gap-4"><div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 shadow-glow" /> High contrast Boosts CTR by +12%.</li>
                    <li className="flex gap-4"><div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 shadow-glow" /> Faces with emotion trigger dopamine nodes.</li>
                    <li className="flex gap-4"><div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 shadow-glow" /> Keep text layers under 5 words.</li>
                 </ul>
              </Card>
           </div>

           {/* Preview Node */}
           <div className="lg:col-span-2">
              <Card className="border-white/5 shadow-2xl rounded-[5rem] overflow-hidden bg-[#0a0d14]/80 backdrop-blur-3xl min-h-[700px] flex flex-col relative">
                 <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                       <div className="flex gap-2">
                          <div className="h-3.5 w-3.5 rounded-full bg-rose-500/40" />
                          <div className="h-3.5 w-3.5 rounded-full bg-amber-500/40" />
                          <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/40" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-6 opacity-40">MASTER_VIEWPORT_v04</span>
                    </div>
                    {imageUrl && (
                      <Button variant="outline" size="sm" className="rounded-full h-12 px-8 font-black uppercase tracking-[0.3em] text-[10px] gap-3 bg-white/5 border-white/10 hover:bg-white/10 transition-all shadow-xl">
                         <Download className="h-4 w-4 text-emerald-500" /> DOWNLOAD 4K
                      </Button>
                    )}
                 </div>
                 <CardContent className="p-16 flex-1 flex items-center justify-center bg-black/20">
                    {isGenerating ? (
                      <div className="text-center space-y-10">
                         <div className="relative mx-auto w-32 h-32">
                            <Loader2 className="w-full h-full animate-spin text-primary" />
                            <div className="absolute inset-0 blur-[80px] bg-primary/20 rounded-full animate-pulse scale-150"></div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-4xl font-black uppercase tracking-tight text-white">Visual Synthesis...</h3>
                            <p className="text-xl text-muted-foreground italic font-medium">Enhancing composition and neural lighting.</p>
                         </div>
                      </div>
                    ) : imageUrl ? (
                      <div className="space-y-12 w-full animate-in zoom-in-95 duration-1000">
                         <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)] border-8 border-white/5 group ring-1 ring-white/10">
                            <Image 
                              src={imageUrl} 
                              alt="Generated Visual Node" 
                              fill 
                              className="object-cover transition-all duration-2s group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700 flex items-center justify-center">
                               <Button variant="secondary" className="rounded-[1.5rem] h-20 px-12 shadow-2xl opacity-0 group-hover:opacity-100 transition-all font-black uppercase tracking-widest text-[11px] scale-90 group-hover:scale-100 bg-white text-primary">
                                  <MousePointer2 className="mr-3 h-6 w-6" /> REFINE COMPOSITION
                               </Button>
                            </div>
                         </div>
                         <div className="grid grid-cols-3 gap-6">
                            <Button variant="outline" className="h-28 rounded-[2.5rem] flex flex-col gap-4 font-black uppercase tracking-widest text-[9px] bg-white/5 border-white/10 hover:bg-white/10 transition-all"><Sparkles className="h-5 w-5 text-primary" /> ENHANCE</Button>
                            <Button variant="outline" className="h-28 rounded-[2.5rem] flex flex-col gap-4 font-black uppercase tracking-widest text-[9px] bg-white/5 border-white/10 hover:bg-white/10 transition-all"><Youtube className="h-5 w-5 text-rose-500" /> YT PREVIEW</Button>
                            <Button variant="outline" className="h-28 rounded-[2.5rem] flex flex-col gap-4 font-black uppercase tracking-widest text-[9px] bg-white/5 border-white/10 hover:bg-white/10 transition-all"><ImageIcon className="h-5 w-5 text-blue-500" /> VARIATIONS</Button>
                         </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-10 opacity-10 py-40">
                         <ImageIcon className="w-52 h-52 mx-auto text-primary" />
                         <p className="text-3xl font-black uppercase tracking-[0.8em] text-white">Registry Idle</p>
                      </div>
                    )}
                 </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
