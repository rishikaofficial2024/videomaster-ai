"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background hero-gradient pb-20 pt-10">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 md:p-12 bg-card/50 backdrop-blur-xl rounded-[3rem] border border-white/5 mt-20 space-y-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-2xl w-fit">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">Terms of Service</h1>
          <p className="text-muted-foreground">Effective Date: October 2024</p>
        </div>

        <div className="space-y-8 text-[#e1e4e8] font-body leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">1. Acceptance of Terms</h2>
            <p>By accessing VideoMaster AI, you agree to follow these Terms of Service and all applicable laws and regulations in India.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">2. AI Usage & Credits</h2>
            <p>Users are provided 100 free credits upon signup. These credits are for personal use only. Abuse of AI generation through automated scripts or bots is strictly prohibited.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">3. Premium Subscriptions</h2>
            <p>Payments for Pro Studio and Agency plans are non-refundable. Subscriptions provide access to 4K exports and priority AI processing as described on the pricing page.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">4. Content Ownership</h2>
            <p>You own the videos generated using VideoMaster AI. However, you must ensure that your prompts and generated content do not violate copyright laws or promote illegal activities.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white">5. Limitation of Liability</h2>
            <p>VideoMaster AI is not responsible for any loss of revenue or data resulting from service downtime or AI-generated output. Use our tools to empower your creativity, but verify results before publishing.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
