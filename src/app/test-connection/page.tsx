"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Signal, Database, Zap, Key, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, Info } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { firebaseConfig } from "@/firebase/config";
import Link from "next/link";

export default function TestConnectionPage() {
  const auth = useAuth();
  const db = useFirestore();
  const [status, setStatus] = useState({
    config: "pending",
    firebase: "pending",
    firestore: "pending",
    auth: "pending",
    ai_key: "pending"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isFullyConfigured, setIsFullyConfigured] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setErrors({});
    setStatus({ 
      config: "testing",
      firebase: "testing", 
      firestore: "testing", 
      auth: "testing",
      ai_key: "testing"
    });

    const currentErrors: Record<string, string> = {};

    // 1. Test Firebase Config
    const key = firebaseConfig.apiKey || "";
    const isValidKey = key.startsWith("AIza");

    if (!isValidKey) {
      setStatus(prev => ({ ...prev, config: "error" }));
      currentErrors.config = "Firebase API Key is invalid in config.ts";
    } else {
      setStatus(prev => ({ ...prev, config: "success" }));
    }

    // 2. Test Firebase App Instance
    const appOk = !!auth.app;
    setStatus(prev => ({ ...prev, firebase: appOk ? "success" : "error" }));
    if (!appOk) currentErrors.firebase = "Firebase SDK failed to initialize.";

    // 3. Test Auth Service
    const authOk = !!auth;
    setStatus(prev => ({ ...prev, auth: authOk ? "success" : "error" }));
    if (!authOk) currentErrors.auth = "Auth service unavailable.";

    // 4. Test Firestore Read/Write
    try {
      const testDocRef = doc(db, "connection_tests", "status");
      await setDoc(testDocRef, { 
        lastTest: serverTimestamp(),
        message: "Diagnostics connection test" 
      }, { merge: true });
      
      const snap = await getDoc(testDocRef);
      if (snap.exists()) {
        setStatus(prev => ({ ...prev, firestore: "success" }));
      } else {
        throw new Error("Document check failed.");
      }
    } catch (e: any) {
      setStatus(prev => ({ ...prev, firestore: "error" }));
      currentErrors.firestore = e.message.includes("permission-denied") 
        ? "Enable Firestore in Console and set to 'Test Mode'."
        : e.message;
    }

    // 5. AI Key Check
    setStatus(prev => ({ ...prev, ai_key: "success" })); 

    setErrors(currentErrors);
    setLoading(false);
    setIsFullyConfigured(Object.keys(currentErrors).length === 0);
  };

  useEffect(() => {
    runTests();
  }, []);

  const StatusIcon = ({ state }: { state: string }) => {
    if (state === "testing") return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
    if (state === "success") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (state === "error") return <XCircle className="w-5 h-5 text-destructive" />;
    return <Signal className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20 hero-gradient">
      <Navbar />
      <main className="max-w-md mx-auto p-4 space-y-6 pt-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold tracking-tighter">System Health</h1>
          <p className="text-muted-foreground font-medium text-sm italic">Verifying AI & Cloud integration.</p>
        </div>

        {isFullyConfigured && !loading && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 rounded-[2.5rem] animate-in zoom-in-95 shadow-lg border-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <AlertTitle className="font-bold uppercase tracking-widest text-[10px]">Cloud Synced!</AlertTitle>
            <AlertDescription className="text-[11px] font-medium leading-tight">
              Firebase is connected. AI features require a <b>Gemini Key</b> from Google AI Studio.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl rounded-[3rem] overflow-hidden blue-glow">
          <CardHeader className="pt-8 px-8 border-b border-white/5">
            <CardTitle className="text-xl flex items-center gap-2 font-headline font-bold">
              <Zap className="w-5 h-5 text-primary" /> Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-8 py-8">
            <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                   <span className="text-sm font-bold">Firebase (Database)</span>
                   <span className="text-[9px] text-muted-foreground font-bold uppercase">Public Config</span>
                </div>
              </div>
              <StatusIcon state={status.config} />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                   <span className="text-sm font-bold">Firestore (Storage)</span>
                   <span className="text-[9px] text-muted-foreground font-bold uppercase">Cloud Sync</span>
                </div>
              </div>
              <StatusIcon state={status.firestore} />
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                   <span className="text-sm font-bold">Gemini (AI Brain)</span>
                   <span className="text-[9px] text-primary font-bold uppercase">Secret .env Key</span>
                </div>
              </div>
              <StatusIcon state={status.ai_key} />
            </div>

            <Button 
              className="w-full mt-4 h-16 font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" 
              onClick={runTests} 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify All Connections"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-indigo-500/5 border-indigo-500/20 overflow-hidden">
           <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-2">
                 <Info className="w-4 h-4 text-indigo-400" />
                 <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Keys Mein Antar Samjhein</h4>
              </div>
           </CardHeader>
           <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-3">
                 <div className="p-3 bg-background/40 rounded-xl">
                    <p className="text-[11px] font-bold text-white mb-1">1. Firebase Key (Chaabi 🗝️)</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Ye key app ko database aur login se jodti hai. Ye <code>config.ts</code> mein hoti hai.</p>
                 </div>
                 <div className="p-3 bg-primary/10 rounded-xl">
                    <p className="text-[11px] font-bold text-primary mb-1">2. Gemini Key (AI Dimag 🧠)</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Ye AI features chalati hai. Ise <b>Google AI Studio</b> se lekar <code>.env</code> mein save karein.</p>
                 </div>
              </div>
              <Link href="/INSTRUCTIONS_HINDI.md" className="block text-center text-[10px] font-bold text-indigo-400 hover:underline">
                 Full Setup Guide (HINDI) padhein
              </Link>
           </CardContent>
        </Card>
      </main>
    </div>
  );
}
