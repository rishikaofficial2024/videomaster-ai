
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Signal, Wifi, Zap, Database, AlertCircle } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TestConnectionPage() {
  const auth = useAuth();
  const db = useFirestore();
  const [status, setStatus] = useState({
    firebase: "pending",
    firestore: "pending",
    auth: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setErrors({});
    setStatus({ firebase: "testing", firestore: "testing", auth: "testing" });

    // 1. Test Firebase App Instance
    const appOk = !!auth.app;
    setStatus(prev => ({ ...prev, firebase: appOk ? "success" : "error" }));
    if (!appOk) setErrors(prev => ({ ...prev, firebase: "Firebase SDK failed to initialize. Check your config.ts" }));

    // 2. Test Auth State
    const authOk = !!auth;
    setStatus(prev => ({ ...prev, auth: authOk ? "success" : "error" }));
    if (!authOk) setErrors(prev => ({ ...prev, auth: "Auth service unavailable. Enable Authentication in Firebase Console." }));

    // 3. Test Firestore Read/Write
    try {
      const testDocRef = doc(db, "connection_tests", "status");
      await setDoc(testDocRef, { lastTest: serverTimestamp() }, { merge: true });
      const snap = await getDoc(testDocRef);
      setStatus(prev => ({ ...prev, firestore: snap.exists() ? "success" : "error" }));
    } catch (e: any) {
      console.error("Firestore test failed:", e);
      setStatus(prev => ({ ...prev, firestore: "error" }));
      setErrors(prev => ({ ...prev, firestore: e.message || "Permissions denied. Check Security Rules and enable Firestore." }));
    }

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
            <AlertTitle>Connection Issues Detected</AlertTitle>
            <AlertDescription className="text-xs mt-2 space-y-1">
              {Object.entries(errors).map(([key, msg]) => (
                <p key={key}>• {msg}</p>
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
              {loading ? "Testing..." : "Re-run Diagnostics"}
            </Button>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-xs text-center text-muted-foreground">
            Important: Ensure your `apiKey` in `src/firebase/config.ts` matches your Firebase Project settings.
          </p>
        </div>
      </main>
    </div>
  );
}
