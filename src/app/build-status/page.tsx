"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, Smartphone, CheckCircle2, Loader2, 
  ArrowLeft, ExternalLink, ShieldCheck, Zap,
  Globe, Info, Laptop, Github, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BuildStatusPage() {
  const [status, setStatus] = useState("operational");
  const githubLink = "https://github.com/rishikaofficial2024/videomaster-ai/actions";

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-12">
        <header className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest group">
            <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">
            Build <span className="text-primary italic">Center</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium italic">Download your professional Android App (APK) here.</p>
        </header>

        <section className="grid gap-8">
          <Card className="rounded-[3.5rem] bg-emerald-500/5 border-emerald-500/20 p-10 space-y-8 blue-glow">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 text-center md:text-left">
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/30">
                      <Smartphone className="w-12 h-12 text-emerald-400" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-bold font-headline text-white">APK Status: READY</h3>
                      <p className="text-muted-foreground font-medium italic">Version 1.5.0 Production Build is live.</p>
                   </div>
                </div>
                <Button className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-3 shadow-2xl shadow-emerald-600/20" asChild>
                   <a href={githubLink} target="_blank">
                      <Download className="w-5 h-5" /> Download APK Link
                   </a>
                </Button>
             </div>
          </Card>

          <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 p-10 space-y-8">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                   <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-white">Aasaan Steps (Hindi)</h3>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Open Actions", desc: "Upar wale 'Download' button par click karein." },
                  { step: "2", title: "Select Run", desc: "Sabse upar wala 'Green ✅' item click karein." },
                  { step: "3", title: "Download", desc: "Page ke bottom mein 'Artifacts' se APK download karein." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                     <span className="text-4xl font-bold font-headline text-primary opacity-20">{item.step}</span>
                     <h4 className="font-bold text-white uppercase tracking-widest text-xs">{item.title}</h4>
                     <p className="text-sm text-muted-foreground italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="rounded-[3rem] bg-indigo-500/5 border-indigo-500/10 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                   <Laptop className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-1">
                   <h4 className="text-xl font-bold font-headline text-white">Manual Transfer Guide</h4>
                   <p className="text-sm text-muted-foreground italic">Files ko Google AI Studio se PC par kaise transfer karein?</p>
                </div>
             </div>
             <Button variant="outline" className="h-14 px-8 rounded-2xl border-indigo-500/30 text-indigo-400 font-bold" asChild>
                <Link href="/docs/ANDROID_STUDIO_GUIDE.md">Read Guide <ExternalLink className="ml-2 w-4 h-4" /></Link>
             </Button>
          </Card>
        </section>

        <div className="text-center pt-8">
           <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.5em]">
              <ShieldCheck className="w-3 h-3" /> Secure Cloud Build System
           </div>
        </div>
      </main>
    </div>
  );
}
