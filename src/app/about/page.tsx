"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Info, Zap, Cpu, Globe, Rocket, 
  Crown, Sparkles, ArrowLeft, Heart,
  ShieldCheck, Smartphone, Monitor
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 md:p-12 mt-24 space-y-24">
        <header className="space-y-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
            <ArrowLeft className="w-4 h-4" /> Return to Studio
          </Link>
          
          <div className="space-y-8">
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                <Sparkles className="w-4 h-4 animate-pulse" /> THE FUTURE OF CONTENT CREATION
             </div>
             <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none">VideoMaster <span className="text-primary italic">AI</span></h1>
             <p className="text-xl md:text-3xl text-muted-foreground font-medium italic opacity-60 max-w-3xl mx-auto">India's first professional AI production studio built for the next generation of viral creators.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-16 items-center">
           <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-headline font-black text-white uppercase tracking-tighter leading-tight">THE NEURAL <br/> REVOLUTION.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                We believe that every creator should have access to Hollywood-grade tools. By combining Google's Gemini Flash and Veo engines with an obsidian-themed editing suite, we've removed the barriers to viral success.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <p className="text-4xl font-bold text-white font-headline">100K+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Videos Generated</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-4xl font-bold text-white font-headline">0.4s</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Neural Latency</p>
                 </div>
              </div>
           </div>

           <Card className="rounded-[4rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-2 border-white/5 p-12 relative overflow-hidden blue-glow">
              <div className="absolute -top-20 -right-20 opacity-5 rotate-45">
                 <Cpu className="w-80 h-80 text-primary" />
              </div>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/20 rounded-2xl"><Zap className="w-8 h-8 text-primary" /></div>
                    <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Our Mission</h3>
                 </div>
                 <p className="text-lg text-muted-foreground leading-relaxed italic">
                   To democratize high-fidelity video production by providing free, unlocked AI tools to creators globally. No paywalls, no limits—just raw creative power.
                 </p>
                 <Button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-primary/20 hover:border-primary/40 transition-all">
                    Learn More Protocol
                 </Button>
              </div>
           </Card>
        </div>

        <section className="py-20 border-y border-white/5">
           <div className="text-center space-y-12">
              <h3 className="text-4xl font-headline font-black text-white uppercase tracking-tight">TECHNOLOGY STACK</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 {[
                   { icon: Cpu, label: "Gemini 1.5 Flash", sub: "Deep Reasoning" },
                   { icon: Globe, label: "Google Cloud", sub: "Global Multi-Node" },
                   { icon: ShieldCheck, label: "Firebase", sub: "Encrypted Storage" },
                   { icon: Rocket, label: "Veo 2.0", sub: "Motion Engine" }
                 ].map((t, i) => (
                   <div key={i} className="space-y-4">
                      <t.icon className="w-10 h-10 text-primary mx-auto opacity-40" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-tight text-sm">{t.label}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <div className="text-center space-y-8">
           <Heart className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.8em] opacity-40">Made with 100% Neural Power in India</p>
        </div>
      </main>
    </div>
  );
}
