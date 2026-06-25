"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  HelpCircle, MessageSquare, Book, Globe, Shield, 
  ArrowLeft, Zap, Star, Search, Smartphone, 
  Monitor, Cpu, RefreshCw, Send
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

/**
 * 🆘 SUPPORT NODE: Technical Documentation & Help Desk.
 */
export default function HelpHub() {
  const faqs = [
    { q: "How to export in 4K?", a: "Every project in the Pro Studio is capable of 4K export. Click the 'Export 4K' button in the editor. As a Pro member, this is 100% free." },
    { q: "What is Veo Motion Engine?", a: "Veo is our flagship text-to-video synthesis engine. It converts text descriptions into cinematic HD clips in 5-8 second sequences." },
    { q: "Are my projects private?", a: "Yes. All creative data is stored in your private node on Google Firebase, protected by standard encryption protocols." },
    { q: "Is it really free?", a: "Yes. VideoMaster AI is dedicated to democratizing elite production tools. Enjoy full Pro access at zero cost." }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 md:p-16 mt-40 space-y-24">
        <header className="space-y-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
            <ArrowLeft className="w-4 h-4" /> Return to Creative Hub
          </Link>
          
          <div className="space-y-8">
             <h1 className="text-8xl md:text-[10rem] font-headline font-black tracking-tighter text-white leading-none uppercase">Support <span className="text-primary italic">Node.</span></h1>
             <p className="text-muted-foreground text-2xl font-medium italic opacity-60 max-w-3xl mx-auto">Get expert help with your creative workflows and neural links.</p>
          </div>

          <div className="max-w-3xl mx-auto relative group">
             <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground w-8 h-8 group-hover:text-primary transition-colors" />
             <Input 
               placeholder="Query help topics..." 
               className="h-28 rounded-[3rem] bg-white/5 border-white/10 pl-24 pr-12 text-2xl text-white focus:border-primary/50 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.5)] placeholder:opacity-20"
             />
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-10">
           <Card className="rounded-[4rem] bg-primary/5 border border-primary/20 p-12 space-y-8 hover:bg-primary/10 transition-all cursor-default relative overflow-hidden group">
              <div className="p-5 bg-primary/20 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-2xl shadow-primary/20"><Book className="w-8 h-8 text-primary" /></div>
              <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Manuals</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">Deep-dive into every AI tool and editor feature with our elite documentation hub.</p>
           </Card>

           <Card className="rounded-[4rem] bg-indigo-500/5 border border-indigo-500/20 p-12 space-y-8 hover:bg-indigo-500/10 transition-all cursor-default relative overflow-hidden group">
              <div className="p-5 bg-indigo-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-2xl shadow-indigo-500/20"><Globe className="w-8 h-8 text-indigo-400" /></div>
              <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">Join 10k+ creators sharing viral strategies and AI prompts in our global Discord node.</p>
           </Card>

           <Card className="rounded-[4rem] bg-emerald-500/5 border border-emerald-500/20 p-12 space-y-8 hover:bg-emerald-500/10 transition-all cursor-default relative overflow-hidden group">
              <div className="p-5 bg-emerald-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-2xl shadow-emerald-500/20"><MessageSquare className="w-8 h-8 text-emerald-400" /></div>
              <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Live Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">Priority response for Pro Studio nodes. Typical response time is under 5 minutes.</p>
           </Card>
        </div>

        <section className="space-y-12">
           <h2 className="text-5xl font-headline font-black text-white uppercase tracking-tight px-6">Neural FAQ</h2>
           <div className="grid gap-6">
              {faqs.map((f, i) => (
                <Card key={i} className="rounded-[3rem] bg-white/[0.02] border border-white/5 p-10 space-y-6 hover:border-primary/30 transition-all group">
                   <h4 className="text-2xl font-bold text-white flex items-center gap-5">
                      <Zap className="w-6 h-6 text-primary fill-current group-hover:animate-pulse" /> {f.q}
                   </h4>
                   <p className="text-lg text-muted-foreground leading-relaxed italic pl-12 border-l-2 border-white/10">{f.a}</p>
                </Card>
              ))}
           </div>
        </section>

        <Card className="rounded-[5rem] bg-black/60 border-2 border-primary/30 p-16 overflow-hidden relative shadow-glow">
           <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12">
              <Send className="w-80 h-80 text-primary" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="space-y-8 text-center md:text-left flex-1">
                 <h2 className="text-5xl md:text-7xl font-headline font-black text-white uppercase tracking-tighter leading-none">STILL HAVE <br/> QUESTIONS?</h2>
                 <p className="text-2xl text-muted-foreground font-medium italic opacity-80">Our neural support node is always online to assist your creative journey.</p>
              </div>
              <Button className="h-28 px-16 rounded-[2.5rem] bg-primary font-black text-2xl gap-5 shadow-2xl shadow-primary/40 group hover:scale-105 transition-all">
                 CONTACT NODE <MessageSquare className="w-8 h-8 group-hover:scale-125 transition-transform" />
              </Button>
           </div>
        </Card>
      </main>
    </div>
  );
}
