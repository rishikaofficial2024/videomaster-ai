"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, Smartphone, XCircle, Menu, ChevronDown, AlertTriangle, Info, Globe, Copy, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TerminalGuidePage() {
  const { toast } = useToast();

  const copyCommand = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText("npm run mobile:push");
      toast({
        title: "Command Copied!",
        description: "Now paste this into the BLACK Terminal box.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Studio
          </Link>
          <h1 className="text-5xl md:text-8xl font-headline font-bold text-white tracking-tighter">
            Terminal <span className="text-primary italic">Navigator</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic text-red-500 animate-pulse">
            ⚠️ DO NOT NAVIGATE AWAY. The Terminal is integrated within this interface!
          </p>
        </header>

        {/* 📱 MOBILE VISUAL SIMULATOR */}
        <section className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
          <Card className="rounded-[4rem] bg-[#0a0d14] border-2 border-primary/50 p-10 space-y-12 relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)]">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">MOBILE SIMULATOR</h3>
                <p className="text-muted-foreground italic">Follow the visual cues to locate the integrated Terminal:</p>
             </div>

             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                   <div className="relative aspect-[9/16] max-w-[300px] mx-auto bg-black rounded-[3rem] border-8 border-white/10 p-5 shadow-2xl overflow-hidden group">
                      <div className="h-12 border-b border-white/10 flex items-center px-2 justify-between">
                         <div className="relative">
                            <div className="p-1.5 bg-red-600 rounded-lg border border-white animate-bounce shadow-xl shadow-red-600/50">
                               <Menu className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -right-20 top-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap shadow-2xl">TAP MENU FIRST</div>
                         </div>
                         <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">FIREBASE STUDIO</div>
                         <div className="w-5 h-5 rounded-full bg-white/5" />
                      </div>
                      
                      <div className="mt-8 space-y-6">
                         <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-widest opacity-40">Explorer</span>
                         </div>
                         <div className="p-4 bg-primary/20 rounded-2xl border border-primary/50 flex items-center justify-between relative">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Terminal</span>
                            <ChevronDown className="w-4 h-4 text-primary" />
                            <MousePointer2 className="absolute -right-4 -bottom-4 w-8 h-8 text-white animate-bounce" />
                         </div>
                         <div className="ml-6 p-3 bg-primary/10 rounded-xl border border-primary/30 flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase">New Terminal</span>
                         </div>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 h-40 bg-[#05070a] border-t-2 border-primary/50 p-4 space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="text-emerald-500 font-bold text-sm">$</span>
                            <span className="text-white/60 text-xs font-mono">npm run mobile:push</span>
                         </div>
                         <div className="w-1.5 h-4 bg-primary animate-pulse" />
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   {[
                     { 
                       num: "1", 
                       title: "TOP-LEFT MENU (≡)", 
                       desc: "Tap the 3 horizontal lines at the very top-left corner of your browser screen.",
                       icon: Menu
                     },
                     { 
                       num: "2", 
                       title: "SELECT TERMINAL", 
                       desc: "Within the menu, scroll to 'Terminal' and select 'New Terminal'.",
                       icon: Terminal
                     },
                     { 
                       num: "3", 
                       title: "PASTE COMMAND", 
                       desc: "A black box will appear at the bottom. Long-press to paste and hit 'Go'.",
                       icon: Smartphone
                     }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-8 items-start p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-primary/40 transition-all shadow-lg hover:shadow-primary/5">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-500 flex-shrink-0 flex items-center justify-center font-black text-2xl border border-red-500/30 shadow-xl">
                           {step.num}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-white text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                             <step.icon className="w-5 h-5 text-red-500" /> {step.title}
                           </h4>
                           <p className="text-base text-muted-foreground italic leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </section>

        {/* 🛑 WARNING BOX */}
        <section>
          <Card className="rounded-[3rem] bg-rose-500/10 border-2 border-rose-500/40 p-10 space-y-6">
             <div className="flex items-center gap-4 text-rose-500">
                <XCircle className="w-14 h-14" />
                <h3 className="text-4xl font-bold font-headline uppercase tracking-tighter">EXTERNAL TOOLS NOT REQUIRED</h3>
             </div>
             <p className="text-xl text-muted-foreground italic leading-relaxed">
                You do not need to download Node.js from external sites. The entire production environment is pre-configured within this browser tab. Simply use the <b>Top-Left Menu</b> to launch the <b>Terminal</b>.
             </p>
          </Card>
        </section>

        <section className="space-y-6 pt-10">
           <div className="text-center">
              <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] animate-pulse">Copy Master Command</span>
           </div>
           <div className="p-10 bg-black rounded-[4rem] border-2 border-primary/50 font-mono text-primary text-3xl md:text-5xl font-black text-center shadow-[0_0_80px_rgba(59,130,246,0.3)] flex flex-col items-center gap-10 group">
             <span className="tracking-tighter">npm run mobile:push</span>
             <Button onClick={copyCommand} className="rounded-full h-24 px-20 font-black gap-6 text-2xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all bg-primary">
                <Copy className="w-10 h-10" /> COPY & CLOSE
             </Button>
           </div>
        </section>
      </main>
    </div>
  );
}