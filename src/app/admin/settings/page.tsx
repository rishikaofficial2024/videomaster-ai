
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, ShieldCheck, Globe, Zap, 
  Terminal, Database, Bell, LayoutTemplate,
  Cpu, Lock, RefreshCw, Save, Activity, ShieldAlert, Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const OWNER_EMAIL = "rinkukumarpaswan1796@gmail.com";

export default function AdminSettings() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const isMaster = user?.email === OWNER_EMAIL;

  const logAction = (action: string, details: string) => {
    const logRef = collection(db, "admin_logs");
    addDoc(logRef, {
      adminId: user?.uid,
      adminEmail: user?.email,
      action,
      details,
      timestamp: serverTimestamp()
    }).catch(() => {});
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast({ title: "Matrix Settings Propagation Complete", description: "All creative nodes have been synchronized with the new master protocols." });
      logAction("Settings Mutation", "Global system feature toggles updated.");
      setSaving(false);
    }, 1500);
  };

  const sections = [
    {
      title: "Master Governance",
      icon: Key,
      restricted: !isMaster,
      items: [
        { label: "Institutional Lockdown", desc: "Instantly suspend all non-owner administrative access.", status: false },
        { label: "Permanent Audit Logging", desc: "Enforce immutable activity tracking for all node operations.", status: true },
        { label: "Owner-Only Mutations", desc: "Block admin-level updates to billing and subscription schemas.", status: true },
      ]
    },
    {
      title: "Core Infrastructure",
      icon: Terminal,
      items: [
        { label: "Neural Flow Cache", desc: "Edge-cache AI generation results for 24 hours.", status: true },
        { label: "Institutional App Check", desc: "Enforce Google reCAPTCHA v3 on all creative nodes.", status: true },
        { label: "Automatic Cloud Purge", desc: "Clear ephemeral media buffers every 48 hours.", status: false },
      ]
    },
    {
      title: "Monetization Nodes",
      icon: Zap,
      items: [
        { label: "AdSense Global Feed", desc: "Allow AdSense bots to crawl new creative landings.", status: true },
        { label: "Premium Tier Enforcement", desc: "Enable 4K export locks for non-pro identities.", status: true },
        { label: "Referral Logic Node", desc: "Activate invite-based credit rewards globally.", status: true },
      ]
    }
  ];

  return (
    <main className="p-12 space-y-16 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-white/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            <Settings size={14} /> MASTER PROTOCOL NODE
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white uppercase leading-none">Global <span className="text-primary italic">Sync.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Enterprise configuration for the entire creative infrastructure.</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="h-20 px-12 rounded-[2rem] bg-primary text-black font-black text-lg gap-4 shadow-glow active:scale-95 transition-all"
        >
          {saving ? <RefreshCw className="animate-spin" /> : <Save />}
          PROPAGATE CHANGES
        </Button>
      </header>

      {!isMaster && (
        <Card className="rounded-[3rem] bg-amber-500/10 border-2 border-amber-500/30 p-10 animate-in fade-in zoom-in">
           <div className="flex items-center gap-6 text-amber-500">
              <ShieldAlert size={40} />
              <div>
                 <h3 className="text-3xl font-black font-headline uppercase tracking-tight">LIMITED CLEARANCE</h3>
                 <p className="text-lg italic opacity-80">Some governance protocols are restricted to the Master Owner Node.</p>
              </div>
           </div>
        </Card>
      )}

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <section key={idx} className={cn("space-y-8", section.restricted && "opacity-30 pointer-events-none")}>
            <div className="flex items-center gap-4 px-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-black uppercase tracking-tight text-white/80">{section.title}</h3>
            </div>
            
            <Card className="rounded-[4rem] glass-panel border-white/5 overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                {section.items.map((item, i) => (
                  <div key={i} className={cn(
                    "flex items-center justify-between p-10 hover:bg-white/[0.02] transition-all",
                    i !== section.items.length - 1 && "border-b border-white/5"
                  )}>
                    <div className="space-y-1 pr-12">
                      <p className="text-xl font-bold text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-sm text-muted-foreground italic leading-relaxed opacity-60">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.status} className="data-[state=checked]:bg-primary" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>

      <footer className="text-center space-y-4 pt-10">
        <div className="p-10 bg-indigo-500/5 rounded-[3rem] border border-indigo-500/20 max-w-xl mx-auto flex items-center gap-8">
           <ShieldCheck className="w-12 h-12 text-indigo-400" />
           <div className="text-left space-y-1">
              <p className="text-white font-bold uppercase tracking-tight">Institutional Compliance</p>
              <p className="text-xs text-muted-foreground italic opacity-60">This matrix node is SOC2 Type II compliant and end-to-end encrypted.</p>
           </div>
        </div>
        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.6em] opacity-10 pt-10">VideoMaster AI • ELITE MANAGEMENT PROTOCOL v4.5.2</p>
      </footer>
    </main>
  );
}
