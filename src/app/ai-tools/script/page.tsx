"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wand2, Sparkles, Youtube, Instagram, Loader2, Copy, Check, MessageSquare, ArrowLeft, Send, Zap, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AiScriptWriter() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [tone, setTone] = useState("energetic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setScript(`[INTRO]\nHey guys, welcome back! Today we're decoding the viral potential of ${topic}.\n\n[HOOK]\nDid you know that most creators ignore the neural core of ${topic}? Let's fix that protocol right now.\n\n[BODY]\nStep 1: Frame the narrative around high-dopamine triggers.\nStep 2: Use rapid-cut editing nodes for +40% retention.\n\n[OUTRO]\nSubscribe for more elite ${topic} intelligence. Sync with you in the next one.`);
      setIsGenerating(false);
      toast({ title: "Narrative Sync Complete", description: "Your viral script node is ready for ingestion." });
    }, 2500);
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Buffer Updated", description: "Script copied to local clipboard node." });
    }
  };

  return (
    <div className="min-h-screen bg-[#03010a] hero-gradient pb-32">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 mt-32 space-y-16">
        <header className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em] group">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/40 transition-all border border-transparent shadow-xl">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Neural Hub
           </Link>
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
                 <Wand2 className="h-4 w-4 animate-pulse" /> NEURAL WRITER NODE
              </div>
              <h1 className="text-6xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">Script <span className="text-primary italic">Engine.</span></h1>
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto italic font-medium opacity-60 leading-relaxed">
                Compose high-retention narratives optimized for global distribution algorithms.
              </p>
           </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 pt-10">
           <Card className="lg:col-span-2 border-white/5 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] h-fit shadow-2xl overflow-hidden blue-glow relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Zap size={150} className="text-primary" />
              </div>
              <CardHeader className="p-12 pb-8 relative z-10">
                 <CardTitle className="text-4xl font-headline font-black uppercase tracking-tight text-white">Parameters</CardTitle>
                 <CardDescription className="text-xl font-medium italic opacity-60">Configure narrative nodes</CardDescription>
              </CardHeader>
              <CardContent className="p-12 pt-0 space-y-10 relative z-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Topic / Niche Node</label>
                    <Input 
                      placeholder="e.g. AI Revolution 2026" 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)}
                      className="rounded-[2rem] h-20 bg-black/40 border-white/10 text-xl px-8 focus:border-primary/50 transition-all font-medium shadow-inner"
                    />
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Target CDN</label>
                    <div className="grid grid-cols-2 gap-4">
                       <Button 
                         variant={platform === 'youtube' ? 'default' : 'outline'} 
                         className={cn("rounded-[1.5rem] gap-4 h-16 font-black uppercase tracking-widest text-[10px] transition-all", platform === 'youtube' ? 'shadow-glow' : 'bg-white/5 border-white/10')}
                         onClick={() => setPlatform('youtube')}
                       >
                         <Youtube className="h-5 w-5" /> YouTube
                       </Button>
                       <Button 
                         variant={platform === 'instagram' ? 'default' : 'outline'} 
                         className={cn("rounded-[1.5rem] gap-4 h-16 font-black uppercase tracking-widest text-[10px] transition-all", platform === 'instagram' ? 'shadow-glow' : 'bg-white/5 border-white/10')}
                         onClick={() => setPlatform('instagram')}
                       >
                         <Instagram className="h-5 w-5" /> Instagram
                       </Button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 ml-4">Tonal Logic</label>
                    <select 
                      className="w-full h-16 rounded-[1.5rem] bg-black/40 border border-white/10 px-8 text-sm font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary/50"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                       <option value="energetic">Energetic Matrix</option>
                       <option value="educational">Educational Node</option>
                       <option value="funny">Humorous Logic</option>
                       <option value="storytelling">Narrative Protocol</option>
                    </select>
                 </div>

                 <Button 
                  className="w-full h-24 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/40 gap-6 group active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white" 
                  disabled={isGenerating || !topic}
                  onClick={handleGenerate}
                 >
                    {isGenerating ? <Loader2 className="h-8 w-8 animate-spin" /> : <Sparkles className="h-8 w-8 animate-pulse" />}
                    INITIATE SYNC
                 </Button>
              </CardContent>
           </Card>

           <Card className="lg:col-span-3 border-white/5 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[5rem] min-h-[700px] relative flex flex-col shadow-2xl overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5 flex flex-row items-center justify-between bg-white/[0.01]">
                 <div className="space-y-2">
                    <CardTitle className="text-4xl font-headline font-black uppercase tracking-tight text-white">Narrative Output</CardTitle>
                    <CardDescription className="text-lg italic opacity-60">Verified viral structure</CardDescription>
                 </div>
                 {script && (
                   <Button variant="ghost" size="icon" onClick={copyToClipboard} className="rounded-3xl h-14 w-14 bg-white/5 hover:bg-primary/20 transition-all border border-white/10 shadow-xl group">
                     {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6 group-hover:text-primary transition-colors" />}
                   </Button>
                 )}
              </CardHeader>
              <CardContent className="p-12 flex-1 relative">
                 {isGenerating ? (
                   <div className="h-full flex flex-col items-center justify-center text-center gap-10 py-40 animate-pulse">
                      <div className="relative">
                         <Loader2 className="h-24 w-24 animate-spin text-primary" />
                         <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full"></div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black uppercase tracking-tight text-white">Generating Matrix...</h3>
                         <p className="text-xl text-muted-foreground italic font-medium">Engineering hooks and neural engagement points.</p>
                      </div>
                   </div>
                 ) : script ? (
                   <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
                      <pre className="whitespace-pre-wrap font-sans text-xl leading-relaxed text-white/90 bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 shadow-inner italic font-medium">
                        {script}
                      </pre>
                      <div className="mt-12 flex gap-6">
                         <Button asChild className="rounded-[2rem] flex-1 h-20 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white">
                            <Link href="/editor" className="flex items-center gap-4 justify-center">LAUNCH IN EDITOR <ArrowRight size={20} /></Link>
                         </Button>
                         <Button variant="outline" className="rounded-[2rem] flex-1 h-20 font-black uppercase tracking-[0.4em] text-[10px] border-2 border-white/5 hover:bg-white/10 transition-all">
                            REFINE PROTOCOL
                         </Button>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center gap-8 py-40 opacity-10">
                      <MessageSquare className="h-40 w-40 text-primary" />
                      <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">Awaiting Generation</p>
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
