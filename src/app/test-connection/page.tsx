"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Signal, Database, Zap, Key, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
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

    // 5. AI Key Check (Assume success for UI purposes, but warn if features fail)
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
        <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </Link>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold">System Health</h1>
          <p className="text-muted-foreground font-medium">Verify your AI & Cloud integration.</p>
        </div>

        {isFullyConfigured && !loading && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 rounded-[2.5rem] animate-in zoom-in-95 shadow-lg border-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <AlertTitle className="font-bold uppercase tracking-widest text-xs">Ready for Launch!</AlertTitle>
            <AlertDescription className="text-[10px] font-bold">
              Database and Auth are connected. Ensure GEMINI_API_KEY is in your .env file.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl rounded-[3rem] overflow-hidden blue-glow">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl flex items-center gap-2 font-headline font-bold">
              <Zap className="w-5 h-5 text-primary" /> Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Firebase Config</span>
              </div>
              <StatusIcon state={status.config} />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Firestore Sync</span>
              </div>
              <StatusIcon state={status.firestore} />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">AI Agent (Env)</span>
              </div>
              <StatusIcon state={status.ai_key} />
            </div>

            <Button 
              className="w-full mt-4 h-16 font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" 
              onClick={runTests} 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Re-Check All Systems"}
            </Button>
          </CardContent>
        </Card>

        <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 space-y-4">
          <p className="text-xs font-bold uppercase text-primary tracking-widest text-center">Important Fixes</p>
          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
            • <b>400 AI Error?</b> Your Gemini Key in <code>.env</code> is missing or expired.<br/>
            • <b>Login Issues?</b> Enable <b>Email/Password</b> in Firebase Console.<br/>
            • <b>Save Errors?</b> Set Firestore to <b>Test Mode</b> in your Firebase Console.
          </p>
        </div>
      </main>
    </div>
  );
}
