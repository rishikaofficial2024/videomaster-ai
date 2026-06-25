"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, LayoutTemplate, 
  Zap, LogOut, Loader2, Edit3, ShieldCheck,
  HelpCircle, Crown, Globe, Bell, Smartphone, Gift, Users, Copy, Check, ArrowRight
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

  const referralLink = `https://videomaster-ai.com/signup?ref=${user?.uid || 'studio'}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Referral Link Copied", description: "Share this link with your creative network." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleUpdateProfile = async () => {
    if (!profileRef || !newDisplayName) return;
    setSaving(true);
    try {
      await updateDoc(profileRef, { displayName: newDisplayName });
      toast({ title: "Profile Node Updated", description: "Your creative identity has been synchronized." });
      setIsEditing(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Sync Failed", description: "Could not update identity node." });
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || userLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 space-y-16 pt-32 lg:pt-40">
        {/* User Identity Header */}
        <section className="flex flex-col md:flex-row items-center gap-10 p-10 bg-card rounded-[3rem] shadow-2xl ring-1 ring-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Zap className="h-64 w-64 text-primary" />
          </div>
          
          <div className="relative group/avatar">
             <Avatar className="w-48 h-48 border-8 border-background shadow-2xl group-hover/avatar:scale-105 transition-transform duration-500">
                <AvatarImage src={profile?.photoURL || ""} />
                <AvatarFallback className="text-6xl font-black bg-primary/10 text-primary">
                  {profile?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             <div className="absolute bottom-2 right-2 bg-primary p-3 rounded-2xl shadow-xl z-10 border-4 border-card">
                <Crown className="w-6 h-6 text-primary-foreground fill-current" />
             </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20">
                 <ShieldCheck size={14} /> PRO ACCOUNT VERIFIED
               </div>
               <h2 className="text-5xl font-black tracking-tight leading-none uppercase">
                 {profile?.displayName || "Anonymous Creator"}
               </h2>
               <p className="text-lg text-muted-foreground font-medium italic opacity-60">{profile?.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <Dialog open={isEditing} onOpenChange={setIsEditing}>
                 <DialogTrigger asChild>
                   <Button className="rounded-2xl h-14 px-8 font-bold gap-3 active:scale-95 transition-all">
                      <Edit3 className="h-5 w-5" /> Edit Profile
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="rounded-[2rem] sm:rounded-[3rem] p-10 max-w-lg">
                   <DialogHeader className="mb-6">
                     <DialogTitle className="text-3xl font-black uppercase tracking-tight">Identity Settings</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</label>
                         <Input 
                           placeholder="Enter your creator name" 
                           value={newDisplayName}
                           onChange={(e) => setNewDisplayName(e.target.value)}
                           className="h-16 rounded-2xl bg-muted/30 border-none ring-1 ring-border text-lg px-6 focus:ring-2 focus:ring-primary transition-all"
                         />
                      </div>
                      <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={handleUpdateProfile} disabled={saving || !newDisplayName}>
                         {saving ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
                      </Button>
                   </div>
                 </DialogContent>
               </Dialog>
               <Button variant="ghost" className="rounded-2xl h-14 px-8 font-bold hover:bg-destructive/10 hover:text-destructive transition-all" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" /> Logout
               </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           <Card className="premium-card p-8 flex flex-col justify-between h-48 group">
              <div className="p-3 bg-blue-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Video className="h-8 w-8 text-blue-500" /></div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Masterpieces</p>
                 <h4 className="text-4xl font-black tracking-tight">{profile?.usageStats?.totalVideos || 0}</h4>
              </div>
           </Card>
           <Card className="premium-card p-8 flex flex-col justify-between h-48 group">
              <div className="p-3 bg-purple-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Wand2 className="h-8 w-8 text-purple-500" /></div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">AI Generations</p>
                 <h4 className="text-4xl font-black tracking-tight">{profile?.usageStats?.aiGenerations || 0}</h4>
              </div>
           </Card>
           <Card className="premium-card p-8 flex flex-col justify-between h-48 group bg-primary text-primary-foreground">
              <div className="p-3 bg-white/20 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Zap className="h-8 w-8 fill-current" /></div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Credits Remaining</p>
                 <h4 className="text-4xl font-black tracking-tight">{profile?.credits?.toLocaleString() || "∞"}</h4>
              </div>
           </Card>
        </div>

        {/* Growth Hack Card */}
        <Card className="rounded-[3rem] p-10 bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <Gift className="h-48 w-48" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                    <Users className="h-8 w-8" /> Grow Your Network
                 </h3>
                 <p className="text-lg font-medium italic opacity-80 max-w-2xl">
                   Invite 3 fellow creators and unlock **Unlimited AI Video Generation** for a lifetime.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                 <div className="flex-1 w-full bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl font-bold text-sm truncate border border-white/20">
                    {referralLink}
                 </div>
                 <Button onClick={copyReferral} variant="secondary" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 active:scale-95 transition-all">
                    {copied ? <Check size={18}/> : <Copy size={18}/>}
                    {copied ? "Copied" : "Copy Node"}
                 </Button>
              </div>
           </div>
        </Card>

        {/* Navigation List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 ml-4 mb-6">Production Settings</h3>
          {[
            { label: "My Project Node Archive", icon: LayoutTemplate, href: "/projects", color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Neural Flow Configuration", icon: Settings, href: "/settings", color: "text-primary", bg: "bg-primary/10" },
            { label: "Template Repository", icon: Smartphone, href: "/templates", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "System Support Node", icon: HelpCircle, href: "/support", color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="premium-card p-6 flex items-center justify-between group rounded-[1.8rem] mb-4">
                <div className="flex items-center gap-6">
                  <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", item.bg, item.color)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors">{item.label}</span>
                </div>
                <div className="h-10 w-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:translate-x-2">
                   <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
