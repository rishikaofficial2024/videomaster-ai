"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, Smartphone, CheckCircle2, Loader2, 
  ArrowLeft, ExternalLink, ShieldCheck, Zap,
  Globe, Info, Laptop, Github, MessageSquare, Tornado, Box, Sparkles, Wand2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function BuildStatusPage() {
  const [buildStep, setBuildStep] = useState(0);
  const githubLink = "https://github.com/rishikaofficial2024/videomaster-ai/actions";

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, label: "Neural Code Sync", icon: Globe, status: "completed" },
    { id: 2, label: "Cloud Factory Handshake", icon: Tornado, status: "completed" },
    { id: 3, label: "Android Resource Encoding", icon: Box, status: buildStep >= 3 ? "completed" : "active" },
    { id: 4, label: "APK Artifact Generation", icon: Smartphone, status: buildStep >= 4 ? "completed" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
             <Sparkles className="w-3 h-3" /> Magic APK Engine Active
          </div>
          <h1 className="text-5xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-none">
            Build <span className="text-primary italic">Pulse</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Checking your cloud factory for the latest APK.</p>
        </header>

        <section className="grid gap-8">
          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-2 border-primary/30 p-10 space-y-10 blue-glow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <Tornado className="w-40 h-40 animate-spin-slow" />
             </div>
             
             <div className="space-y-8 relative z-10">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-6">
                     <div className={cn(
                       "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                       s.status === 'completed' ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : 
                       s.status === 'active' ? "bg-primary/20 border-primary text-primary animate-pulse" : 
                       "bg-white/5 border-white/10 text-muted-foreground opacity-20"
                     )}>
                        <s.icon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <h4 className={cn(
                          "font-bold uppercase tracking-widest text-sm",
                          s.status === 'completed' ? "text-white" : "text-muted-foreground"
                        )}>{s.label}</h4>
                        <p className="text-[10px] text-muted-foreground italic">
                           {s.status === 'completed' ? "Protocol Verified ✅" : s.status === 'active' ? "Processing Node..." : "Waiting for Sequence..."}
                        </p>
                     </div>
                     {s.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>
                ))}
             </div>

             <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                   <h3 className="text-2xl font-bold text-white font-headline">FACTORY LINK READY</h3>
                   <p className="text-xs text-muted-foreground italic">Click below to see build logs and download the APK.</p>
                </div>
                <Button className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-lg gap-3 shadow-2xl shadow-emerald-600/40 group hover:scale-105 transition-all" asChild>
                   <a href={githubLink} target="_blank">
                      <Download className="w-6 h-6 group-hover:bounce" /> GO TO DOWNLOAD PAGE
                   </a>
                </Button>
             </div>
          </Card>

          <Card className="rounded-[3rem] bg-primary/10 border-primary/20 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                   <Wand2 className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                   <h4 className="text-xl font-bold font-headline text-white uppercase">How it works (Jaadu)</h4>
                   <p className="text-sm text-muted-foreground italic">Jab aap terminal mein command chalate hain, GitHub ek naya APK bana kar wahan rakh deta hai.</p>
                </div>
             </div>
             <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 text-white font-bold" asChild>
                <Link href="/APK_GUIDE.md">Step-by-Step Guide</Link>
             </Button>
          </Card>
        </section>

        <div className="text-center pt-8">
           <Link href="/dashboard" className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.5em]">
              <ArrowLeft className="inline w-3 h-3 mr-2" /> Wapas Dashboard Par Chalo
           </Link>
        </div>
      </main>
    </div>
  );
}
