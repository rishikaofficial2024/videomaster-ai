"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, ShieldCheck, Lock, Eye, Globe, FileText } from "lucide-react";
import Link from "next/link";

/**
 * 🛡️ ELITE PRIVACY NODE: Compliant with Global GDPR and Indian IT Laws.
 */
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 md:p-16 mt-40 space-y-16">
        <header className="space-y-8">
          <Link href="/settings" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
              <ArrowLeft className="w-4 h-4" /> Back to Profile Node
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">CERTIFIED DATA SECURITY</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">Privacy <span className="text-primary italic">Node.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Last updated: June 2026. Your creative privacy is our neural core.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 text-[#e1e4e8] leading-relaxed">
          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <Lock className="w-40 h-40" />
            </div>
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20"><Lock className="w-8 h-8 text-primary" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">1. Infrastructure</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed relative z-10">VideoMaster AI utilizes Google Firebase and Cloud Storage for industry-standard encryption. Your creative projects, scripts, and media are stored in private creative nodes inaccessible by third parties.</p>
          </section>

          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Eye className="w-8 h-8 text-indigo-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">2. AI Logic Node</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">Prompts processed by Gemini AI are not used to train public models. Your proprietary creative inputs remain exclusively your intellectual property within your private workspace.</p>
          </section>

          <section className="p-12 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10 space-y-8">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><FileText className="w-8 h-8 text-emerald-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">3. Compliance</h2>
            </div>
            <p className="text-lg text-muted-foreground italic leading-relaxed">For all data deletion requests or neural audit inquiries, contact our compliance node: <b>legal@videomaster-ai.tech</b>. We comply with standard Indian jurisdiction and international safety guidelines.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
