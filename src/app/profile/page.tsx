
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, LayoutTemplate, 
  Zap, LogOut, Loader2, Edit3, ShieldCheck,
  HelpCircle, Crown, Globe, Bell, Smartphone, Gift, Users, Copy, Check
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
    toast({ title: "Referral Link Copied!", description: "Share this to earn free Pro credits." });
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
        toast({ title: "Profile Synced", description: "Changes propagated to global nodes." });
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
      <div className="h-screen flex items-center justify-center bg-[#05070a]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <div className="flex justify-between items-center p-8 pt-28">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
           <Crown className="w-3.5 h-3.5 text-primary" />
           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
             UNLOCKED PRO CREATOR
           </span>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-2xl h-11 w-11 bg-white/5 hover:bg-primary/20 hover:text-primary transition-all border border-white/5 shadow-2xl">
              <Edit3 className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[3rem] bg-[#0a0d14] border-white/10 p-12 max-w-md">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-headline font-black uppercase tracking-tight">Identity Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Creator Name</label>
                  <Input 
                    placeholder={profile?.displayName || "Enter identity..."} 
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="h-16 rounded-2xl bg-black/40 border-white/10 text-lg px-6"
                  />
               </div>
               <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 text-xs" onClick={handleUpdateProfile} disabled={saving || !newDisplayName}>
                  {saving ? <Loader2 className="animate-spin" /> : "PROPOAGATE CHANGES"}
               </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <main className="max-w-2xl mx-auto px-6 space-y-12">
        <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full scale-125 group-hover:scale-150 transition-all duration-1000" />
             <Avatar className="w-48 h-48 border-[10px] border-[#0a0d14] bg-muted shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                <AvatarImage src={profile?.photoURL || ""} />
                <AvatarFallback className="text-6xl font-black bg-primary/10 text-primary font-headline">
                  {profile?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-2 -right-2 bg-primary p-4 rounded-3xl shadow-[0_15px_40px_rgba(59,130,246,0.5)] z-20 animate-float border-4 border-[#05070a]">
                <Crown className="w-6 h-6 text-white fill-current" />
             </div>
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-6xl font-headline font-black text-white tracking-tighter uppercase leading-none">
              {profile?.displayName || "Creator Node"}
            </h2>
            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">
               <span>{profile?.email}</span>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
               <span>ID: {profile?.id?.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        {/* 🎁 REFERRAL NODE */}
        <Card className="rounded-[3.5rem] bg-primary/10 border-2 border-primary/30 p-10 space-y-8 relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Gift className="w-60 h-60 text-primary" />
           </div>
           <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-headline font-black text-white uppercase tracking-tight flex items-center gap-4">
                 <Users className="text-primary w-8 h-8" /> GROW YOUR EMPIRE
              </h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                Invite 3 friends to join VideoMaster AI and unlock **Unlimited High-Speed 4K Exports** for life.
              </p>
           </div>
           <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 relative z-10">
              <div className="flex-1 truncate text-[10px] font-mono text-primary px-2">{referralLink}</div>
              <Button onClick={copyReferral} size="sm" className="rounded-xl h-10 px-6 gap-2 bg-primary">
                 {copied ? <Check size={16}/> : <Copy size={16}/>}
                 {copied ? "COPIED" : "COPY"}
              </Button>
           </div>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "My Workspace", icon: Zap, href: "/projects", color: "text-emerald-400" },
            { label: "System Settings", icon: Settings, href: "/settings", color: "text-primary" },
            { label: "Templates Library", icon: LayoutTemplate, href: "/templates", color: "text-indigo-400" },
            { label: "Master Admin Hub", icon: ShieldCheck, href: "/admin", color: "text-red-500", show: profile?.isAdmin },
            { label: "Help & Technical", icon: HelpCircle, href: "/help", color: "text-muted-foreground" },
          ].filter(item => item.show !== false).map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center justify-between p-8 bg-[#0a0d14]/40 border border-white/5 group hover:bg-[#0a0d14]/80 hover:border-primary/30 transition-all rounded-[3rem] shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-8 relative z-10">
                <div className={cn("p-5 rounded-2xl bg-black/40 shadow-inner transition-transform group-hover:scale-110", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-2xl font-bold text-white/90 font-headline uppercase tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all" />
            </Link>
          ))}
        </div>

        <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 gap-8 h-28 rounded-[3.5rem] px-10 transition-all shadow-2xl" onClick={handleLogout}>
          <div className="p-5 rounded-2xl bg-destructive/10"><LogOut className="w-8 h-8" /></div>
          <span className="text-2xl font-black font-headline uppercase tracking-tighter">Terminate Session</span>
        </Button>

        <p className="text-center text-[10px] text-muted-foreground/20 uppercase tracking-[0.8em] font-black pt-10">VideoMaster AI • ELITE GLOBAL PRODUCTION</p>
      </main>
    </div>
  );
}
