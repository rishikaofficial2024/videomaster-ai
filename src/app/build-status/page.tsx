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
    { id: 1, label: "Neural Code Synchronization", icon: Globe, status: "completed" },
    { id: 2, label: "Cloud Factory Handshake", icon: Tornado, status: "completed" },
    { id: 3, label: "Android Resource Encoding", icon: Box, status: buildStep >= 3 ? "completed" : "active" },
    { id: 4, label: "APK Artifact Generation", icon: Smartphone, status: buildStep >= 4 ? "completed" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
             <Sparkles className="w-3 h-3" /> Master Build Engine Active
          </div>
          <h1 className="text-5xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-none">
            Build <span className="text-primary italic">Pulse</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Querying cloud factory for the latest APK artifact.</p>
        </header>

        <section className="grid gap-8">
          <Card className="rounded-[4rem] bg-[#0a0d14]/90 backdrop-blur-3xl border-2 border-primary/30 p-12 space-y-12 shadow-[0_0_100px_rgba(59,130,246,0.15)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <Tornado className="w-60 h-60 animate-spin-slow" />
             </div>
             
             <div className="space-y-10 relative z-10">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-8 group">
                     <div className={cn(
                       "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700",
                       s.status === 'completed' ? "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : 
                       s.status === 'active' ? "bg-primary/20 border-primary text-primary animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)]" : 
                       "bg-white/5 border-white/10 text-muted-foreground opacity-20"
                     )}>
                        <s.icon className="w-8 h-8" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <h4 className={cn(
                          "font-black uppercase tracking-[0.2em] text-lg",
                          s.status === 'completed' ? "text-white" : "text-muted-foreground"
                        )}>{s.label}</h4>
                        <p className="text-xs text-muted-foreground italic font-medium">
                           {s.status === 'completed' ? "Protocol Verified ✅" : s.status === 'active' ? "Processing Sequence..." : "Waiting for Authorization..."}
                        </p>
                     </div>
                     {s.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  </div>
                ))}
             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                   <h3 className="text-3xl font-bold text-white font-headline tracking-tight uppercase">ARTIFACT DOWNLOAD READY</h3>
                   <p className="text-sm text-muted-foreground italic opacity-60">Redirect to the cloud repository to download your production APK.</p>
                </div>
                <Button className="h-20 px-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 font-black text-xl gap-4 shadow-[0_20px_50px_rgba(5,150,105,0.4)] group hover:scale-105 transition-all" asChild>
                   <a href={githubLink} target="_blank">
                      <Download className="w-8 h-8 group-hover:bounce" /> ACCESS DOWNLOAD PORTAL
                   </a>
                </Button>
             </div>
          </Card>

          <Card className="rounded-[3rem] bg-primary/10 border-primary/20 p-12 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-primary/30 shadow-2xl">
                   <Wand2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                   <h4 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Automation Protocol</h4>
                   <p className="text-lg text-muted-foreground italic leading-relaxed">When the terminal command is executed, GitHub Actions compiles a fresh APK artifact automatically.</p>
                </div>
             </div>
             <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white font-bold text-lg" asChild>
                <Link href="/APK_GUIDE.md">View Documentation</Link>
             </Button>
          </Card>
        </section>

        <div className="text-center pt-10">
           <Link href="/dashboard" className="text-[12px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.6em] transition-all">
              <ArrowLeft className="inline w-4 h-4 mr-3" /> Return to Creative Hub
           </Link>
        </div>
      </main>
    </div>
  );
}