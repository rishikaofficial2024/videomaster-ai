
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, Coins, LayoutTemplate, 
  Zap, Briefcase, Trash2, HelpCircle, LogOut, 
  Maximize2, Loader2, Edit3, ShieldCheck, UserCircle
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const userAvatar = PlaceHolderImages.find(img => img.id === "avatar-user");

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
    try {
      await updateDoc(profileRef, { displayName: newDisplayName });
      toast({ title: "Profile Updated", description: "Your display name has been changed." });
      setIsEditing(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
    } finally {
      setSaving(false);
    }
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
      label: "Credit Center", 
      icon: Coins, 
      value: profile?.isPremium ? "∞" : (profile?.credits?.toFixed(0) || "0"), 
      href: "/premium",
      color: "text-primary"
    },
    { 
      label: "Templates", 
      icon: LayoutTemplate, 
      href: "/templates",
      color: "text-indigo-400"
    },
    { 
      label: "My Projects", 
      icon: Zap, 
      href: "/projects",
      color: "text-emerald-400"
    },
    { 
      label: "Admin Panel", 
      icon: ShieldCheck, 
      href: "/admin",
      color: "text-red-500",
      show: profile?.isAdmin
    },
    { 
      label: "Help Center", 
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
           <ShieldCheck className={cn("w-3 h-3", profile?.isAdmin ? "text-red-500" : "text-primary")} />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             {profile?.isAdmin ? "Master Admin Node" : (profile?.isPremium ? "Premium Creator" : "Standard Node")}
           </span>
        </div>
        <div className="flex items-center gap-4">
           <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                  <Edit3 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] bg-[#0a0d14] border-white/10">
                <DialogHeader>
                  <DialogTitle className="font-headline font-bold">Edit Profile Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Display Name</label>
                      <Input 
                        placeholder={profile?.displayName || "Enter name"} 
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="h-14 rounded-2xl bg-black/40 border-white/10"
                      />
                   </div>
                   <Button className="w-full h-14 rounded-2xl font-bold" onClick={handleUpdateProfile} disabled={saving}>
                      {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
                   </Button>
                </div>
              </DialogContent>
           </Dialog>
           <Settings className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 space-y-12">
        {/* User Header */}
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative">
             <Avatar className="w-32 h-32 border-4 border-primary/20 bg-muted shadow-2xl blue-glow">
                <AvatarImage src={user?.photoURL || userAvatar?.imageUrl} />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {profile?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             {profile?.isPremium && (
               <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full shadow-lg">
                  <Star className="w-4 h-4 text-white fill-current" />
               </div>
             )}
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-headline font-bold text-white tracking-tighter">
              {profile?.displayName || "Anonymous Creator"}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* List Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center justify-between p-6 bg-white/5 border border-white/5 group hover:bg-white/[0.08] hover:border-primary/20 transition-all rounded-[2rem]"
            >
              <div className="flex items-center gap-6">
                <div className={cn("p-3 rounded-2xl bg-black/40", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-bold text-white/90">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.value && (
                  <span className="text-primary font-bold text-lg">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 gap-6 h-20 rounded-[2rem] px-8"
          onClick={handleLogout}
        >
          <div className="p-3 rounded-2xl bg-destructive/10">
            <LogOut className="w-6 h-6" />
          </div>
          <span className="text-lg font-bold">Sign Out from Studio</span>
        </Button>

        <div className="text-center pt-8">
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-bold opacity-30">VideoMaster AI • Mobile Node v1.5</p>
        </div>
      </main>
    </div>
  );
}
