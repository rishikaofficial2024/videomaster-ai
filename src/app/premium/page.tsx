
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Cloud, Video, ShieldCheck, Loader2, Star, Rocket, Building2, CheckCircle2, Banknote, CreditCard, ArrowRight, Coins, Gem } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";

export default function PremiumPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, "users", user.uid) : null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "₹0",
      description: "Perfect for beginners",
      features: ["100 AI Credits", "720p Exports", "Basic AI Scripts", "Standard Support"],
      buttonText: "Current Plan",
      icon: Star,
      color: "border-slate-800"
    },
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹99",
      description: "Best for creators",
      features: ["Unlimited AI Credits", "4K Ultra HD Exports", "Imagen 4 Thumbnails", "No Watermark", "Priority AI Queue"],
      buttonText: "Upgrade to Pro",
      icon: Rocket,
      popular: true,
      color: "border-primary shadow-primary/20"
    },
    {
      id: "business",
      name: "Agency",
      price: "₹499",
      description: "For professional teams",
      features: ["Everything in Pro", "Team Collaboration", "API Access", "Commercial License", "1-on-1 Consulting"],
      buttonText: "Join Agency",
      icon: Building2,
      color: "border-purple-500 shadow-purple-500/10"
    }
  ];

  const creditPacks = [
    { id: "pack-1", name: "Mini Pack", credits: 500, price: "₹49", icon: Coins },
    { id: "pack-2", name: "Creator Pack", credits: 2000, price: "₹149", icon: Gem, popular: true },
    { id: "pack-3", name: "Bulk Pack", credits: 5000, price: "₹299", icon: Zap },
  ];

  const handleAction = async (id: string, type: 'plan' | 'credits', amount?: number) => {
    if (!user || id === "free") return;
    setLoadingAction(id);
    
    const userRef = doc(db, "users", user.uid);
    let data: any = {};

    if (type === 'plan') {
      data = {
        isPremium: true,
        subscriptionPlan: id,
        credits: 99999,
        updatedAt: new Date().toISOString()
      };
    } else {
      data = {
        credits: increment(amount || 0),
        updatedAt: new Date().toISOString()
      };
    }

    try {
      // Simulation of a payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateDoc(userRef, data).catch(async (e) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: "update",
          requestResourceData: data
        } satisfies SecurityRuleContext);
        errorEmitter.emit("permission-error", permissionError);
      });
      
      setShowSuccess(true);
      toast({
        title: type === 'plan' ? "Welcome to Pro Studio!" : "Credits Added!",
        description: "Your account has been updated successfully.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: e.message || "Please try again later.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-primary" />
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-headline font-bold text-white tracking-tighter">PAYMENT SUCCESS!</h1>
              <p className="text-muted-foreground font-medium italic leading-relaxed">Aapka account update ho gaya hai. Ab aap bina kisi rok-tok ke kamaal ki videos bana sakte hain.</p>
           </div>
           <Button className="w-full h-16 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background hero-gradient">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-16 py-12">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Crown className="w-3 h-3 fill-current" /> Monetize Your Creativity
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">Choose Your <span className="text-primary italic">Success Plan</span></h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium italic">
            Everything you need to grow your channel and earn more from every video.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col rounded-[3rem] border-2 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:scale-105 overflow-hidden",
              plan.color,
              plan.popular && "blue-glow"
            )}>
              {plan.popular && (
                <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                  Best Seller
                </div>
              )}
              <CardHeader className="p-10 pb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  plan.id === "pro" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
                <CardDescription className="text-base font-medium">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 flex-1 space-y-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold font-headline">{plan.price}</span>
                  <span className="text-muted-foreground font-bold italic">/ month</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className="bg-green-500/10 p-1 rounded-full">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-10 pt-0">
                <Button 
                  className={cn(
                    "w-full h-16 rounded-2xl font-bold text-lg transition-all",
                    plan.popular ? "bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30" : "variant-outline"
                  )}
                  disabled={loadingAction === plan.id || (profile?.subscriptionPlan === plan.id) || plan.id === "free"}
                  onClick={() => handleAction(plan.id, 'plan')}
                >
                  {loadingAction === plan.id ? <Loader2 className="animate-spin" /> : (profile?.subscriptionPlan === plan.id ? "Current Plan" : plan.buttonText)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* AdSense Placement */}
        <AdBanner variant="large" provider="Google AdMob Hub" />

        {/* Credit Packs */}
        <div className="space-y-8 pt-8">
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-bold">One-Time <span className="text-indigo-400">Credit Packs</span></h2>
              <p className="text-muted-foreground italic">Don't want to subscribe? Just top up your account.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
              {creditPacks.map((pack) => (
                <Card key={pack.id} className={cn(
                  "rounded-[2.5rem] bg-white/5 border-white/5 p-8 text-center space-y-6 transition-all hover:border-indigo-500/30",
                  pack.popular && "border-indigo-500/20 bg-indigo-500/5"
                )}>
                   <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                      <pack.icon className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-bold text-xl">{pack.name}</h4>
                      <p className="text-indigo-400 font-bold font-headline text-2xl">+{pack.credits} Credits</p>
                   </div>
                   <Button 
                     variant="outline" 
                     className="w-full h-12 rounded-xl font-bold border-indigo-500/20 hover:bg-indigo-500/10"
                     onClick={() => handleAction(pack.id, 'credits', pack.credits)}
                     disabled={loadingAction === pack.id}
                   >
                     {loadingAction === pack.id ? <Loader2 className="animate-spin" /> : `Buy for ${pack.price}`}
                   </Button>
                </Card>
              ))}
           </div>
        </div>

        {/* Bank Connection Info Card */}
        <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-[3.5rem] p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-xl">
                 <Banknote className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="space-y-3">
                 <h3 className="text-3xl font-bold font-headline">Bank Account & Withdrawals</h3>
                 <p className="text-muted-foreground text-lg max-w-xl font-medium italic">Aapki saari kamai (Ads + Subscriptions) direct bank mein aayegi. Razorpay aur AdSense setup ke liye guide padhein.</p>
              </div>
           </div>
           <Button className="h-20 px-12 rounded-3xl bg-emerald-600 font-bold text-lg shadow-2xl shadow-emerald-600/20 hover:scale-105" asChild>
              <Link href="/BANK_TRANSFER_GUIDE.md">Paisa Withdraw Karein <ArrowRight className="ml-3 w-5 h-5" /></Link>
           </Button>
        </section>

        <AdBanner provider="Premium Creator Ads" />
      </main>
    </div>
  );
}
