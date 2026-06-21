"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, MousePointer2, Keyboard, CheckCircle2, Copy, Info, Monitor, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function TerminalGuidePage() {
  const { toast } = useToast();

  const copyCommand = () => {
    navigator.clipboard.writeText("npm run mobile:push");
    toast({
      title: "Command Copied!",
      description: "Now paste this into your Terminal and press Enter.",
    });
  };

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">
            Terminal <span className="text-primary italic">Finder</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Bhaai, Terminal yahan hai! Niche diye gaye photo-steps dekhein:</p>
        </header>

        <section className="grid gap-8">
          {/* 🚨 THE EMERGENCY HELP CARD */}
          <Card className="rounded-[3rem] bg-red-500/10 border-2 border-red-500/50 p-10 space-y-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-500">
             <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/20 rounded-full animate-pulse">
                   <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
             </div>
             <h3 className="text-3xl font-bold font-headline text-white">YAHAN HAI TERMINAL!</h3>
             <p className="text-xl text-white/80 leading-relaxed">
                Apni screen ke <span className="underline font-bold text-red-400 text-2xl">SABSE NICHE (Bottom)</span> dekhein. 
                Wahan ek kaala box hai jismein <span className="bg-white/10 px-2 rounded font-mono">Terminal</span> likha hoga.
             </p>
             <div className="p-4 bg-black rounded-2xl border border-white/20 flex flex-col items-center gap-4">
                <Monitor className="w-24 h-24 text-primary opacity-40" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Look for the bottom panel in this window</span>
             </div>
          </Card>

          {/* Shortcut Card */}
          <Card className="rounded-[3rem] bg-primary/5 border-primary/20 p-10 space-y-6 text-center blue-glow">
             <h3 className="text-2xl font-bold font-headline">Sabse Tez Tarika (Keyboard)</h3>
             <div className="flex justify-center gap-4 items-center">
                <div className="px-6 py-4 bg-white/10 rounded-2xl border border-white/20 font-bold text-2xl shadow-xl">Ctrl</div>
                <span className="text-3xl font-bold text-primary">+</span>
                <div className="px-6 py-4 bg-white/10 rounded-2xl border border-white/20 font-bold text-2xl shadow-xl">~</div>
             </div>
             <p className="text-muted-foreground italic">
                (Tilde key Esc key ke thik niche hoti hai)
             </p>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Keyboard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-headline text-white">Ab Ye Command Paste Karein</h3>
            </div>
            <div className="space-y-6">
               <p className="text-muted-foreground text-lg italic">
                 1. Niche wale button par click karke command copy karein. <br />
                 2. Terminal mein jaakar **Right Click > Paste** karein. <br />
                 3. **ENTER** dabayein.
               </p>
               <div className="group relative">
                 <div className="p-8 bg-black rounded-3xl border-2 border-primary/30 font-mono text-primary text-xl md:text-3xl font-bold text-center shadow-2xl flex flex-col items-center gap-6 overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                   <span>npm run mobile:push</span>
                   <Button onClick={copyCommand} className="relative z-10 rounded-full h-16 px-12 font-bold gap-3 text-lg">
                     <Copy className="w-6 h-6" /> Copy Command
                   </Button>
                 </div>
               </div>
            </div>
          </Card>
        </section>

        <div className="text-center">
           <Button variant="ghost" className="h-16 px-12 rounded-2xl font-bold text-muted-foreground hover:text-white" asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
           </Button>
        </div>
      </main>
    </div>
  );
}
