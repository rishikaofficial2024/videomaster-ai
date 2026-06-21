
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, ArrowLeft, Smartphone, XCircle, Menu, ChevronDown, AlertTriangle, Info, Globe, Copy } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TerminalGuidePage() {
  const { toast } = useToast();

  const copyCommand = () => {
    navigator.clipboard.writeText("npm run mobile:push");
    toast({
      title: "Command Copied!",
      description: "Now paste this into the BLACK Terminal box.",
    });
  };

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Studio
          </Link>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">
            Terminal <span className="text-primary italic">Map</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic text-red-500 animate-pulse">
            ⚠️ DO NOT go to any other website (like nodejs.org). Everything is ALREADY inside this tab!
          </p>
        </header>

        {/* 📱 MOBILE VISUAL SIMULATOR */}
        <section className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
          <Card className="rounded-[3rem] bg-[#0a0d14] border-2 border-primary/50 p-8 space-y-10 relative overflow-hidden shadow-2xl">
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">MOBILE STEPS (Very Important)</h3>
                <p className="text-sm text-muted-foreground italic">Browser ke upar wala menu nahi, Firebase Studio ka menu dekhein:</p>
             </div>

             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <div className="relative aspect-[9/16] max-w-[280px] mx-auto bg-black rounded-[2.5rem] border-4 border-white/10 p-4 shadow-inner overflow-hidden group">
                      <div className="h-10 border-b border-white/10 flex items-center px-2 justify-between">
                         <div className="p-1 bg-red-600 rounded-md border border-white animate-bounce">
                            <Menu className="w-4 h-4 text-white" />
                         </div>
                         <div className="text-[8px] font-bold text-white/40 uppercase">FIREBASE STUDIO (IDX)</div>
                         <div className="w-4 h-4 rounded-full bg-white/5" />
                      </div>
                      
                      <div className="absolute top-12 left-4 z-20 flex flex-col items-center">
                         <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-2xl animate-pulse">CLICK HERE FIRST</div>
                         <div className="w-0.5 h-6 bg-red-600" />
                      </div>

                      <div className="mt-4 space-y-4">
                         <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Terminal</span>
                            <ChevronDown className="w-3 h-3 text-white/40" />
                         </div>
                         <div className="ml-4 p-2 bg-primary/10 rounded-lg border border-primary/30 flex items-center gap-2 animate-pulse">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-[9px] font-black text-primary uppercase">New Terminal</span>
                         </div>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 h-32 bg-[#05070a] border-t border-primary/30 p-3 space-y-2">
                         <div className="flex items-center gap-2">
                            <span className="text-emerald-500 font-bold text-[8px]">$</span>
                            <span className="text-white/60 text-[8px] font-mono">npm run mobile:push</span>
                         </div>
                         <div className="w-1 h-3 bg-primary animate-pulse" />
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   {[
                     { 
                       num: "1", 
                       title: "TOP-LEFT MENU (≡)", 
                       desc: "Browser ke top left kone mein 3 lines hain. Use click karein.",
                       icon: Menu
                     },
                     { 
                       num: "2", 
                       title: "TERMINAL > NEW", 
                       desc: "Menu mein 'Terminal' dhoondein aur 'New Terminal' select karein.",
                       icon: Terminal
                     },
                     { 
                       num: "3", 
                       title: "PASTE COMMAND", 
                       desc: "Niche jo Black Box khulega wahan command paste karein aur Enter dabayein.",
                       icon: Smartphone
                     }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-6 items-start p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-primary/30 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex-shrink-0 flex items-center justify-center font-black text-xl border border-red-500/30 shadow-lg shadow-red-500/10">
                           {step.num}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
                             <step.icon className="w-4 h-4 text-red-500" /> {step.title}
                           </h4>
                           <p className="text-sm text-muted-foreground italic leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </section>

        {/* 🛑 WARNING BOX */}
        <section>
          <Card className="rounded-[3rem] bg-rose-500/10 border-2 border-rose-500/40 p-8 space-y-6">
             <div className="flex items-center gap-4 text-rose-500">
                <XCircle className="w-12 h-12" />
                <h3 className="text-3xl font-bold font-headline uppercase tracking-tighter">Ye Terminal NAHI hai:</h3>
             </div>
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-muted-foreground font-mono text-[10px] w-full text-center">
                    nodejs.org/en/download
                  </div>
                  <p className="text-xs text-rose-400 font-bold uppercase text-center">❌ IS WEBSITE PAR MAT JAIYE</p>
                </div>
                <p className="text-muted-foreground italic leading-relaxed text-sm">
                   Bhaai, Node.js download karne ki koi zaroorat nahi hai. Sab kuch aapke isi tab mein chupa hai. Bas Top-Left menu kholein aur "Terminal" select karein.
                </p>
             </div>
          </Card>
        </section>

        <section className="space-y-6">
           <div className="text-center">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Copy this command</span>
           </div>
           <div className="p-8 bg-black rounded-[3rem] border-2 border-primary/30 font-mono text-primary text-2xl md:text-4xl font-bold text-center shadow-2xl flex flex-col items-center gap-8 group">
             <span>npm run mobile:push</span>
             <Button onClick={copyCommand} className="rounded-full h-20 px-16 font-bold gap-4 text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                <Copy className="w-8 h-8" /> Copy & Close Guide
             </Button>
           </div>
        </section>
      </main>
    </div>
  );
}
