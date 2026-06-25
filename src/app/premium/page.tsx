"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Rocket, Star, Sparkles, Gem, ShieldCheck, Landmark, Globe, Briefcase } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";

/**
 * 💎 ELITE SAAS HUB: Revamped for Enterprise Scale.
 */
export default function PremiumPage() {
  const plans = [
    {
      id: "free",
      name: "Starter Hub",
      price: "₹0",
      description: "For Individual Creators",
      features: ["5 AI Scripts / day", "Standard HD Exports", "Basic Thumbnails", "Community Support", "Branded Watermark"],
      buttonText: "Active Node",
      icon: Zap,
      popular: false,
      color: "border-white/5 bg-white/5"
    },
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹99",
      description: "Viral Scaling Mode",
      features: ["Unlimited AI Scripts", "4K Ultra HD Exports", "Imagen 4 High-CTR", "Neural Voiceover", "No Watermark", "Priority Sync"],
      buttonText: "Upgrade to Pro",
      icon: Rocket,
      popular: true,
      color: "border-primary shadow-primary/20"
    },
    {
      id: "premium",
      name: "Elite Agency",
      price: "₹499",
      description: "Enterprise Production",
      features: ["Everything in Pro", "Advanced Veo Motion", "Team Collaboration (5 Seats)", "Whitelabel Exports", "Bulk Export Node", "Agency Clearance"],
      buttonText: "Go Enterprise",
      icon: Briefcase,
      popular: false,
      color: "border-indigo-500/30 bg-indigo-500/5"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-16 space-y-24 pt-40">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.5em]">
            <Sparkles className="w-4 h-4" /> GLOBAL SAAS INFRASTRUCTURE
          </div>
          <h1 className="text-7xl md:text-[10rem] font-headline font-bold tracking-tighter text-white uppercase leading-none">
            Scale <span className="text-primary italic">Global.</span>
          </h1>
          <p className="text-muted-foreground text-2xl max-w-2xl mx-auto font-medium italic opacity-60">
            Select the neural clearance level for your enterprise workspace. One-time payment for lifetime SaaS access.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col rounded-[3.5rem] border-2 backdrop-blur-3xl transition-all duration-500 hover:scale-105 overflow-hidden",
              plan.color,
              plan.popular && "blue-glow border-primary"
            )}>
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-2 bg-primary shadow-glow" />
              )}
              <CardHeader className="p-12 pb-8">
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border-2 transition-all",
                  plan.popular ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                )}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-4xl font-headline font-black uppercase tracking-tight">{plan.name}</CardTitle>
                <CardDescription className="text-xl font-medium italic opacity-60 mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-12 pt-0 flex-1 space-y-12">
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black font-headline text-white tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[11px]">/ LIFETIME</span>
                </div>
                <ul className="space-y-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-5 text-sm font-bold text-white/80">
                      <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-12 pt-0">
                <Button 
                  className={cn(
                    "w-full h-20 rounded-[1.8rem] font-black uppercase tracking-widest text-xs transition-all",
                    plan.popular ? "bg-primary shadow-glow hover:bg-primary/90" : "bg-white/5 hover:bg-white/10 text-white"
                  )}
                  asChild
                >
                   <Link href={plan.id === 'free' ? '#' : 'https://razorpay.com/payment-page-placeholder'}>
                    {plan.buttonText}
                   </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="grid md:grid-cols-3 gap-10">
           {[
             { label: "Agency Portal", icon: Landmark, desc: "Bulk management for 100+ projects." },
             { label: "Global CDN", icon: Globe, desc: "High-speed access from any neural node." },
             { label: "Priority Support", icon: ShieldCheck, desc: "4-hour response for Enterprise tiers." }
           ].map((item, i) => (
             <Card key={i} className="rounded-[3rem] bg-white/[0.02] border border-white/5 p-10 flex flex-col items-center text-center space-y-6 hover:border-primary/20 transition-all">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary"><item.icon size={32} /></div>
                <h4 className="text-2xl font-bold uppercase tracking-tight text-white">{item.label}</h4>
                <p className="text-sm text-muted-foreground italic leading-relaxed">{item.desc}</p>
             </Card>
           ))}
        </section>

        <AdBanner adSlot="premium-plans-bottom" variant="large" provider="SaaS Revenue Engine" />
      </main>
    </div>
  );
}
