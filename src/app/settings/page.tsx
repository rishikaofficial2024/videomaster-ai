"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Settings, Bell, Shield, Languages, Eye, Moon, 
  Sun, Database, Download, HelpCircle, MessageSquare, 
  Info, ArrowLeft, ChevronRight, Check, Trash2, 
  Smartphone, Monitor, Zap, Globe, Gauge
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [cacheSize, setCacheSize] = useState("124 MB");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearCache = () => {
    setCacheSize("0 KB");
    toast({ title: "Cache Purged", description: "Storage space recovered successfully." });
  };

  if (!mounted) return null;

  const sections = [
    {
      title: "Interface & Style",
      icon: Eye,
      items: [
        { 
          label: "Visual Protocol", 
          desc: "Switch between Deep Obsidian and Studio Light.", 
          control: (
            <div className="flex bg-white/5 p-1 rounded-xl">
               <Button 
                variant={theme === 'dark' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setTheme('dark')}
                className="rounded-lg h-9"
               >
                 <Moon className="w-4 h-4" />
               </Button>
               <Button 
                variant={theme === 'light' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setTheme('light')}
                className="rounded-lg h-9"
               >
                 <Sun className="w-4 h-4" />
               </Button>
            </div>
          )
        },
        { 
          label: "Studio Language", 
          desc: "Localization for global creators.", 
          control: (
            <Select defaultValue="en">
              <SelectTrigger className="w-[120px] h-10 bg-black/40 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0d14] border-white/10">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          )
        }
      ]
    },
    {
      title: "System & Network",
      icon: Gauge,
      items: [
        { 
          label: "Neural Notifications", 
          desc: "Get alerts when AI generation completes.", 
          control: <Switch checked={notifications} onCheckedChange={setNotifications} /> 
        },
        { 
          label: "Low Data Mode", 
          desc: "Reduce preview quality on cellular nodes.", 
          control: <Switch checked={lowDataMode} onCheckedChange={setLowDataMode} /> 
        }
      ]
    },
    {
      title: "Storage Management",
      icon: Database,
      items: [
        { 
          label: "Cached Workspace", 
          desc: `Using ${cacheSize} of temporary storage.`, 
          control: <Button variant="outline" size="sm" onClick={handleClearCache} className="rounded-xl border-white/10 h-10"><Trash2 className="w-3.5 h-3.5 mr-2" /> Clear</Button> 
        },
        { 
          label: "Export Defaults", 
          desc: "Set priority output resolution.", 
          control: (
            <Select defaultValue="4k">
              <SelectTrigger className="w-[120px] h-10 bg-black/40 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0d14] border-white/10">
                <SelectItem value="4k">Ultra 4K</SelectItem>
                <SelectItem value="1080">HD 1080p</SelectItem>
                <SelectItem value="720">SD 720p</SelectItem>
              </SelectContent>
            </Select>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 md:p-12 mt-24 space-y-16">
        <header className="space-y-6">
          <Link href="/profile" className="flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em] group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/50 border border-transparent transition-all shadow-xl">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back to Profile
          </Link>
          <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white">System <span className="text-primary italic">Node</span></h1>
             <p className="text-muted-foreground text-xl font-medium italic opacity-60">Configure your creative environment and neural parameters.</p>
          </div>
        </header>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-8">
               <div className="flex items-center gap-4 px-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight text-white/80">{section.title}</h3>
               </div>
               
               <Card className="rounded-[3rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                     {section.items.map((item, i) => (
                       <div key={i} className={cn(
                         "flex items-center justify-between p-8 hover:bg-white/[0.02] transition-all",
                         i !== section.items.length - 1 && "border-b border-white/5"
                       )}>
                          <div className="space-y-1">
                             <p className="font-bold text-white uppercase tracking-tight">{item.label}</p>
                             <p className="text-xs text-muted-foreground italic">{item.desc}</p>
                          </div>
                          {item.control}
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </section>
          ))}

          {/* 🔗 HELPFUL LINKS */}
          <div className="grid md:grid-cols-2 gap-6">
             {[
               { label: "Help & Support Hub", href: "/help", icon: HelpCircle },
               { label: "About VideoMaster AI", href: "/about", icon: Info },
               { label: "Legal & Privacy Node", href: "/privacy", icon: Shield },
               { label: "Report a Neural Bug", href: "/help", icon: MessageSquare }
             ].map((link, i) => (
               <Link key={i} href={link.href}>
                 <Card className="p-6 rounded-3xl bg-white/5 border-white/5 hover:border-primary/40 hover:bg-white/[0.08] transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-black/40 rounded-xl text-muted-foreground group-hover:text-primary transition-all">
                          <link.icon className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-white/80 uppercase tracking-tight text-xs">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                 </Card>
               </Link>
             ))}
          </div>
        </div>

        <footer className="text-center space-y-4 pt-10">
           <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.6em] opacity-20">VideoMaster AI Production Build v2.5.0</p>
           <div className="flex justify-center gap-6 opacity-20 text-[8px] font-bold uppercase tracking-widest">
              <span>Stable</span>
              <span>Encrypted</span>
              <span>Global</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
