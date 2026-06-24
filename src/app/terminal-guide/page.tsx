"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, Smartphone, CloudUpload, XCircle, Menu, ChevronDown, Copy, MousePointer2, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function TerminalGuidePage() {
  const { toast } = useToast();

  const copyCommand = (cmd: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(cmd);
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
          <p className="text-muted-foreground text-xl font-medium italic text-amber-500">
            Official deployment protocol for production builds and mobile artifacts.
          </p>
        </header>

        <section className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
          <Card className="rounded-[4rem] bg-[#0a0d14] border-2 border-primary/50 p-10 space-y-12 relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)]">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">TERMINAL ACCESS SIMULATOR</h3>
                <p className="text-muted-foreground italic">Follow these steps to find the integrated command line:</p>
             </div>

             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                   <div className="relative aspect-[9/16] max-w-[300px] mx-auto bg-black rounded-[3rem] border-8 border-white/10 p-5 shadow-2xl overflow-hidden group">
                      <div className="h-12 border-b border-white/10 flex items-center px-2 justify-between">
                         <div className="relative">
                            <div className="p-1.5 bg-red-600 rounded-lg border border-white animate-bounce shadow-xl shadow-red-600/50">
                               <Menu className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -right-20 top-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap shadow-2xl">TAP MENU</div>
                         </div>
                         <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">STUDIO IDE</div>
                         <div className="w-5 h-5 rounded-full bg-white/5" />
                      </div>
                      
                      <div className="mt-8 space-y-6">
                         <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-widest opacity-40">Files</span>
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
                            <span className="text-white/60 text-xs font-mono line-clamp-1">npm run web:deploy</span>
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
                       desc: "Tap the 3 horizontal lines at the very top-left corner of the studio screen.",
                       icon: Menu
                     },
                     { 
                       num: "2", 
                       title: "SELECT TERMINAL", 
                       desc: "Find 'Terminal' in the menu and select 'New Terminal'.",
                       icon: Terminal
                     },
                     { 
                       num: "3", 
                       title: "PASTE & RUN", 
                       desc: "A black box will appear at the bottom. Paste your command and hit Enter.",
                       icon: Smartphone
                     }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-8 items-start p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-primary/40 transition-all shadow-lg">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-500 flex-shrink-0 flex items-center justify-center font-black text-2xl border border-red-500/30">
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

        <section className="grid md:grid-cols-2 gap-8">
           <Card className="rounded-[4rem] bg-emerald-500/5 border-2 border-emerald-500/30 p-10 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-emerald-400">
                    <CloudUpload className="w-8 h-8" />
                    <h3 className="text-2xl font-bold font-headline uppercase tracking-tighter">FIX SITE NOT FOUND</h3>
                 </div>
                 <p className="text-muted-foreground text-sm italic">Deploys your code to the live web network.</p>
              </div>
              <div className="p-6 bg-black rounded-3xl border border-emerald-500/20 font-mono text-emerald-500 text-xl font-bold text-center">
                 npm run web:deploy
              </div>
              <Button onClick={() => copyCommand("npm run web:deploy")} className="w-full h-16 rounded-2xl font-black gap-4 bg-emerald-600 hover:bg-emerald-700 shadow-xl">
                 <Copy className="w-5 h-5" /> COPY DEPLOY COMMAND
              </Button>
           </Card>

           <Card className="rounded-[4rem] bg-primary/5 border-2 border-primary/30 p-10 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-primary">
                    <Smartphone className="w-8 h-8" />
                    <h3 className="text-2xl font-bold font-headline uppercase tracking-tighter">PUSH TO MOBILE APK</h3>
                 </div>
                 <p className="text-muted-foreground text-sm italic">Synchronizes code with the Android factory.</p>
              </div>
              <div className="p-6 bg-black rounded-3xl border border-primary/20 font-mono text-primary text-xl font-bold text-center">
                 npm run mobile:push
              </div>
              <Button onClick={() => copyCommand("npm run mobile:push")} className="w-full h-16 rounded-2xl font-black gap-4 bg-primary hover:bg-primary/90 shadow-xl">
                 <Copy className="w-5 h-5" /> COPY PUSH COMMAND
              </Button>
           </Card>
        </section>

        <section>
          <Card className="rounded-[3rem] bg-primary/5 border-2 border-primary/20 p-10 space-y-6">
             <div className="flex items-center gap-4 text-primary">
                <Info className="w-14 h-14" />
                <h3 className="text-4xl font-bold font-headline uppercase tracking-tighter">PROFESSIONAL TIP</h3>
             </div>
             <p className="text-xl text-muted-foreground italic leading-relaxed">
                Visual IDE buttons can sometimes glitch due to shell state. Using the <b>Terminal (Black Box)</b> is the industrial standard for 100% reliable deployment.
             </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
