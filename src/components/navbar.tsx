"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Sparkles, User, Crown, LayoutDashboard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Editor", href: "/editor", icon: Video },
    { name: "AI Tools", href: "/ai-tools/script", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 border-b glass-panel z-[100]">
      <div className="max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link className="flex items-center justify-center gap-2 group" href="/dashboard">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden lg:flex items-center gap-2 font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-full" asChild>
            <Link href="/premium">
              <Crown className="h-4 w-4 fill-current" /> Upgrade
            </Link>
          </Button>

          {user ? (
            <Link href="/profile">
              <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-all">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-muted font-bold">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button size="sm" className="rounded-full px-6 font-bold" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          <button 
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <Button className="w-full h-14 rounded-2xl font-bold gap-2 mt-4" asChild>
            <Link href="/premium">
              <Crown className="h-5 w-5 fill-current" /> Upgrade to Pro
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
