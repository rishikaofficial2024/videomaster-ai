
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Signal, Wifi, Zap, Database, AlertCircle, Key } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { firebaseConfig } from "@/firebase/config";

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

    // 1. Test Config (Check for placeholder API key)
    const isPlaceholder = firebaseConfig.apiKey === "YOUR_REAL_API_KEY_HERE";
    if (isPlaceholder) {
      setStatus(prev => ({ ...prev, config: "error" }));
      currentErrors.config = "Default API Key detected. Please replace it in src/firebase/config.ts";
    } else {
      setStatus(prev => ({ ...prev, config: "success" }));
    }

    // 2. Test Firebase App Instance
    const appOk = !!auth.app;
    setStatus(prev => ({ ...prev, firebase: appOk ? "success" : "error" }));
    if (!appOk) {
      currentErrors.firebase = "Firebase SDK failed to initialize. Check your config.ts syntax.";
    }

    // 3. Test Auth Service
    // Auth is technically a local SDK instance, but we check if it's usable
    const authOk = !!auth;
    setStatus(prev => ({ ...prev, auth: authOk ? "success" : "error" }));
    if (!authOk) {
      currentErrors.auth = "Auth service unavailable. Ensure 'Authentication' is enabled in the Firebase Console.";
    }

    // 4. Test Firestore Read/Write
    try {
      // Use a timestamped path to avoid cache
      const testDocRef = doc(db, "connection_tests", "status");
      await setDoc(testDocRef, { 
        lastTest: serverTimestamp(),
        message: "Diagnostics connection test" 
      }, { merge: true });
      
      const snap = await getDoc(testDocRef);
      if (snap.exists()) {
        setStatus(prev => ({ ...prev, firestore: "success" }));
      } else {
        throw new Error("Document write succeeded but read failed.");
      }
    } catch (e: any) {
      console.error("Firestore test failed:", e);
      setStatus(prev => ({ ...prev, firestore: "error" }));
      
      let msg = e.message || "Unknown Firestore error.";
      if (msg.includes("permission-denied") || msg.includes("Permissions")) {
        msg = "Permission Denied: Ensure Firestore is created and Security Rules allow 'Test Mode' or your UID.";
      } else if (msg.includes("API key")) {
        msg = "Invalid API Key: The key in config.ts is incorrect or restricted.";
      }
      currentErrors.firestore = msg;
    }

    setErrors(currentErrors);
    setLoading(false);
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
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navbar />
      <main className="max-w-md mx-auto p-4 space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold">System Health</h1>
          <p className="text-muted-foreground">Verify your app's connections to cloud services.</p>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription className="text-xs mt-2 space-y-2">
              {Object.entries(errors).map(([key, msg]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-bold uppercase opacity-70">[{key}]:</span>
                  <span>{msg}</span>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Connectivity Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">API Key Config</span>
              </div>
              <StatusIcon state={status.config} />
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Firebase SDK</span>
              </div>
              <StatusIcon state={status.firebase} />
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Firestore Database</span>
              </div>
              <StatusIcon state={status.firestore} />
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Signal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Auth Service</span>
              </div>
              <StatusIcon state={status.auth} />
            </div>

            <Button 
              className="w-full mt-4 h-12 font-bold" 
              onClick={runTests} 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Testing..." : "Re-run Diagnostics"}
            </Button>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            If <b>Firestore</b> fails, go to Firebase Console &gt; Build &gt; Firestore &gt; <b>Create Database</b>.
          </p>
          <p className="text-xs text-muted-foreground">
            If <b>Auth</b> fails, go to Firebase Console &gt; Build &gt; Authentication &gt; <b>Get Started</b>.
          </p>
        </div>
      </main>
    </div>
  );
}
