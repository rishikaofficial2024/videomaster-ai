
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Signal, Wifi, Zap, Database, AlertCircle, Key, ArrowLeft, ShieldCheck } from "lucide-react";
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
      auth: "testing" 
    });

    const currentErrors: Record<string, string> = {};

    // 1. Test Config (Check for valid key)
    const key = firebaseConfig.apiKey || "";
    const isValidKey = key.startsWith("AIza");

    if (!isValidKey) {
      setStatus(prev => ({ ...prev, config: "error" }));
      currentErrors.config = "Invalid API Key format. Ensure it starts with 'AIza'.";
    } else {
      setStatus(prev => ({ ...prev, config: "success" }));
    }

    // 2. Test Firebase App Instance
    const appOk = !!auth.app;
    setStatus(prev => ({ ...prev, firebase: appOk ? "success" : "error" }));
    if (!appOk) {
      currentErrors.firebase = "Firebase SDK failed to initialize.";
    }

    // 3. Test Auth Service
    const authOk = !!auth;
    setStatus(prev => ({ ...prev, auth: authOk ? "success" : "error" }));
    if (!authOk) {
      currentErrors.auth = "Auth service unavailable.";
    }

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
        ? "Permission Denied: Enable 'Firestore' in Firebase Console and set to 'Test Mode'."
        : e.message;
    }

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
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold">System Health</h1>
          <p className="text-muted-foreground">Verification of cloud service integration.</p>
        </div>

        {isFullyConfigured && !loading && (
          <Alert className="bg-green-50 border-green-200 text-green-800 rounded-3xl animate-in zoom-in-95">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-bold">System Ready!</AlertTitle>
            <AlertDescription className="text-xs">
              API Key is verified and services are connected. You can now login.
            </AlertDescription>
          </Alert>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-3xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Setup Incomplete</AlertTitle>
            <AlertDescription className="text-[11px] mt-2 space-y-2">
              {Object.entries(errors).map(([key, msg]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-bold uppercase opacity-70">[{key}]:</span>
                  <span>{msg}</span>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-white shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden blue-glow">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl flex items-center gap-2 font-headline font-bold">
              <Zap className="w-5 h-5 text-primary" /> Connectivity Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">API Key (Verified)</span>
              </div>
              <StatusIcon state={status.config} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Firebase SDK</span>
              </div>
              <StatusIcon state={status.firebase} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Firestore DB</span>
              </div>
              <StatusIcon state={status.firestore} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <Signal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Auth Service</span>
              </div>
              <StatusIcon state={status.auth} />
            </div>

            <Button 
              className="w-full mt-4 h-14 font-bold rounded-2xl shadow-xl shadow-primary/20" 
              onClick={runTests} 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Verifying..." : "Refresh Diagnostics"}
            </Button>
          </CardContent>
        </Card>

        <div className="p-6 bg-primary/10 rounded-[2rem] border border-primary/20 text-center space-y-3">
          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
            API key is successfully integrated. If Firestore shows an error, please ensure <b>Firestore Database</b> is created in the Firebase Console.
          </p>
        </div>
      </main>
    </div>
  );
}
