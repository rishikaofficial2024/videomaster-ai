
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, ChevronRight, Coins, LayoutTemplate, 
  Zap, Briefcase, Trash2, HelpCircle, LogOut, 
  Maximize2, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  
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
      value: profile?.isPremium ? "∞" : (profile?.credits?.toFixed(1) || "0.0"), 
      href: "/premium",
      color: "text-primary"
    },
    { 
      label: "Template", 
      icon: LayoutTemplate, 
      href: "/templates",
      color: "text-foreground"
    },
    { 
      label: "BeatsClips", 
      icon: Zap, 
      href: "/dashboard",
      color: "text-foreground"
    },
    { 
      label: "Brand Kits", 
      icon: Briefcase, 
      value: "0", 
      href: "#",
      color: "text-foreground"
    },
    { 
      label: "Project Trash", 
      icon: Trash2, 
      value: "0", 
      href: "#",
      color: "text-foreground"
    },
    { 
      label: "Help Center", 
      icon: HelpCircle, 
      href: "/test-connection",
      color: "text-foreground"
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />
      
      {/* Top Icons */}
      <div className="flex justify-end items-center gap-6 p-6">
        <Maximize2 className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
        <Settings className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
      </div>

      <main className="max-w-xl mx-auto px-6 space-y-10">
        {/* User Header */}
        <div className="flex items-center gap-6 py-4">
          <Avatar className="w-24 h-24 border-2 border-primary/20 bg-muted">
            <AvatarImage src={user?.photoURL || userAvatar?.imageUrl} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {user?.displayName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-headline font-bold text-white tracking-tight">
              {user?.displayName || "Please login/register"}
            </h2>
            {!user && (
              <Link href="/login" className="text-primary font-bold hover:underline text-sm">
                Click here to sign in
              </Link>
            )}
          </div>
        </div>

        {/* List Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center justify-between py-6 border-b border-white/5 group hover:bg-white/[0.02] transition-colors px-2 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={item.color}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium text-white/90">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-muted-foreground font-bold text-sm">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        {user && (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 gap-4 py-8 rounded-2xl"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
            <span className="text-lg font-bold">Log Out from Studio</span>
          </Button>
        )}

        <div className="text-center pt-8">
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold opacity-30">VideoMaster AI • Mobile Node v1.2</p>
        </div>
      </main>
    </div>
  );
}
