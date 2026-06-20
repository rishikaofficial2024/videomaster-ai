
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Search, Compass, Crown, User, 
  Video, Sparkles, ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Search", href: "/projects", icon: Search },
  { name: "Explore", href: "/templates", icon: Compass },
  { name: "Premium", href: "/premium", icon: Crown },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  return (
    <>
      {/* Desktop Header Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-3xl border-b border-white/5 h-20 items-center justify-center px-8 shadow-2xl">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-primary rounded-2xl p-2.5 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <Video className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
          </Link>

          <div className="flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-all",
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
            {profile?.isAdmin && (
              <Link href="/admin" className="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar (Matches Screenshot) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-3xl border-t border-white/5 md:hidden h-24 flex items-center justify-around px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all p-3",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-7 h-7", isActive && "fill-current")} />
              <span className="sr-only">{item.name}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1 shadow-glow shadow-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
