"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, Coins, ShieldCheck, Lock, Loader2, Banknote, TrendingUp,
  Activity, CheckCircle2, Star, ShieldAlert, MoreVertical, Landmark, PieChart, DollarSign, Globe, Info, ExternalLink, CreditCard,
  Terminal, Shield, Gauge, Cpu, Database, Eye, ShieldX, ArrowLeft, RefreshCw
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer, doc, updateDoc, increment, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { firebaseConfig } from "@/firebase/config";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (db) {
      fetchUserCount();
      calculateTotalRevenue();
    }
  }, [db]);

  const fetchUserCount = async () => {
    try {
      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      setTotalUsersCount(snapshot.data().count);
    } catch (e) {}
  };

  const calculateTotalRevenue = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let revenue = 0;
      usersSnap.forEach((doc) => {
        const data = doc.data();
        revenue += (data.totalSpent || 0);
        if (data.isPremium && !data.totalSpent) revenue += 99;
      });
      setTotalRevenue(revenue);
    } catch (e) {}
  };

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(50), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);

  const handleUpdateUser = async (userId: string, data: any) => {
    setUpdatingUser(userId);
    const userRef = doc(db, "users", userId);
    
    updateDoc(userRef, data)
      .then(() => {
        toast({ title: "Protocol Broadcasted", description: "User node settings synchronized." });
        calculateTotalRevenue(); 
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      })
      .finally(() => {
        setUpdatingUser(null);
      });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-40 bg-[#03010a]">
      <Navbar />
      
      {/* ADMIN DECOR */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-red-500/5 blur-[200px] -z-10" />

      <main className="max-w-[95rem] mx-auto p-6 lg:p-12 space-y-16 pt-32 lg:pt-40">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-red-500/10 rounded-full border border-red-500/20 shadow-2xl">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.5em]">INSTITUTIONAL HUB NODE</span>
            </div>
            <h1 className="text-8xl md:text-[11rem] font-headline font-black tracking-tighter text-white leading-none uppercase">
              Revenue <span className="text-primary italic">Node.</span>
            </h1>
            <p className="text-muted-foreground font-medium italic text-3xl opacity-60">Master oversight of the creative empire and revenue pipelines.</p>
          </div>
          
          <div className="flex items-center gap-8">
             <Button variant="outline" className="h-16 px-10 rounded-full border-white/10 glass-panel text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 active:scale-95" asChild>
                <Link href="/admin/monitoring"><Gauge className="w-5 h-5 mr-3 text-primary" /> Live Pulse</Link>
             </Button>
             <div className="flex items-center gap-12 glass-panel p-10 rounded-[4rem] border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="flex flex-col px-10 border-r border-white/10 text-right relative z-10">
                   <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-3 opacity-40">Total Nodes</span>
                   <span className="text-6xl font-bold font-headline text-emerald-500 tracking-tighter">{totalUsersCount ?? "..."}</span>
                </div>
                <div className="relative z-10">
                   <ShieldCheck className="w-14 h-14 text-primary animate-pulse group-hover:scale-125 transition-transform duration-700" />
                   <div className="absolute inset-0 blur-2xl bg-primary/40 rounded-full scale-150" />
                </div>
             </div>
          </div>
        </header>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "Lifetime Revenue", val: `₹${totalRevenue.toLocaleString()}`, icon: Landmark, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
            { label: "Security Level", val: firebaseConfig.appCheckSiteKey ? "ULTRA" : "PROD", icon: Shield, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
            { label: "Neural Fidelity", val: "100%", icon: Cpu, color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
            { label: "Matrix State", val: "Operational", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/30" }
          ].map((stat, i) => (
            <Card key={i} className={cn("rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.05]", stat.bg, stat.border)}>
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-1000">
                <stat.icon className="w-40 h-40" />
              </div>
              <p className={cn("text-[11px] font-black uppercase tracking-[0.5em] mb-4 opacity-60", stat.color)}>{stat.label}</p>
              <h3 className="text-5xl font-black text-white tracking-tighter uppercase relative z-10">{stat.val}</h3>
            </Card>
          ))}
        </section>

        {/* USER TABLE AREA */}
        <Card className="rounded-[5rem] glass-panel border-white/5 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)]">
           <CardHeader className="p-16 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02]">
              <div className="space-y-4">
                 <CardTitle className="text-5xl font-headline font-black uppercase tracking-tight text-white">Creator Node Registry</CardTitle>
                 <CardDescription className="italic text-xl text-muted-foreground opacity-60">Institutional oversight of every active neural node and subscription clearancce.</CardDescription>
              </div>
              <Users className="w-20 h-20 text-muted-foreground opacity-10" />
           </CardHeader>
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-white/[0.03]">
                    <TableRow className="border-white/10 hover:bg-transparent">
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] px-16 py-10 text-primary">Creator Identity</TableHead>
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] text-accent">Clearance</TableHead>
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] text-secondary">Power Level</TableHead>
                       <TableHead className="text-right px-16 text-[12px] font-black uppercase tracking-[0.5em] text-white">Protocols</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {usersLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-60 animate-pulse italic text-3xl font-black tracking-widest text-primary opacity-20">QUERYING DATABASE NODE...</TableCell></TableRow>
                    ) : users?.map((u: any) => (
                      <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.04] transition-all group">
                         <TableCell className="px-16 py-12">
                            <div className="flex flex-col gap-2">
                               <span className="text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tighter uppercase">{u.displayName || 'Guest Creator'}</span>
                               <span className="text-[10px] text-muted-foreground font-mono opacity-40 uppercase tracking-[0.4em]">{u.email}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge className={cn("rounded-full text-[11px] font-black uppercase tracking-[0.4em] px-8 py-3 shadow-2xl", u.isPremium ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground')}>
                               {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                            </Badge>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-4 text-2xl font-black text-primary font-headline">
                               <Coins className="w-6 h-6 text-primary/40" /> {u.credits?.toFixed(0) || 0}
                            </div>
                         </TableCell>
                         <TableCell className="text-right px-16">
                            {updatingUser === u.id ? (
                               <Loader2 className="w-8 h-8 animate-spin text-primary ml-auto" />
                            ) : (
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="rounded-2xl h-16 w-16 glass-panel border-white/10 hover:bg-primary/20 transition-all shadow-xl group">
                                        <MoreVertical className="w-8 h-8 group-hover:text-primary transition-colors" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-[#0a061c] border-white/10 rounded-[3rem] w-96 p-8 shadow-[0_50px_100px_rgba(0,0,0,0.9)] mt-4">
                                     <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 hover:bg-primary/10 cursor-pointer transition-all mb-4" onClick={() => handleUpdateUser(u.id, { credits: increment(10000) })}>
                                        <Zap className="w-5 h-5 mr-4 text-primary" /> Inject +10K Credits
                                     </DropdownMenuItem>
                                     <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 hover:bg-emerald-500/10 cursor-pointer transition-all mb-4" onClick={() => handleUpdateUser(u.id, { isPremium: true, subscriptionPlan: 'pro', totalSpent: increment(99) })}>
                                        <Crown className="w-5 h-5 mr-4 text-emerald-500" /> Authorize Pro Studio
                                     </DropdownMenuItem>
                                     <div className="h-px bg-white/5 my-6" />
                                     <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 text-red-500 hover:bg-red-500/10 cursor-pointer transition-all" onClick={() => handleUpdateUser(u.id, { isAdmin: !u.isAdmin })}>
                                        <ShieldAlert className="w-5 h-5 mr-4" /> {u.isAdmin ? 'Revoke Master Clearance' : 'Grant Master Clearance'}
                                     </DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            )}
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </main>
    </div>
  );
}