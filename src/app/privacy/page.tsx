"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, ShieldCheck, Lock, Eye, Globe, FileText, Gavel, Scale } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 md:p-12 mt-24 space-y-12">
        <header className="space-y-6">
          <Link href="/settings" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group">
            <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Settings
          </Link>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Privacy Standards</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">Privacy <span className="text-primary italic">Protocol</span></h1>
            <p className="text-muted-foreground font-medium italic opacity-60">Last updated: June 2026. Your data privacy is our neural core.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 text-[#e1e4e8] font-body leading-relaxed">
          <section className="p-10 bg-[#0a0d14]/80 backdrop-blur-2xl rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-2xl">
                  <Lock className="w-6 h-6 text-primary" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">1. Data Architecture</h2>
            </div>
            <p className="text-muted-foreground italic">Welcome to VideoMaster AI. We respect your privacy and are committed to protecting your personal data. We collect information you provide directly to us (name, email) and the creative inputs (scripts, prompts) you use for video generation.</p>
          </section>

          <section className="p-10 bg-[#0a0d14]/80 backdrop-blur-2xl rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <Eye className="w-6 h-6 text-indigo-400" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">2. AI Data Processing</h2>
            </div>
            <p className="text-muted-foreground italic">Your creative prompts are processed by Gemini AI models. We do not use your private project data to train public models. Your projects remain stored in your private cloud instance, secured by Firebase Security Protocols.</p>
          </section>

          <section className="p-10 bg-[#0a0d14]/80 backdrop-blur-2xl rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-500/10 rounded-2xl">
                  <Globe className="w-6 h-6 text-orange-400" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">3. Global CDN & Security</h2>
            </div>
            <p className="text-muted-foreground italic">We utilize a Global Content Delivery Network to ensure 0.4s neural latency. All data transfers are encrypted via SSL/TLS 1.3. We use Google AdSense for professional ads, which may use cookies to personalize your creative journey.</p>
          </section>

          <section className="p-10 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <FileText className="w-6 h-6 text-emerald-400" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">Compliance Contact</h2>
            </div>
            <p className="text-sm text-muted-foreground italic">For privacy concerns or data deletion requests, contact our compliance node: <b>legal@videomaster-ai.tech</b>. We comply with all Indian IT Laws and Global GDPR standards.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
