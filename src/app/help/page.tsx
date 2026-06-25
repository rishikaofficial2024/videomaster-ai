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

export default function HelpHub() {
  const faqs = [
    { q: "How to export in 4K?", a: "Every project is capable of 4K export. Simply click the 'Export 4K' button in the top-right corner of the editor. As a Pro member, this is 100% free." },
    { q: "What is Veo Motion Engine?", a: "Veo is our proprietary text-to-video synthesis engine. It converts your text descriptions into cinematic HD clips in seconds." },
    { q: "Are my projects private?", a: "Yes. All creative data is stored in your private creative node on Google Firebase, protected by industry-standard encryption." },
    { q: "I lost my edits, can I recover?", a: "The Studio automatically syncs your progress every few seconds. Check your 'My Projects' folder for the latest saved draft." }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 md:p-12 mt-24 space-y-16">
        <header className="space-y-10 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
          
          <div className="space-y-6">
             <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none">Support <span className="text-primary italic">Node</span></h1>
             <p className="text-muted-foreground text-xl md:text-2xl font-medium italic opacity-60 max-w-2xl mx-auto">Get help with your creative workflows and technical links.</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
             <Input 
               placeholder="Search help topics..." 
               className="h-20 rounded-[2rem] bg-white/5 border-white/10 pl-16 pr-8 text-lg text-white focus:border-primary/50 transition-all shadow-2xl"
             />
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
           <Card className="rounded-[3rem] bg-primary/5 border-primary/20 p-8 space-y-6 hover:bg-primary/10 transition-all cursor-default">
              <div className="p-4 bg-primary/20 rounded-2xl w-fit"><Book className="w-6 h-6 text-primary" /></div>
              <h3 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Manuals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed italic">Deep-dive into every AI tool and editor feature with our professional documentation.</p>
           </Card>

           <Card className="rounded-[3rem] bg-indigo-500/5 border-indigo-500/20 p-8 space-y-6 hover:bg-indigo-500/10 transition-all cursor-default">
              <div className="p-4 bg-indigo-500/20 rounded-2xl w-fit"><Globe className="w-6 h-6 text-indigo-400" /></div>
              <h3 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Community</h3>
              <p className="text-xs text-muted-foreground leading-relaxed italic">Join 10k+ creators sharing viral strategies and AI workflows in our global Discord.</p>
           </Card>

           <Card className="rounded-[3rem] bg-emerald-500/5 border-emerald-500/20 p-8 space-y-6 hover:bg-emerald-500/10 transition-all cursor-default">
              <div className="p-4 bg-emerald-500/20 rounded-2xl w-fit"><MessageSquare className="w-6 h-6 text-emerald-400" /></div>
              <h3 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Live Chat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed italic">Priority response for Pro Studio nodes. Typical response time is under 5 minutes.</p>
           </Card>
        </div>

        <section className="space-y-8">
           <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight px-4">Neural FAQ</h2>
           <div className="grid gap-4">
              {faqs.map((f, i) => (
                <Card key={i} className="rounded-[2.5rem] bg-white/[0.02] border-white/5 p-8 space-y-4 hover:border-white/10 transition-all">
                   <h4 className="text-lg font-bold text-white flex items-center gap-4">
                      <Zap className="w-4 h-4 text-primary fill-current" /> {f.q}
                   </h4>
                   <p className="text-sm text-muted-foreground leading-relaxed italic pl-8 border-l border-white/5">{f.a}</p>
                </Card>
              ))}
           </div>
        </section>

        <Card className="rounded-[4rem] bg-black/60 border-2 border-primary/30 p-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
              <Send className="w-60 h-60 text-primary" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="space-y-6 text-center md:text-left flex-1">
                 <h2 className="text-4xl md:text-5xl font-headline font-black text-white uppercase tracking-tighter">STILL HAVE QUESTIONS?</h2>
                 <p className="text-xl text-muted-foreground font-medium italic">Our neural support node is always online to assist your creative journey.</p>
              </div>
              <Button className="h-20 px-12 rounded-[2rem] bg-primary font-black text-lg gap-4 shadow-2xl shadow-primary/40 group">
                 CONTACT SUPPORT <MessageSquare className="group-hover:scale-110 transition-all" />
              </Button>
           </div>
        </Card>
      </main>
    </div>
  );
}
