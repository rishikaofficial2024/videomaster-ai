"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, Coins, LayoutTemplate, 
  Zap, LogOut, Loader2, Edit3, ShieldCheck, UserCircle,
  HelpCircle, Star, Crown, Globe, Bell, Smartphone
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile, loading: profileLoading } = useDoc(profileRef);

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
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'update',
          requestResourceData: updateData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
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

  const menuItems = [
    { 
      label: "My Project Workspace", 
      icon: Zap, 
      href: "/projects",
      color: "text-emerald-400"
    },
    { 
      label: "System Settings", 
      icon: Settings, 
      href: "/settings",
      color: "text-primary"
    },
    { 
      label: "Templates Library", 
      icon: LayoutTemplate, 
      href: "/templates",
      color: "text-indigo-400"
    },
    { 
      label: "Master Admin Hub", 
      icon: ShieldCheck, 
      href: "/admin",
      color: "text-red-500",
      show: profile?.isAdmin
    },
    { 
      label: "Help & Technical Hub", 
      icon: HelpCircle, 
      href: "/help",
      color: "text-muted-foreground"
    },
  ].filter(item => item.show !== false);

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

      <main className="max-w-2xl mx-auto px-6 space-y-16">
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

        <div className="grid grid-cols-1 gap-6">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center justify-between p-8 bg-[#0a0d14]/40 border border-white/5 group hover:bg-[#0a0d14]/80 hover:border-primary/30 transition-all rounded-[3rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer opacity-[0.02] pointer-events-none" />
              <div className="flex items-center gap-8 relative z-10">
                <div className={cn("p-5 rounded-2xl bg-black/40 shadow-inner transition-transform group-hover:scale-110 duration-500", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-2xl font-bold text-white/90 font-headline uppercase tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all relative z-10" />
            </Link>
          ))}
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 gap-8 h-28 rounded-[3.5rem] px-10 transition-all border border-transparent hover:border-destructive/20 shadow-2xl"
          onClick={handleLogout}
        >
          <div className="p-5 rounded-2xl bg-destructive/10">
            <LogOut className="w-8 h-8" />
          </div>
          <span className="text-2xl font-black font-headline uppercase tracking-tighter">Terminate Studio Session</span>
        </Button>

        <div className="text-center pt-16 pb-10 space-y-6">
           <div className="flex justify-center gap-12 opacity-30">
              <div className="flex flex-col items-center gap-2">
                 <Globe className="w-5 h-5" />
                 <span className="text-[8px] font-black uppercase tracking-widest">CDN SYNC</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <Bell className="w-5 h-5" />
                 <span className="text-[8px] font-black uppercase tracking-widest">PUSH READY</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <Smartphone className="w-5 h-5" />
                 <span className="text-[8px] font-black uppercase tracking-widest">MOBILE OPS</span>
              </div>
           </div>
           <p className="text-[10px] text-muted-foreground/20 uppercase tracking-[0.8em] font-black">VideoMaster AI • ELITE GLOBAL PRODUCTION</p>
        </div>
      </main>
    </div>
  );
}
