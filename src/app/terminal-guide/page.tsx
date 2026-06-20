"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, MousePointer2, Keyboard, CheckCircle2, Copy, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function TerminalGuidePage() {
  const { toast } = useToast();

  const copyCommand = () => {
    navigator.clipboard.writeText("npm run mobile:push");
    toast({
      title: "Command Copied!",
      description: "Ab bas Terminal mein jaakar Paste karein aur Enter dabayein.",
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
            Terminal <span className="text-primary italic">Kaise Kholem?</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Bhaai, Terminal dhoondna bahut aasaan hai. Bas ye follow karein:</p>
        </header>

        <section className="grid gap-8">
          {/* Visual Help */}
          <Card className="rounded-[3rem] bg-primary/5 border-primary/20 p-10 space-y-6 text-center blue-glow">
             <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full animate-bounce">
                   <Info className="w-10 h-10 text-primary" />
                </div>
             </div>
             <h3 className="text-2xl font-bold font-headline">Sabse Fast Tarika (Keyboard)</h3>
             <p className="text-muted-foreground text-lg">
                Apne keyboard par <span className="text-white font-bold bg-white/10 px-3 py-1 rounded">Ctrl</span> + <span className="text-white font-bold bg-white/10 px-3 py-1 rounded">~</span> dabayein.
                <br />
                <span className="text-xs text-primary font-bold uppercase tracking-widest">(Ye button Esc key ke bilkul niche hota hai)</span>
             </p>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <MousePointer2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold font-headline">Mouse Se Kaise Kholem?</h3>
            </div>
            <div className="space-y-4">
               <p className="text-muted-foreground text-lg leading-relaxed">
                 1. Apni screen ke <span className="text-white font-bold underline">SABSE NICHE</span> (Bottom Bar) dekhein.
               </p>
               <p className="text-muted-foreground text-lg leading-relaxed">
                 2. Wahan <span className="text-white font-bold">"Terminal"</span> naam ka ek tab dikhega. Uspar click karein.
               </p>
               <p className="text-muted-foreground text-lg leading-relaxed">
                 3. Ek kaala box khul jayega jismein aap likh sakte hain.
               </p>
            </div>
            <div className="p-4 bg-black rounded-2xl border border-white/10 flex items-center justify-center">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Look at the bottom of this window</span>
            </div>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Keyboard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-headline">Command Paste Karein</h3>
            </div>
            <div className="space-y-6">
               <p className="text-muted-foreground text-lg italic">
                 Niche diye gaye button par click karein, phir Terminal mein jaakar <span className="text-white font-bold">Right Click &gt; Paste</span> karein aur **Enter** dabayein.
               </p>
               <div className="group relative">
                 <div className="p-8 bg-black rounded-3xl border-2 border-primary/30 font-mono text-primary text-xl md:text-3xl font-bold text-center shadow-2xl flex flex-col items-center gap-6 overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                   <span>npm run mobile:push</span>
                   <Button onClick={copyCommand} className="relative z-10 rounded-full h-14 px-8 font-bold gap-2">
                     <Copy className="w-5 h-5" /> Copy Command
                   </Button>
                 </div>
               </div>
            </div>
          </Card>

          <Card className="rounded-[3rem] bg-emerald-500/5 border-emerald-500/10 p-10 text-center space-y-4">
            <div className="flex justify-center">
               <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold font-headline">Command Chalte Hi Kya Hoga?</h4>
            <p className="text-sm text-muted-foreground italic">Aapka code GitHub par update ho jayega aur APK banna shuru ho jayega. Aapka app live aur secure ho jayega.</p>
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