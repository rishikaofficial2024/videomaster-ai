"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, LayoutTemplate, 
  Zap, LogOut, Loader2, Edit3, ShieldCheck,
  HelpCircle, Crown, Globe, Bell, Smartphone, Gift, Users, Copy, Check, ArrowRight,
  Shield, CreditCard, Heart
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile, loading: profileLoading } = useDoc(profileRef);

  const referralLink = `https://videomaster-ai.tech/signup?ref=${user?.uid || 'studio'}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Protocol Broadcasted", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleUpdateProfile = async () => {
    if (!profileRef || !newDisplayName) return;
    setSaving(true);
    const updateData = { displayName: newDisplayName };
    
    updateDoc(profileRef, updateData)
      .then(() => {
        toast({ title: "Identity Synced", description: "Changes propagated to global nodes." });
        setIsEditing(false);
      })
      .catch(async (serverError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: profileRef.path,
          operation: 'update',
          requestResourceData: updateData,
        } satisfies SecurityRuleContext));
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (!mounted || userLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#03010a]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03010a] pb-40">
      <Navbar />
      
      {/* BACKGROUND DECOR */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] -z-10" />

      <main className="max-w-4xl mx-auto px-6 space-y-20 pt-40 lg:pt-52">
        {/* IDENTITY AREA */}
        <section className="flex flex-col md:flex-row items-center gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-1000 rounded-full" />
             <Avatar className="w-60 h-60 border-[15px] border-[#0a061c] bg-muted shadow-2xl relative z-10 transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-3">
                <AvatarImage src={profile?.photoURL || ""} />
                <AvatarFallback className="text-8xl font-black bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-headline">
                  {profile?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-4 -right-4 bg-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 animate-float border-[6px] border-[#03010a]">
                <Crown className="w-8 h-8 text-primary fill-current" />
             </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel text-[10px] font-black text-primary uppercase tracking-[0.4em] border-white/10">
                 <ShieldCheck size={14} /> UNLOCKED PRO CLEARANCE
               </div>
               <h2 className="text-7xl md:text-9xl font-headline font-black text-white tracking-tighter uppercase leading-[0.8]">
                 {profile?.displayName || "Creator Node"}
               </h2>
               <div className="flex items-center justify-center md:justify-start gap-5 text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 italic">
                  <span>{profile?.email}</span>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span>ID: {profile?.id?.slice(0, 10)}</span>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <Dialog open={isEditing} onOpenChange={setIsEditing}>
                 <DialogTrigger asChild>
                   <Button className="h-16 px-10 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95">
                      <Edit3 className="w-4 h-4 mr-3" /> Edit Identity
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="rounded-[4rem] bg-[#0a061c] border-white/10 p-16 max-w-xl">
                   <DialogHeader className="mb-12 text-center">
                     <DialogTitle className="text-5xl font-headline font-black uppercase tracking-tighter text-white">Identity Settings</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary ml-4">Master Identity Name</label>
                         <Input 
                           placeholder={profile?.displayName || "Identity ID..."} 
                           value={newDisplayName}
                           onChange={(e) => setNewDisplayName(e.target.value)}
                           className="h-20 rounded-full bg-black/40 border-white/10 text-xl px-10 focus:border-primary/50 transition-all text-white font-medium"
                         />
                      </div>
                      <Button className="w-full h-20 rounded-full font-black uppercase tracking-[0.3em] shadow-glow text-xs bg-primary hover:bg-primary/90 transition-all active:scale-95" onClick={handleUpdateProfile} disabled={saving || !newDisplayName}>
                         {saving ? <Loader2 className="animate-spin" /> : "Propagate Identity Sync"}
                      </Button>
                   </div>
                 </DialogContent>
               </Dialog>
               <Button variant="ghost" className="h-16 px-10 rounded-full glass-panel border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-3" /> Terminate Node
               </Button>
            </div>
          </div>
        </section>

        {/* REVENUE / GROWTH HUB */}
        <div className="grid lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 premium-card p-12 space-y-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:rotate-0 transition-all duration-[2s]">
                 <Gift className="w-72 h-72 text-primary" />
              </div>
              <div className="space-y-4 relative z-10">
                 <h3 className="text-4xl font-headline font-black text-white uppercase tracking-tight flex items-center gap-5">
                    <Users className="text-primary w-10 h-10" /> Grow Your Empire
                 </h3>
                 <p className="text-lg text-muted-foreground italic leading-relaxed opacity-60">
                   Invite 3 nodes to join VideoMaster AI and unlock **Unlimited High-Speed 4K Processing** forever.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                 <div className="flex-1 w-full bg-black/40 px-8 py-5 rounded-full border border-white/10 font-mono text-[11px] text-primary truncate shadow-inner">
                    {referralLink}
                 </div>
                 <Button onClick={copyReferral} className="h-16 px-10 rounded-full bg-primary font-black gap-3 active:scale-95 transition-all text-xs tracking-widest shadow-glow">
                    {copied ? <Check size={18}/> : <Copy size={18}/>}
                    {copied ? "NODE COPIED" : "COPY LINK"}
                 </Button>
              </div>
           </Card>

           <Card className="glass-panel p-12 rounded-[4rem] border-white/5 flex flex-col justify-between group hover:border-primary/40 transition-all">
              <div className="space-y-4">
                 <div className="p-4 bg-primary/10 rounded-[1.5rem] w-fit border border-primary/20"><CreditCard className="w-8 h-8 text-primary" /></div>
                 <h4 className="text-2xl font-bold uppercase tracking-tight text-white">Billing Node</h4>
                 <p className="text-sm text-muted-foreground italic opacity-60">Manage your Pro Studio subscription and invoices.</p>
              </div>
              <Link href="/premium" className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-all pt-8">
                 Access Portal <ArrowRight size={18} />
              </Link>
           </Card>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "My Workspace Nodes", icon: Zap, href: "/projects", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "System Matrix Settings", icon: Settings, href: "/settings", color: "text-primary", bg: "bg-primary/10" },
            { label: "Template Repository", icon: LayoutTemplate, href: "/templates", color: "text-accent", bg: "bg-accent/10" },
            { label: "Institutional Hub", icon: Shield, href: "/admin", color: "text-secondary", bg: "bg-secondary/10", show: profile?.isAdmin },
            { label: "Neural Help Desk", icon: HelpCircle, href: "/help", color: "text-white", bg: "bg-white/10" },
          ].filter(item => item.show !== false).map((item, index) => (
            <Link key={index} href={item.href} className="premium-card p-10 flex items-center justify-between group">
              <div className="flex items-center gap-10">
                <div className={cn("p-6 rounded-[2.5rem] shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6", item.bg, item.color)}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                   <span className="text-3xl font-black text-white/90 font-headline uppercase tracking-tight group-hover:text-primary transition-colors">{item.label}</span>
                   <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">Access Production Hub</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full glass-panel border-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:bg-primary group-hover:border-primary transition-all group-hover:translate-x-3 shadow-2xl">
                 <ChevronRight className="w-8 h-8 text-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER AREA */}
        <div className="text-center space-y-10 pt-20">
           <Heart className="w-12 h-12 text-accent mx-auto animate-pulse fill-accent/20" />
           <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[1em] opacity-10">DESIGNED BY NEURAL INTELLIGENCE • INDIA</p>
        </div>
      </main>
    </div>
  );
}