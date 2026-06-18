"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background hero-gradient pb-20 pt-10">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 md:p-12 bg-card/50 backdrop-blur-xl rounded-[3rem] border border-white/5 mt-20 space-y-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-2xl w-fit">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 2024</p>
        </div>

        <div className="space-y-8 text-[#e1e4e8] font-body leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">1. Introduction</h2>
            <p>Welcome to VideoMaster AI. We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our AI video generation services.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">2. Data We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, and the content (text prompts, transcripts) you use to generate AI videos. We also use cookies to improve your user experience and for ad personalization through Google AdSense.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">3. How We Use AI Data</h2>
            <p>Your text prompts are processed by Gemini AI to generate video scripts and content. We do not sell your prompts to third parties. Generated videos are stored securely in your private project dashboard.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">4. Advertising and Cookies</h2>
            <p>We use Google AdSense to show advertisements. Google uses cookies to serve ads based on your visits to this and other websites. You can opt-out of personalized advertising by visiting Google Ad Settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <b>support@videomaster-ai.web.app</b></p>
          </section>
        </div>
      </main>
    </div>
  );
}
