"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, Coins, LayoutTemplate, 
  Zap, LogOut, Loader2, Edit3, ShieldCheck, UserCircle,
  HelpCircle, Star, Crown
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
        toast({ title: "Success!", description: "Profile updated successfully." });
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

  if (userLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const menuItems = [
    { 
      label: "Free Pro Studio", 
      icon: Crown, 
      value: "∞", 
      href: "/premium",
      color: "text-primary"
    },
    { 
      label: "My Projects", 
      icon: Zap, 
      href: "/projects",
      color: "text-emerald-400"
    },
    { 
      label: "Templates", 
      icon: LayoutTemplate, 
      href: "/templates",
      color: "text-indigo-400"
    },
    { 
      label: "Admin Panel", 
      icon: ShieldCheck, 
      href: "/admin",
      color: "text-red-500",
      show: profile?.isAdmin
    },
    { 
      label: "Support Hub", 
      icon: HelpCircle, 
      href: "/test-connection",
      color: "text-muted-foreground"
    },
  ].filter(item => item.show !== false);

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <div className="flex justify-between items-center p-8 pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
           <Crown className="w-3 h-3 text-primary" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             UNLIMITED PRO CREATOR
           </span>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
              <Edit3 className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] bg-[#0a0d14] border-white/10 p-10">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-headline font-bold">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Full Name</label>
                  <Input 
                    placeholder={profile?.displayName || "Enter name"} 
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="h-14 rounded-2xl bg-black/40 border-white/10"
                  />
               </div>
               <Button className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20" onClick={handleUpdateProfile} disabled={saving || !newDisplayName}>
                  {saving ? <Loader2 className="animate-spin" /> : "Sync Changes"}
               </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <main className="max-w-xl mx-auto px-6 space-y-12">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
             <Avatar className="w-40 h-40 border-8 border-white/5 bg-muted shadow-2xl blue-glow">
                <AvatarImage src={profile?.photoURL || ""} />
                <AvatarFallback className="text-5xl font-bold bg-primary/10 text-primary font-headline">
                  {profile?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             <div className="absolute bottom-2 right-2 bg-primary p-3 rounded-2xl shadow-xl shadow-primary/40 animate-float">
                <Crown className="w-5 h-5 text-white fill-current" />
             </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-5xl font-headline font-bold text-white tracking-tighter">
              {profile?.displayName || "Creator Node"}
            </h2>
            <p className="text-sm font-medium text-muted-foreground opacity-60">{profile?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center justify-between p-6 bg-white/5 border border-white/5 group hover:bg-white/[0.08] hover:border-primary/30 transition-all rounded-[2.5rem] shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className={cn("p-4 rounded-2xl bg-black/40 shadow-inner", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-xl font-bold text-white/90 font-headline">{item.label}</span>
              </div>
              <div className="flex items-center gap-4">
                {item.value && (
                  <span className="text-primary font-bold text-2xl font-headline">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 gap-6 h-24 rounded-[2.5rem] px-10 transition-all border border-transparent hover:border-destructive/20"
          onClick={handleLogout}
        >
          <div className="p-4 rounded-2xl bg-destructive/10">
            <LogOut className="w-7 h-7" />
          </div>
          <span className="text-xl font-bold font-headline">Sign Out from Studio</span>
        </Button>

        <div className="text-center pt-10">
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-bold opacity-20">VideoMaster AI • 100% Free Unlocked Build</p>
        </div>
      </main>
    </div>
  );
}
