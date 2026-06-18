
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, DollarSign, BarChart3, Settings, 
  Loader2, ArrowUpRight, TrendingUp,
  Cpu, Activity, Database, AlertTriangle,
  RefreshCw, Lock
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(10), orderBy("createdAt", "desc"));
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
              Admin <span className="text-primary">Terminal</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 border-white/10 hover:bg-white/5">
                <RefreshCw className="w-4 h-4" /> Sync Stats
             </Button>
             <Button className="rounded-2xl h-12 gap-2 bg-primary shadow-xl shadow-primary/20">
                <Settings className="w-4 h-4" /> Global Config
             </Button>
          </div>
        </header>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Total Revenue", value: "₹45,200", icon: DollarSign, trend: "+12%", color: "text-emerald-500" },
             { label: "Active Users", value: "1,240", icon: Users, trend: "+5%", color: "text-primary" },
             { label: "AI Generations", value: "8,922", icon: BarChart3, trend: "+25%", color: "text-purple-500" },
             { label: "Storage Used", value: "85GB", icon: Database, trend: "Stable", color: "text-orange-500" }
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
                <CardDescription>Recent registrations and activity levels.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest px-8">User</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Credits</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-8">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {usersLoading ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-10 opacity-50 italic">Loading database nodes...</TableCell></TableRow>
                       ) : users?.map((u: any) => (
                         <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="px-8 py-5">
                               <div className="flex flex-col">
                                  <span className="font-bold text-sm text-white">{u.displayName || 'Anonymous'}</span>
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

           {/* SYSTEM HEALTH & CONFIG */}
           <div className="space-y-8">
              <Card className="rounded-[3rem] bg-red-500/5 border-red-500/10 p-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <Activity className="w-6 h-6 text-red-500" />
                    <h4 className="text-xl font-bold font-headline">System Integrity</h4>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span>Gemini API Usage</span>
                          <span className="text-red-500">82%</span>
                       </div>
                       <Progress value={82} className="h-1.5 bg-red-500/10" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span>Firebase Reads</span>
                          <span className="text-emerald-500">Healthy</span>
                       </div>
                       <Progress value={40} className="h-1.5 bg-emerald-500/10" />
                    </div>
                 </div>
                 <AlertTriangle className="w-20 h-20 text-red-500/5 absolute bottom-4 right-4" />
              </Card>

              <Card className="rounded-[3rem] bg-primary/5 border-primary/10 p-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <Cpu className="w-6 h-6 text-primary" />
                    <h4 className="text-xl font-bold font-headline">AI Controls</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Maintenance</span>
                       <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">OFF</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Signups</span>
                       <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">ENABLED</Badge>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
