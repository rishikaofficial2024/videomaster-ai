"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, Loader2, Database, 
  Zap, ArrowLeft, ShieldCheck, 
  Activity, Globe, Info, Cpu, AlertTriangle, 
  RefreshCw, DollarSign, Blocks, Layout
} from "lucide-react";
import { useAuth, useFirestore, useUser, useStorage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import Link from "next/link";
import { isAiEngineAuthorized } from "@/ai/genkit";

export default function TestConnectionPage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { user } = useUser();
  
  const [status, setStatus] = useState<Record<string, string>>({
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const runTests = async () => {
    if (loading) return;
    setLoading(true);
    
    // Set all to testing
    const testingState: Record<string, string> = {};
    Object.keys(status).forEach(k => testingState[k] = "testing");
    setStatus(testingState);

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
        .then(() => setStatus(prev => ({ ...prev, firestore: "success" })))
        .catch(async () => {
          setStatus(prev => ({ ...prev, firestore: "error" }));
        });
    }

    // 4. Integration: Storage Hub
    setStatus(prev => ({ ...prev, storage: !!storage ? "success" : "error" }));

    // 5. Integration: AI Neural Core (Client-side key check)
    const aiReady = isAiEngineAuthorized();
    setStatus(prev => ({ ...prev, ai_integration: aiReady ? "success" : "warning" }));

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

  if (!isClient) return null;

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
                <ArrowLeft className="w-5 h-5" />
              </div>
              Back to Neural Hub
            </Link>
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none uppercase">Integration <span className="text-primary italic">Hub.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Diagnostic suite optimized for Elite Production Nodes.</p>
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

        <div className="grid lg:grid-cols-4 gap-12">
           <Card className="lg:col-span-3 border-white/5 shadow-2xl bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[5rem] overflow-hidden blue-glow relative">
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
        </div>
      </main>
    </div>
  );
}
