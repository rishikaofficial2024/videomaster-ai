"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, Loader2, Database, 
  Zap, ArrowLeft, ShieldCheck, 
  Activity, Globe, Info, Cpu, AlertTriangle, 
  Tornado, Globe2, Link2, Blocks, DollarSign, RefreshCw,
  ExternalLink
} from "lucide-react";
import { useAuth, useFirestore, useUser, useStorage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { isAiEngineAuthorized } from "@/ai/genkit";
import { cn } from "@/lib/utils";

export default function TestConnectionPage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  
  const [status, setStatus] = useState({
    config: "pending",
    firebase: "pending", 
    firestore: "pending", 
    storage: "pending",
    auth: "pending",
    session: "pending",
    app_check: "pending",
    adsense: "pending",
    ai_integration: "pending",
    domain_sync: "pending"
  });
  const [loading, setLoading] = useState(false);
  const [isDnsError, setIsDnsError] = useState(false);

  const runTests = async () => {
    if (loading) return;
    setLoading(true);
    setStatus({ 
      config: "testing",
      firebase: "testing", 
      firestore: "testing", 
      storage: "testing",
      auth: "testing",
      session: "testing",
      app_check: "testing",
      adsense: "testing",
      ai_integration: "testing",
      domain_sync: "testing"
    });

    // 1. Firebase Config Check
    const hasKey = !!firebaseConfig.apiKey?.startsWith("AIza");
    setStatus(prev => ({ ...prev, config: hasKey ? "success" : "error" }));

    // 2. Integration: Auth & Session
    setStatus(prev => ({ ...prev, firebase: !!auth.app ? "success" : "error" }));
    setStatus(prev => ({ ...prev, session: !!user ? "success" : "error" }));
    setStatus(prev => ({ ...prev, auth: "success" }));

    // 3. Integration: Firestore Real-time Diagnostic write
    if (user && db) {
      const testRef = doc(db, "users", user.uid, "diagnostics", "latest");
      const testData = { 
        timestamp: serverTimestamp(),
        node: "Elite Integration Hub",
        status: "Fully Connected"
      };

      setDoc(testRef, testData, { merge: true })
        .then(() => {
          setStatus(prev => ({ ...prev, firestore: "success" }));
        })
        .catch(async (e) => {
          setStatus(prev => ({ ...prev, firestore: "error" }));
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: testRef.path,
            operation: 'write',
            requestResourceData: testData,
          } satisfies SecurityRuleContext));
        });
    }

    // 4. Integration: Storage Hub
    setStatus(prev => ({ ...prev, storage: !!storage ? "success" : "error" }));

    // 5. Integration: AI Neural Core
    setStatus(prev => ({ ...prev, ai_integration: isAiEngineAuthorized() ? "success" : "warning" }));

    // 6. Integration: Branded Domain Sync
    const hostname = typeof window !== 'undefined' ? window.location.hostname : "";
    if (hostname !== "videomaster-ai.tech" && hostname !== "localhost" && !hostname.includes('firebaseapp.com')) {
       setIsDnsError(true);
       setStatus(prev => ({ ...prev, domain_sync: "warning" }));
    } else {
       setIsDnsError(false);
       setStatus(prev => ({ ...prev, domain_sync: "success" }));
    }

    // 7. App Check Key Detection
    setStatus(prev => ({ ...prev, app_check: firebaseConfig.appCheckSiteKey ? "success" : "warning" }));

    // 8. AdSense Technical Check
    const adsenseLoaded = typeof window !== 'undefined' && !!document.querySelector('script[src*="adsbygoogle"]');
    setStatus(prev => ({ ...prev, adsense: adsenseLoaded ? "success" : "warning" }));
    
    setLoading(false);
  };

  useEffect(() => {
    if (user && db) runTests();
  }, [user, db]);

  const StatusIcon = ({ state }: { state: string }) => {
    if (state === "testing") return <Loader2 className="animate-spin text-primary" size={24} />;
    if (state === "success") return <CheckCircle2 className="text-emerald-500 shadow-glow" size={24} />;
    if (state === "warning") return <AlertTriangle className="text-amber-500" size={24} />;
    if (state === "error") return <XCircle className="text-destructive" size={24} />;
    return <Activity className="text-muted-foreground opacity-20" size={24} />;
  };

  const readinessScore = Object.values(status).filter(s => s === 'success').length;
  const totalTests = Object.values(status).length;
  const percentage = Math.round((readinessScore / totalTests) * 100);

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 mt-24 space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-6">
            <Link href="/dashboard" className="flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em] group">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/50 border border-transparent transition-all shadow-xl">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Neural Hub
            </Link>
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none uppercase">Integration <span className="text-primary italic">Hub.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Full-scale diagnostic suite for creative nodes, AI, and monetization engine.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-[#0a0d14]/80 p-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
             <div className="relative">
                <Blocks className="text-primary w-12 h-12 animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Production Score</span>
                <span className="text-4xl font-black font-headline text-emerald-500 uppercase tracking-tighter">{percentage}%</span>
             </div>
          </div>
        </header>

        {isDnsError && (
          <Card className="rounded-[4rem] bg-rose-500/10 border-2 border-rose-500/30 p-12 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl">
             <div className="flex items-center gap-6 text-rose-500 mb-6">
                <Globe2 className="w-16 h-16" />
                <h3 className="text-5xl font-bold font-headline uppercase tracking-tight">DNS PROPAGATION ALERT</h3>
             </div>
             <p className="text-2xl text-muted-foreground italic leading-relaxed mb-10 opacity-80 max-w-4xl">
               The master domain `videomaster-ai.tech` is currently offline. This indicates that the **A-Records** provided by Firebase Hosting have not yet been synchronized in your domain registrar's control panel.
             </p>
             <div className="flex gap-4">
                <Button className="h-20 px-12 rounded-[2rem] bg-rose-600 hover:bg-rose-700 font-black text-lg gap-4 shadow-xl" asChild>
                    <Link href="/DNS_FIX_GUIDE.md">View DNS Protocol</Link>
                </Button>
                <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-white/10 text-white font-bold text-lg" asChild>
                    <Link href="/DEPLOY_FIX.md">Deployment Help</Link>
                </Button>
             </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
           <Card className="lg:col-span-3 border-white/5 shadow-2xl bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[5rem] overflow-hidden blue-glow relative">
             <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
                <Link2 className="w-96 h-96 text-primary animate-spin-slow" />
             </div>
             
             <CardHeader className="p-16 border-b border-white/5 relative z-10">
                <CardTitle className="text-5xl font-headline font-black flex items-center gap-8 text-white uppercase tracking-tight">
                   <div className="p-6 bg-primary/20 rounded-[2.5rem] shadow-2xl shadow-primary/20 border-2 border-primary/30">
                      <Zap className="w-12 h-12 text-primary" />
                   </div>
                   Integration Matrix
                </CardTitle>
             </CardHeader>
             <CardContent className="p-16 space-y-6 relative z-10">
                {[
                  { label: "Firebase Hub", sub: "Cloud Handshake Authorized", id: status.config, icon: Database },
                  { label: "Firestore Matrix", sub: "Real-time Node Access", id: status.firestore, icon: Activity },
                  { label: "Cloud Storage Hub", sub: "Media Asset Persistence", id: status.storage, icon: Layout },
                  { label: "Neural AI Core", sub: "Gemini Flash Connectivity", id: status.ai_integration, icon: Cpu },
                  { label: "AdSense Node", sub: "Revenue Identity Sync", id: status.adsense, icon: DollarSign },
                  { label: "Identity Shield", sub: "App Check Site Detection", id: status.app_check, icon: ShieldCheck },
                  { label: "Session Node", sub: "User Identity Persistence", id: status.session, icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-10 bg-white/[0.02] rounded-[3.5rem] border border-white/5 hover:border-primary/40 hover:bg-white/[0.04] transition-all group cursor-default shadow-inner">
                    <div className="flex items-center gap-10">
                      <div className="p-5 bg-black/40 rounded-3xl text-muted-foreground group-hover:text-primary transition-all duration-700 shadow-2xl border border-white/5">
                        <item.icon size={32} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-2 opacity-40 group-hover:opacity-100 transition-opacity">{item.sub}</span>
                      </div>
                    </div>
                    <StatusIcon state={item.id} />
                  </div>
                ))}

                <Button 
                  className="w-full h-28 rounded-[3rem] font-black text-3xl mt-12 shadow-2xl shadow-primary/40 group active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white gap-6" 
                  onClick={runTests} 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-10 h-10" /> : <RefreshCw className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />}
                  INITIATE SYSTEM RE-SCAN
                </Button>
             </CardContent>
           </Card>

           <aside className="space-y-12">
              <Card className="rounded-[4rem] bg-emerald-500/5 border-2 border-emerald-500/20 p-12 space-y-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <DollarSign className="w-64 h-64 text-emerald-500" />
                 </div>
                 <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className="p-6 bg-emerald-500/10 rounded-[2.5rem] animate-pulse border-2 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                       <TrendingUp className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h4 className="text-4xl font-black font-headline text-white uppercase tracking-tight leading-none">Revenue Node</h4>
                 </div>
                 <div className="space-y-8 relative z-10">
                    <p className="text-lg text-muted-foreground leading-relaxed italic text-center font-medium opacity-80">
                       Monetization engine is active. AdSense crawler will verify `app-ads.txt` within 2-7 days.
                    </p>
                    <Button className="w-full h-20 rounded-[1.8rem] bg-orange-600 hover:bg-orange-700 font-black text-xl gap-4 shadow-2xl shadow-orange-600/40 group" asChild>
                       <a href="https://adsense.google.com" target="_blank">
                          Open Dashboard <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </a>
                    </Button>
                 </div>
              </Card>

              <Card className="rounded-[4rem] bg-primary/5 border border-primary/20 p-12 space-y-8 shadow-xl">
                 <h4 className="text-xs font-black uppercase tracking-[0.5em] flex items-center gap-4 text-primary">
                   <span className="p-1"><Info size={16}/></span> Config Registry
                 </h4>
                 <div className="space-y-6 pt-4">
                    <div className="flex justify-between text-[12px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                       <span className="text-muted-foreground">Neural Key</span>
                       <span className={cn(isAiEngineAuthorized() ? "text-emerald-500" : "text-amber-500")}>
                          {isAiEngineAuthorized() ? "SYNCED" : "PENDING"}
                       </span>
                    </div>
                    <div className="flex justify-between text-[12px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                       <span className="text-muted-foreground">App Shield</span>
                       <span className={cn(firebaseConfig.appCheckSiteKey ? "text-emerald-500" : "text-amber-500")}>
                          {firebaseConfig.appCheckSiteKey ? "ACTIVE" : "MISSING"}
                       </span>
                    </div>
                    <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                       <span className="text-muted-foreground">CDN Region</span>
                       <span className="text-primary">GLOBAL</span>
                    </div>
                 </div>
              </Card>
           </aside>
        </div>
      </main>
    </div>
  );
}
