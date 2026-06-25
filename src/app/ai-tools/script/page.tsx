"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Sparkles, Youtube, Instagram, Loader2, Copy, Check, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
    // Simulate Genkit Flow
    setTimeout(() => {
      setScript(`[INTRO]\nHey guys, welcome back to the channel! Today we're diving deep into ${topic} and trust me, you don't want to miss what we found.\n\n[HOOK]\nDid you know that most people completely ignore the most important part of ${topic}? Let's fix that right now.\n\n[BODY]\nStep 1: Focus on the fundamentals. Many beginners start with the hard stuff, but the basics are where the magic happens.\nStep 2: Consistency is key. You can't just try this once and expect results.\n\n[OUTRO]\nIf this helped you, smash that like button and subscribe for more ${topic} content! See you in the next one.`);
      setIsGenerating(false);
      toast({ title: "Script Generated!", description: "Your viral script is ready for use." });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Script copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-10 space-y-10">
        <header className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Wand2 className="h-3.5 w-3.5" /> Neural Writer Node
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">AI Script Generator</h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
             Write scripts that hook viewers from the first second. Powered by VideoMaster's neural narrative engine.
           </p>
        </header>

        <div className="grid md:grid-cols-5 gap-8">
           <Card className="md:col-span-2 border-none shadow-lg rounded-3xl h-fit">
              <CardHeader>
                 <CardTitle className="text-xl">Parameters</CardTitle>
                 <CardDescription>Tell us about your video</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topic or Niche</label>
                    <Input 
                      placeholder="e.g. 5 Morning Productivity Hacks" 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)}
                      className="rounded-xl h-12"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                       <Button 
                         variant={platform === 'youtube' ? 'default' : 'outline'} 
                         className="rounded-xl gap-2 text-xs h-12"
                         onClick={() => setPlatform('youtube')}
                       >
                         <Youtube className="h-4 w-4" /> YouTube
                       </Button>
                       <Button 
                         variant={platform === 'instagram' ? 'default' : 'outline'} 
                         className="rounded-xl gap-2 text-xs h-12"
                         onClick={() => setPlatform('instagram')}
                       >
                         <Instagram className="h-4 w-4" /> Instagram
                       </Button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tone of Voice</label>
                    <select 
                      className="w-full h-12 rounded-xl bg-background border px-4 text-sm"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                       <option value="energetic">Energetic & Hyped</option>
                       <option value="educational">Educational & Calm</option>
                       <option value="funny">Humorous & Relatable</option>
                       <option value="storytelling">Narrative & Emotional</option>
                    </select>
                 </div>

                 <Button 
                  className="w-full h-14 rounded-full font-extrabold text-lg shadow-xl shadow-primary/20" 
                  disabled={isGenerating || !topic}
                  onClick={handleGenerate}
                 >
                    {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                    Write Script
                 </Button>
              </CardContent>
           </Card>

           <Card className="md:col-span-3 border-none shadow-lg rounded-3xl min-h-[500px] relative flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                 <div className="space-y-1">
                    <CardTitle className="text-xl">Your Narrative</CardTitle>
                    <CardDescription>Viral-optimized structure</CardDescription>
                 </div>
                 {script && (
                   <Button variant="ghost" size="icon" onClick={copyToClipboard} className="rounded-full">
                     {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                   </Button>
                 )}
              </CardHeader>
              <CardContent className="p-6 flex-1">
                 {isGenerating ? (
                   <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20 opacity-50">
                      <div className="relative">
                         <Loader2 className="h-16 w-16 animate-spin text-primary" />
                         <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full"></div>
                      </div>
                      <div className="space-y-1">
                         <h3 className="font-bold text-lg">AI is composing...</h3>
                         <p className="text-sm">Engineering hooks and engagement points.</p>
                      </div>
                   </div>
                 ) : script ? (
                   <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-muted/30 p-6 rounded-2xl border">
                        {script}
                      </pre>
                      <div className="mt-8 flex gap-4">
                         <Button asChild className="rounded-full flex-1 h-12 font-bold shadow-md">
                            <Link href="/editor">Launch in Editor</Link>
                         </Button>
                         <Button variant="outline" className="rounded-full flex-1 h-12 font-bold">
                            Refine Script
                         </Button>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20 opacity-20">
                      <MessageSquare className="h-20 w-20" />
                      <p className="font-bold text-lg">Generate your script parameters <br /> to see results here.</p>
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
