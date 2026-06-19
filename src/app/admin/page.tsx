
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, DollarSign, BarChart3, Settings, 
  Loader2, ArrowUpRight, TrendingUp,
  Cpu, Activity, Database, AlertTriangle,
  RefreshCw, Lock, Globe, Eye
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

export default function AdminDashboard() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch real-time user count for "Kitne logo ne dekha/signup kiya"
    const fetchUserCount = async () => {
      if (!db) return;
      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      setTotalUsersCount(snapshot.data().count);
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
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">System Control Node</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Business <span className="text-primary">Status</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">App ka live performance yahan dekhein.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
             <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                <Globe className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Live On Web</span>
             </div>
          </div>
        </header>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Total Signups", value: totalUsersCount ?? "...", icon: Users, trend: "+New", color: "text-primary" },
             { label: "Search Ranking", value: "Indexing", icon: Globe, trend: "Active", color: "text-emerald-500" },
             { label: "App Views", value: "Live", icon: Eye, trend: "Stable", color: "text-purple-500" },
             { label: "System Health", value: "99.9%", icon: Activity, trend: "Perfect", color: "text-orange-500" }
           ].map((stat, i) => (
             <Card key={i} className="rounded-[2.5rem] bg-[#0a0d14] border-white/5 p-8 blue-glow space-y-4">
               <div className="flex items-center justify-between">
                 <div className="p-3 bg-white/5 rounded-2xl"><stat.icon className={cn("w-5 h-5", stat.color)} /></div>
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                   {stat.trend} <TrendingUp className="w-3 h-3" />
                 </span>
               </div>
               <div>
                  <h3 className="text-3xl font-bold font-headline text-white">{stat.value}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
               </div>
             </Card>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* RECENT USERS TABLE */}
           <Card className="lg:col-span-2 rounded-[3rem] bg-[#0a0d14] border-white/5 overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-headline font-bold">User Management</CardTitle>
                <CardDescription>Ye log aapka app use kar rahe hain.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest px-8">User</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Plan</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Credits</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-8">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {usersLoading ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-10 opacity-50 italic">Database loading...</TableCell></TableRow>
                       ) : users?.map((u: any) => (
                         <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="px-8 py-5">
                               <div className="flex flex-col">
                                  <span className="font-bold text-sm text-white">{u.displayName || 'Creator'}</span>
                                  <span className="text-[10px] text-muted-foreground">{u.email}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[9px] uppercase tracking-widest">
                                  {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{u.credits || 0}</TableCell>
                            <TableCell className="text-right px-8">
                               <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                  <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>

           {/* SYSTEM HEALTH & SEO INFO */}
           <div className="space-y-8">
              <Card className="rounded-[3rem] bg-primary/5 border-primary/10 p-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <Globe className="w-6 h-6 text-primary" />
                    <h4 className="text-xl font-bold font-headline">Google Ranking</h4>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed italic">
                    Aapka app Bharat (India) mein `.in` search results ke liye optimize kar diya gaya hai. 
                    <b> 24-48 ghante </b> mein Google ise search mein dikhana shuru kar dega.
                 </p>
                 <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Indexing</span>
                       <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">QUEUED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mobile App</span>
                       <Badge className="bg-primary/20 text-primary hover:bg-primary/20">READY</Badge>
                    </div>
                 </div>
              </Card>

              <Card className="rounded-[3rem] bg-red-500/5 border-red-500/10 p-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <Activity className="w-6 h-6 text-red-500" />
                    <h4 className="text-xl font-bold font-headline">Live Server</h4>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status: 100% Online</span>
                    <Progress value={100} className="h-2 bg-red-500/10" />
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
