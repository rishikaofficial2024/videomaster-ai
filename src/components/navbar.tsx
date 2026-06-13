
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, LayoutTemplate, FolderOpen, User, Settings, Crown, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editor", href: "/editor", icon: Video },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Premium", href: "/premium", icon: Crown },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t md:top-0 md:bottom-auto md:border-t-0 md:border-b h-16 md:h-20 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 mr-8">
          <div className="bg-primary rounded-lg p-1">
            <Video className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">VideoMaster <span className="text-primary">AI</span></span>
        </div>
        
        <div className="flex-1 flex justify-around md:justify-end md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
