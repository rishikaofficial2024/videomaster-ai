
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, MousePointer2, Keyboard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TerminalGuidePage() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Studio
          </Link>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">
            Terminal <span className="text-primary italic">Guide</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Terminal kahan hai aur command kaise chalani hai? Sab yahan hai.</p>
        </header>

        <section className="grid gap-8">
          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8 blue-glow">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <MousePointer2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-headline">Step 1: Terminal Dhoondein</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed italic">
              Apne computer screen ke <span className="text-white font-bold underline">SABSE NICHE</span> dekhein. Wahan kuch tabs dikhenge jaise: <span className="text-primary font-bold bg-white/5 px-2 py-1 rounded">Editor</span>, <span className="text-primary font-bold bg-white/5 px-2 py-1 rounded">Output</span>, aur ek hoga <span className="text-white font-bold bg-primary/20 px-3 py-1 rounded">Terminal</span>.
            </p>
            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">👇 SCREEN KE BILKUL NICHE DEKHEIN 👇</p>
            </div>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <Keyboard className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold font-headline">Step 2: Command Type Karein</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed italic">
              "Terminal" tab par click karein. Jab kaala box (Terminal) khul jaye, toh usmein niche diya gaya code <span className="text-white font-bold">Copy</span> karke <span className="text-white font-bold">Paste</span> karein aur <span className="text-white font-bold underline">ENTER</span> dabayein:
            </p>
            <div className="group relative">
              <div className="p-8 bg-black rounded-3xl border-2 border-primary/30 font-mono text-primary text-xl md:text-3xl font-bold text-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                npm run mobile:push
              </div>
            </div>
          </Card>

          <Card className="rounded-[3rem] bg-emerald-500/5 border-emerald-500/10 p-10 text-center space-y-4">
            <div className="flex justify-center">
               <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold font-headline">Hogaya! Build Chalu Hai.</h4>
            <p className="text-sm text-muted-foreground italic">Ye command chalne ke baad aapka APK banna GitHub par shuru ho jayega.</p>
          </Card>
        </section>

        <div className="text-center">
           <Button className="h-16 px-12 rounded-2xl font-bold text-lg" asChild>
              <Link href="/dashboard">Wapas Dashboard par Jayein</Link>
           </Button>
        </div>
      </main>
    </div>
  );
}
