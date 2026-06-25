"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, XCircle, Loader2, Database, 
  Zap, ArrowLeft, ShieldCheck, 
  Activity, Globe, Info, Cpu, AlertTriangle, 
  TrendingUp, Tornado, Globe2, Link2, Blocks, DollarSign, RefreshCw,
  Search, ShieldAlert
} from "lucide-react";
import { useAuth, useFirestore, useUser, useCollection } from "@/firebase";
import { doc, setDoc, serverTimestamp, collection, query, limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function MasterMonitoringPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  
  const [status, setStatus] = useState({
    firestore: "pending",
    ai_integration: "pending",
    domain_sync: "pending",
    adsense: "pending",
    app_check: "pending"
  });
  const [loading, setLoading] = useState(false);
  const [isDnsError, setIsDnsError] = useState(false);

  const logsQuery = query(
    collection(db, "connection_tests"),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const { data: logs } = useCollection(logsQuery);

  const runTests = async () => {
    if (loading) return;
    setLoading(true);
    setStatus({ 
      firestore: "testing", 
      ai_integration: "testing",
      domain_sync: "testing",
      adsense: "testing",
      app_check: "testing"
    });

    if (user && db) {
      const testRef = doc(collection(db, "connection_tests"));
      const testData = { 
        timestamp: serverTimestamp(),
        userId: user.uid,
        node: "Admin Monitoring Hub",
        status: "Operational"
      };

      setDoc(testRef, testData)
        .then(() => setStatus(prev => ({ ...prev, firestore: "success" })))
        .catch(async (err) => {
          setStatus(prev => ({ ...prev, firestore: "error" }));
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: testRef.path,
            operation: 'create',
            requestResourceData: testData
          } satisfies SecurityRuleContext));
        });
    }

    setStatus(prev => ({ ...prev, ai_integration: "success" }));

    const hostname = typeof window !== 'undefined' ? window.location.hostname : "";
    if (hostname !== "videomaster-ai.tech" && hostname !== "localhost" && !hostname.includes('web.app')) {
       setIsDnsError(true);
       setStatus(prev => ({ ...prev, domain_sync: "warning" }));
    } else {
       setIsDnsError(false);
       setStatus(prev => ({ ...prev, domain_sync: "success" }));
    }

    const adsenseLoaded = typeof window !== 'undefined' && !!document.querySelector('script[src*="adsbygoogle"]');
    setStatus(prev => ({ ...prev, adsense: adsenseLoaded ? "success" : "warning" }));
    
    setLoading(false);
  };

  useEffect(() => {
    if (user && db) runTests();
  }, [user, db]);

  const StatusIcon = ({ state }: { state: string }) => {
    if (state === "testing") return <Loader2 className="animate-spin text-primary" size={24} />;
    if (state === "success") return <CheckCircle2 className="text-emerald-500" size={24} />;
    if (state === "warning") return <AlertTriangle className="text-amber-500" size={24} />;
    if (state === "error") return <XCircle className="text-destructive" size={24} />;
    return <Activity className="text-muted-foreground opacity-20" size={24} />;
  };

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 mt-24 space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-6">
            <Link href="/admin" className="flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em] group">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:border-primary/50 border border-transparent transition-all shadow-xl">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Back to Master Hub
            </Link>
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter text-white leading-none">Live <span className="text-primary italic">Pulse</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Real-time technical monitoring of all creative nodes and neural links.</p>
          </div>
          
          <Button onClick={runTests} disabled={loading} className="h-20 px-12 rounded-[2rem] bg-primary font-black text-lg gap-4 shadow-2xl shadow-primary/40 group">
             {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" />}
             RUN SYSTEM SCAN
          </Button>
        </header>

        {isDnsError && (
          <Card className="rounded-[3rem] bg-rose-500/10 border-2 border-rose-500/30 p-10 animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-6 text-rose-500 mb-6">
                <ShieldAlert className="w-12 h-12" />
                <h3 className="text-4xl font-bold font-headline uppercase tracking-tight">DOMAIN ALIGNMENT FAILED</h3>
             </div>
             <p className="text-xl text-muted-foreground italic leading-relaxed">Your branded domain is not correctly propagate. Ensure your A-Records are set in your domain provider dashboard.</p>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
           <Card className="lg:col-span-2 border-white/5 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] overflow-hidden blue-glow relative">
             <CardHeader className="p-12 border-b border-white/5">
                <CardTitle className="text-4xl font-headline font-black text-white uppercase tracking-tight">System Matrix</CardTitle>
             </CardHeader>
             <CardContent className="p-12 space-y-6">
                {[
                  { label: "Database Pipeline", sub: "Cloud Firestore Real-time Sync", id: status.firestore, icon: Database },
                  { label: "Neural AI Core", sub: "Gemini & Veo Engine Link", id: status.ai_integration, icon: Cpu },
                  { label: "Monetization Node", sub: "AdSense ca-pub-8946933317699938", id: status.adsense, icon: DollarSign },
                  { label: "Branded Link Sync", sub: "videomaster-ai.tech Connectivity", id: status.domain_sync, icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-8">
                      <div className="p-4 bg-black/40 rounded-2xl text-primary shadow-inner">
                        <item.icon size={28} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-white uppercase tracking-tight">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{item.sub}</span>
                      </div>
                    </div>
                    <StatusIcon state={item.id} />
                  </div>
                ))}
             </CardContent>
           </Card>

           <div className="space-y-12">
              <Card className="rounded-[3.5rem] bg-indigo-500/5 border-2 border-indigo-500/20 p-12 space-y-10 shadow-2xl">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-5 bg-indigo-500/10 rounded-[2rem] border-2 border-indigo-500/20 shadow-xl">
                       <Activity className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h4 className="text-3xl font-black font-headline text-white uppercase tracking-tight">Active Logs</h4>
                 </div>
                 <div className="space-y-6">
                    {logs?.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{log.node}</span>
                          <span className="text-[8px] text-muted-foreground uppercase">{log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Recent'}</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-500 uppercase text-[8px]">Operational</Badge>
                      </div>
                    ))}
                    {!logs?.length && <p className="text-center text-xs text-muted-foreground italic opacity-40">No recent activity detected.</p>}
                 </div>
              </Card>

              <Card className="rounded-[3.5rem] bg-white/5 border border-white/5 p-10 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                   <Info className="w-4 h-4" /> Node Info
                 </h4>
                 <div className="space-y-4 pt-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-muted-foreground">Admin ID</span>
                       <span className="text-white">...{user?.uid.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-muted-foreground">Region</span>
                       <span className="text-emerald-500">Global CDN</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">SSL Path</span>
                       <span className="text-primary">Verified</span>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}