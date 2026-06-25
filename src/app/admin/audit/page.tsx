"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, History, Search, 
  ShieldAlert
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AdminAuditLogs() {
  const db = useFirestore();
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "admin_logs"), orderBy("timestamp", "desc"), limit(100));
  }, [db]);

  const { data: logs, loading } = useCollection(logsQuery);

  const filteredLogs = logs?.filter(l => {
    const adminEmail = (l.adminEmail || "").toLowerCase();
    const action = (l.action || "").toLowerCase();
    const targetId = (l.targetId || "").toLowerCase();
    const searchTerm = search.toLowerCase();
    
    return adminEmail.includes(searchTerm) || 
           action.includes(searchTerm) || 
           targetId.includes(searchTerm);
  });

  return (
    <main className="p-12 space-y-16 max-w-[100rem] mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            <History size={14} /> IMMUTABLE AUDIT LEDGER
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white uppercase leading-none">Security <span className="text-primary italic">Logs.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Complete oversight of every administrative protocol execution.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-[450px]">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
           <input 
             placeholder="Search log activity or admin identity..." 
             className="w-full h-16 pl-16 pr-8 bg-white/[0.03] border-white/10 rounded-full text-lg focus:border-primary/50 transition-all outline-none text-white font-medium shadow-inner"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </header>

      <Card className="rounded-[4rem] glass-panel border-white/5 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)]">
        <CardHeader className="p-12 border-b border-white/10 bg-white/[0.02] flex flex-row items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-primary/20 rounded-[1.8rem] shadow-glow">
                 <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                 <CardTitle className="text-4xl font-headline font-black text-white uppercase tracking-tight">Institutional activity</CardTitle>
                 <p className="text-muted-foreground italic text-lg opacity-60">Verified ledger of system mutations.</p>
              </div>
           </div>
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Real-time Sync Active
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.03]">
                <tr className="border-white/10">
                  <th className="text-[12px] font-black uppercase tracking-[0.5em] px-12 py-8 text-primary text-left">Admin Identity</th>
                  <th className="text-[12px] font-black uppercase tracking-[0.5em] text-accent text-left">Protocol Action</th>
                  <th className="text-[12px] font-black uppercase tracking-[0.5em] text-secondary text-left">Target node</th>
                  <th className="text-[12px] font-black uppercase tracking-[0.5em] text-white text-left">Timestamp</th>
                  <th className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground text-right px-12">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-40 text-center animate-pulse text-4xl font-black text-primary/20 uppercase tracking-widest italic">Decrypting Logs...</td></tr>
                ) : filteredLogs?.map((log: any) => (
                  <tr key={log.id} className="border-white/5 hover:bg-white/[0.04] transition-all group">
                    <td className="px-12 py-10">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary/40 font-black">
                             {(log.adminEmail || "A").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-base font-bold text-white uppercase tracking-tight">{log.adminEmail || "anonymous-admin"}</span>
                       </div>
                    </td>
                    <td>
                       <span className={cn(
                         "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                         (log.action || "").includes('Ban') || (log.action || "").includes('Terminate') ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-primary/10 text-primary border-primary/20'
                       )}>
                          {log.action}
                       </span>
                    </td>
                    <td className="text-sm font-mono text-muted-foreground uppercase opacity-60">...{(log.targetId || "").slice(-8)}</td>
                    <td className="text-xs text-muted-foreground italic">
                       {!isClient ? 'Loading...' : log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Processing...'}
                    </td>
                    <td className="text-right px-12">
                       <button className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-all">Expand Protocol</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredLogs?.length && !loading && (
            <div className="py-40 text-center space-y-8">
               <ShieldAlert className="w-32 h-32 mx-auto text-muted-foreground opacity-10" />
               <h4 className="text-3xl font-black font-headline text-white/20 uppercase tracking-tight">No Logged Entries Found</h4>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
