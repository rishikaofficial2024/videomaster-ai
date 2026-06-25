"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Sparkles, Loader2, Download, Wand2, Youtube, Eye, MousePointer2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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
      toast({ title: "Masterpiece Rendered!", description: "Your 4K thumbnail is ready." });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 mt-10 space-y-12">
        <header className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 rounded-full text-pink-600 font-bold text-xs uppercase tracking-widest">
              <ImageIcon className="h-3.5 w-3.5" /> Visual Design Node
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">AI Thumbnail Designer</h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Stop wasting hours in Photoshop. Create high-CTR thumbnails using professional AI presets.
           </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Sidebar controls */}
           <div className="space-y-6">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                 <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-lg">Design Board</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Configure visual style</CardDescription>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Video Context</label>
                       <Input 
                        placeholder="What is your video about?" 
                        value={prompt}
                        onChange={(e) => setTopic(e.target.value)}
                        className="rounded-xl h-12"
                       />
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Art Style</label>
                       <div className="grid grid-cols-2 gap-3">
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
                                "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1.5",
                                style === s.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-muted hover:border-muted-foreground/30"
                              )}
                            >
                               <s.icon className={cn("h-4 w-4", style === s.id ? "text-primary" : "text-muted-foreground")} />
                               <span className={cn("text-[10px] font-bold uppercase", style === s.id ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    <Button 
                      className="w-full h-14 rounded-full font-black text-lg gap-2 shadow-xl shadow-primary/20" 
                      disabled={isGenerating || !prompt}
                      onClick={handleGenerate}
                    >
                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                       Render 4K Art
                    </Button>
                 </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-md bg-muted/50 p-6 space-y-3">
                 <h4 className="font-bold flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> Pro Tips</h4>
                 <ul className="text-xs space-y-2 text-muted-foreground font-medium">
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" /> Use bright colors for YouTube.</li>
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" /> Keep text minimal (3-5 words).</li>
                    <li className="flex gap-2"><div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" /> Faces with emotion get more clicks.</li>
                 </ul>
              </Card>
           </div>

           {/* Preview Area */}
           <div className="lg:col-span-2">
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-card min-h-[500px] flex flex-col">
                 <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="h-3 w-3 rounded-full bg-red-500" />
                       <div className="h-3 w-3 rounded-full bg-yellow-500" />
                       <div className="h-3 w-3 rounded-full bg-green-500" />
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Preview Workspace</span>
                    </div>
                    {imageUrl && (
                      <Button variant="outline" size="sm" className="rounded-full font-bold gap-2">
                         <Download className="h-4 w-4" /> Download 4K
                      </Button>
                    )}
                 </div>
                 <CardContent className="p-10 flex-1 flex items-center justify-center bg-muted/30">
                    {isGenerating ? (
                      <div className="text-center space-y-6">
                         <div className="relative mx-auto w-20 h-20">
                            <Loader2 className="w-full h-full animate-spin text-primary" />
                            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse scale-150"></div>
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Applying Visual Neural</h3>
                            <p className="text-muted-foreground italic text-sm">Enhancing contrast and composition...</p>
                         </div>
                      </div>
                    ) : imageUrl ? (
                      <div className="space-y-8 w-full max-w-2xl animate-in zoom-in-95 duration-500">
                         <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                            <Image 
                              src={imageUrl} 
                              alt="Generated Thumbnail" 
                              fill 
                              className="object-cover"
                              data-ai-hint="video thumbnail"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                               <Button variant="secondary" className="rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all font-bold scale-90 group-hover:scale-100">
                                  <MousePointer2 className="mr-2 h-4 w-4" /> Refine Composition
                               </Button>
                            </div>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            <Button variant="outline" className="h-20 rounded-2xl flex flex-col gap-1.5"><Sparkles className="h-4 w-4" /><span className="text-[10px] uppercase font-bold">Auto-Enhance</span></Button>
                            <Button variant="outline" className="h-20 rounded-2xl flex flex-col gap-1.5"><Youtube className="h-4 w-4" /><span className="text-[10px] uppercase font-bold">Add YT UI</span></Button>
                            <Button variant="outline" className="h-20 rounded-2xl flex flex-col gap-1.5"><ImageIcon className="h-4 w-4" /><span className="text-[10px] uppercase font-bold">Change Style</span></Button>
                         </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-6 opacity-10 py-32">
                         <ImageIcon className="w-32 h-32 mx-auto" />
                         <p className="text-xl font-black uppercase tracking-[0.5em]">Awaiting Generation</p>
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

import { cn } from "@/lib/utils";