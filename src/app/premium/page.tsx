"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Rocket, Star, Sparkles, Gem, ShieldCheck } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";

/**
 * 💎 PREMIUM HUB: Optimized for 3-Tier Revenue Generation.
 */
export default function PremiumPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, "users", user.uid) : null);

  const plans = [
    {
      id: "free",
      name: "Starter Hub",
      price: "₹0",
      description: "Perfect for Beginners",
      features: ["5 AI Scripts / day", "Standard HD Exports", "Basic Thumbnails", "Community Support", "With Watermark"],
      buttonText: "Active Node",
      icon: Zap,
      popular: false,
      color: "border-white/5 bg-white/5"
    },
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹99",
      description: "Viral Creator Choice",
      features: ["Unlimited AI Scripts", "4K Ultra HD Exports", "Imagen 4 High-CTR", "Neural Voiceover", "No Watermark", "Priority Support"],
      buttonText: "Upgrade to Pro",
      icon: Rocket,
      popular: true,
      color: "border-primary shadow-primary/20"
    },
    {
      id: "premium",
      name: "Elite Node",
      price: "₹499",
      description: "Full Production Agency",
      features: ["Everything in Pro", "Advanced Veo Motion", "Unlimited Cloud Storage", "1-on-1 AI Training", "Bulk Export Node", "Agency Clearance"],
      buttonText: "Go Elite",
      icon: Gem,
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
            <Sparkles className="w-4 h-4" /> REVENUE INFRASTRUCTURE: LIVE
          </div>
          <h1 className="text-7xl md:text-[10rem] font-headline font-bold tracking-tighter text-white uppercase leading-none">
            Unlock <span className="text-primary italic">Power.</span>
          </h1>
          <p className="text-muted-foreground text-2xl max-w-2xl mx-auto font-medium italic opacity-60">
            Select the neural clearance level for your creative workspace. One-time payment for lifetime access.
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
                   <Link href={plan.id === 'pro' ? 'https://razorpay.com/payment-page-placeholder' : '#'}>
                    {plan.buttonText}
                   </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="py-12">
           <AdBanner adSlot="premium-plans-bottom" variant="large" provider="Subscription Hub Ads" />
        </section>

        <div className="grid md:grid-cols-2 gap-10">
           <Card className="rounded-[4rem] bg-[#0a0d14]/80 border border-white/5 p-12 flex items-center gap-10 hover:border-primary/30 transition-all">
              <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 shadow-xl">
                 <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Enterprise Shield</h4>
                 <p className="text-muted-foreground text-lg italic leading-relaxed">Advanced security and high-speed multi-node processing for agencies.</p>
              </div>
           </Card>
           <Card className="rounded-[4rem] bg-[#0a0d14]/80 border border-white/5 p-12 flex items-center gap-10 hover:border-amber-500/30 transition-all">
              <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20 shadow-xl">
                 <Star className="w-12 h-12 text-amber-500 fill-current" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-3xl font-bold font-headline text-white uppercase tracking-tight">Referral Node</h4>
                 <p className="text-muted-foreground text-lg italic leading-relaxed">Invite 3 friends to join VideoMaster AI and unlock Pro Studio for FREE.</p>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}
