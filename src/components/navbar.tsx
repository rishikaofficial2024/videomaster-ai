"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Sparkles, Settings, User, LayoutDashboard, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Editor", href: "/editor", icon: Video },
    { name: "AI Tools", href: "/ai-tools", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="h-16 border-b px-4 lg:px-8 flex items-center justify-between bg-background sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link className="flex items-center justify-center gap-2" href="/dashboard">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <Video className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">VideoMaster AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="rounded-full md:hidden">
          <Link href="/dashboard"><Home className="h-5 w-5" /></Link>
        </Button>
        <Button variant="outline" size="sm" className="rounded-full hidden lg:flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5">
          <Crown className="h-4 w-4 fill-current" /> Upgrade to Pro
        </Button>
        <div className="h-8 w-8 rounded-full bg-muted border overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
          <img src="https://picsum.photos/seed/user/100/100" alt="User Profile" />
        </div>
      </div>
    </nav>
  );
}

import { Button } from "@/components/ui/button";