"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, MousePointer2, Keyboard, CheckCircle2, Copy, Info, Monitor, AlertCircle, Smartphone, XCircle, Menu } from "lucide-react";
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
          <p className="text-muted-foreground text-xl font-medium italic">Mobile ho ya Laptop, Terminal yahan milega:</p>
        </header>

        {/* ❌ WHAT IS NOT A TERMINAL */}
        <section>
          <Card className="rounded-[3rem] bg-red-500/5 border-2 border-red-500/20 p-8 space-y-6">
             <div className="flex items-center gap-4 text-red-500">
                <XCircle className="w-8 h-8" />
                <h3 className="text-2xl font-bold font-headline uppercase">Ye Terminal NAHI hai:</h3>
             </div>
             <p className="text-muted-foreground italic">"Route Static / Turbopack Enabled" wala box terminal nahi hai. Woh sirf information box hai.</p>
          </Card>
        </section>

        <section className="grid gap-8">
          {/* 📱 MOBILE SPECIAL GUIDE */}
          <Card className="rounded-[3rem] bg-emerald-500/10 border-2 border-emerald-500/50 p-10 space-y-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
             <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-500/20 rounded-full">
                   <Smartphone className="w-12 h-12 text-emerald-500" />
                </div>
             </div>
             <h3 className="text-3xl font-bold font-headline text-white uppercase">MOBILE PAR TERMINAL KAISE KHOLEIN</h3>
             
             <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="flex gap-6 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex-shrink-0 flex items-center justify-center font-black">1</div>
                   <div className="space-y-1">
                      <p className="text-white font-bold">Top-Left Menu Icon</p>
                      <p className="text-xs text-muted-foreground">Screen ke sabse upar baayein kone mein 3 lines (≡) par click karein.</p>
                   </div>
                </div>

                <div className="flex gap-6 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex-shrink-0 flex items-center justify-center font-black">2</div>
                   <div className="space-y-1">
                      <p className="text-white font-bold">Terminal Option</p>
                      <p className="text-xs text-muted-foreground">Menu ke andar scroll karke "Terminal" dhoondein aur fir "New Terminal" dabayein.</p>
                   </div>
                </div>

                <div className="flex gap-6 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex-shrink-0 flex items-center justify-center font-black">3</div>
                   <div className="space-y-1">
                      <p className="text-white font-bold">Paste Command</p>
                      <p className="text-xs text-muted-foreground">Jab niche kaala box khul jaye, toh wahan daba kar rakhein aur Paste karein.</p>
                   </div>
                </div>
             </div>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Copy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-headline text-white">Copy & Run Command</h3>
            </div>
            <div className="group relative">
              <div className="p-8 bg-black rounded-3xl border-2 border-primary/30 font-mono text-primary text-xl md:text-3xl font-bold text-center shadow-2xl flex flex-col items-center gap-6 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <span>npm run mobile:push</span>
                <Button onClick={copyCommand} className="relative z-10 rounded-full h-16 px-12 font-bold gap-3 text-lg">
                  <Copy className="w-6 h-6" /> Copy Command
                </Button>
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
