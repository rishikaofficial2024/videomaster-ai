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

/**
 * 🎨 ABOUT NODE: Mission Statement & Technology Stack.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 md:p-16 mt-40 space-y-32">
        <header className="space-y-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
            <ArrowLeft className="w-4 h-4" /> Return to Creative Hub
          </Link>
          
          <div className="space-y-10">
             <div className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.5em]">
                <Sparkles className="w-4 h-4 animate-pulse" /> THE NEURAL REVOLUTION
             </div>
             <h1 className="text-8xl md:text-[12rem] font-headline font-bold tracking-tighter text-white leading-none uppercase">VideoMaster <span className="text-primary italic">AI.</span></h1>
             <p className="text-2xl md:text-4xl text-muted-foreground font-medium italic opacity-60 max-w-4xl mx-auto">India's first professional AI production studio built for the next generation of viral creators.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-20 items-center">
           <div className="space-y-12">
              <h2 className="text-5xl md:text-8xl font-headline font-black text-white uppercase tracking-tighter leading-[0.9]">THE FUTURE <br/> IS UNLOCKED.</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed italic opacity-80">
                We believe that Hollywood-grade tools shouldn't be locked behind paywalls. By combining Google's Gemini Flash and Veo engines with an obsidian-themed editing suite, we've removed every barrier to viral success.
              </p>
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-3">
                    <p className="text-6xl font-bold text-white font-headline tracking-tighter">100K+</p>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Media Outputs</p>
                 </div>
                 <div className="space-y-3">
                    <p className="text-6xl font-bold text-white font-headline tracking-tighter">0.4s</p>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Node Latency</p>
                 </div>
              </div>
           </div>

           <Card className="rounded-[5rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-2 border-white/5 p-16 relative overflow-hidden blue-glow">
              <div className="absolute -top-20 -right-20 opacity-5 rotate-45">
                 <Cpu className="w-[30rem] h-[30rem] text-primary" />
              </div>
              <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-5 bg-primary/20 rounded-2xl shadow-glow"><Zap className="w-10 h-10 text-primary" /></div>
                    <h3 className="text-4xl font-bold font-headline text-white uppercase tracking-tight">Our Mission</h3>
                 </div>
                 <p className="text-xl text-muted-foreground leading-relaxed italic opacity-90">
                   To democratize high-fidelity video production by providing free, unlocked AI tools to creators globally. No paywalls, no limits—just raw creative power.
                 </p>
                 <Button className="h-20 px-12 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-primary/20 hover:border-primary/40 transition-all uppercase tracking-widest">
                    Learn More Node
                 </Button>
              </div>
           </Card>
        </div>

        <section className="py-24 border-y border-white/5">
           <div className="text-center space-y-16">
              <h3 className="text-5xl font-headline font-black text-white uppercase tracking-tight">ELITE TECHNOLOGY STACK</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                 {[
                   { icon: Cpu, label: "Gemini 1.5 Flash", sub: "Neural Reasoning" },
                   { icon: Globe, label: "Google Cloud", sub: "Global Multi-Node" },
                   { icon: ShieldCheck, label: "Firebase", sub: "Encrypted Storage" },
                   { icon: Rocket, label: "Veo 2.0", sub: "Motion Engine" }
                 ].map((t, i) => (
                   <div key={i} className="space-y-6 group">
                      <t.icon className="w-16 h-16 text-primary mx-auto opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-tight text-xl">{t.label}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] mt-2">{t.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <div className="text-center space-y-12">
           <Heart className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
           <p className="text-[12px] text-muted-foreground font-black uppercase tracking-[1em] opacity-30">Designed & Powered by 100% Neural Intelligence in India</p>
        </div>
      </main>
    </div>
  );
}
