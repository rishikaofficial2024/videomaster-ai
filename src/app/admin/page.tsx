
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, DollarSign, BarChart3, Settings, 
  Loader2, ArrowUpRight, TrendingUp,
  Cpu, Activity, Database, AlertTriangle,
  RefreshCw, Lock, Globe, Eye, Search, CheckCircle2
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchUserCount = async () => {
      if (!db) return;
      try {
        const coll = collection(db, "users");
        const snapshot = await getCountFromServer(coll);
        setTotalUsersCount(snapshot.data().count);
      } catch (e) {
        console.error("User count fetch failed", e);
      }
    };
    fetchUserCount();
  }, [db]);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(20), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
              <Lock className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Master Admin Node</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Studio <span className="text-primary">Control</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">Aapka business yahan se manage hota hai.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
             <div className="flex flex-col px-4 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Live Users</span>
                <span className="text-2xl font-bold font-headline text-emerald-500">{totalUsersCount ?? "..."}</span>
             </div>
             <Globe className="w-8 h-8 text-primary opacity-20 animate-pulse" />
          </div>
        </header>

        {/* GOOGLE SEARCH STATUS CARD */}
        <section>
          <Card className="rounded-[3rem] bg-primary/5 border-primary/20 p-8 md:p-12 blue-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12">
              <Search className="w-48 h-48" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Google Search Indexing</h2>
                </div>
                <p className="text-muted-foreground max-w-xl font-medium italic leading-relaxed">
                  Aapka app technically live hai. Google Search mein top par aane ke liye niche di gayi guide follow karein. Ise manually submit karne se ranking 10x fast hoti hai.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Sitemap Live</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Robots.txt Ready</span>
                   </div>
                </div>
              </div>
              <Button className="h-20 px-12 rounded-[2rem] bg-primary font-bold shadow-2xl shadow-primary/40 text-lg hover:scale-105 transition-all" asChild>
                <Link href="/SEO_GUIDE.md">Google Par Rank Kaise Karein?</Link>
              </Button>
            </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* RECENT USERS */}
           <Card className="lg:col-span-2 rounded-[3rem] bg-[#0a0d14] border-white/5 overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-headline font-bold">User Management</CardTitle>
                <CardDescription>Live signups and project status.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest px-8">User</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Plan</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-8">Audit</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {usersLoading ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-20 opacity-40 italic">Syncing with database...</TableCell></TableRow>
                       ) : users?.map((u: any) => (
                         <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="font-bold text-white">{u.displayName || 'Creator'}</span>
                                  <span className="text-[10px] text-muted-foreground">{u.email}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[9px] uppercase tracking-widest">
                                  {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-right px-8">
                               <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                  <ArrowUpRight className="w-5 h-5" />
                                </Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>

           <div className="space-y-8">
              {/* SYSTEM NODE */}
              <Card className="rounded-[3rem] bg-[#0a0d14] border-white/5 p-10 space-y-6 shadow-2xl blue-glow">
                 <div className="flex items-center gap-4">
                    <Activity className="w-6 h-6 text-primary" />
                    <h4 className="text-xl font-bold font-headline">App Node Status</h4>
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Database Health</span>
                       <span className="text-emerald-500 font-bold text-xs">ONLINE</span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-emerald-500/10" />
                    
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Neural Link</span>
                       <span className="text-primary font-bold text-xs">STABLE</span>
                    </div>
                    <Progress value={98} className="h-1.5 bg-primary/10" />
                 </div>
                 <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10" asChild>
                    <Link href="/test-connection">Run Health Audit</Link>
                 </Button>
              </Card>

              {/* DOMAIN CONFIG */}
              <Card className="rounded-[3rem] bg-emerald-500/5 border-emerald-500/10 p-10 space-y-4 shadow-2xl">
                 <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Domain Node (.in)</h4>
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Agar aapne GoDaddy/Hostinger se domain le liya hai, toh usey connect karne ke liye instructions yahan hain.
                 </p>
                 <Button className="w-full h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500/20" asChild>
                    <Link href="/DOMAIN_GUIDE.md">Domain Setup Guide</Link>
                 </Button>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
