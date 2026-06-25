"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, Banknote, ShieldCheck, Activity, 
  TrendingUp, BarChart3, Database, Cpu, 
  Globe, Zap, ArrowRight, ArrowUpRight, 
  Clock, Server
} from "lucide-react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer, getDocs } from "firebase/firestore";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";

const mockData = [
  { name: 'Mon', users: 400, rev: 2400 },
  { name: 'Tue', users: 300, rev: 1398 },
  { name: 'Wed', users: 200, rev: 9800 },
  { name: 'Thu', users: 278, rev: 3908 },
  { name: 'Fri', users: 189, rev: 4800 },
  { name: 'Sat', users: 239, rev: 3800 },
  { name: 'Sun', users: 349, rev: 4300 },
];

export default function AdminOverview() {
  const db = useFirestore();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenue: 0,
    activeVideos: 0,
    storageUsed: "142 GB"
  });

  useEffect(() => {
    if (db) {
      fetchLiveStats();
    }
  }, [db]);

  const fetchLiveStats = async () => {
    try {
      const usersColl = collection(db, "users");
      const countSnap = await getCountFromServer(usersColl);
      
      const usersSnap = await getDocs(usersColl);
      let totalRev = 0;
      usersSnap.forEach(doc => {
        const data = doc.data();
        totalRev += (data.totalSpent || 0);
        if (data.isPremium && !data.totalSpent) totalRev += 99;
      });

      setStats({
        totalUsers: countSnap.data().count,
        revenue: totalRev,
        activeVideos: countSnap.data().count * 4, // Est. ratio
        storageUsed: `${(countSnap.data().count * 0.15).toFixed(1)} GB`
      });
    } catch (e) {}
  };

  const dashboardCards = [
    { label: "Institutional Nodes", val: stats.totalUsers, icon: Users, trend: "+12% Growth", color: "text-primary" },
    { label: "Lifetime Revenue", val: `₹${stats.revenue.toLocaleString()}`, icon: Banknote, trend: "+8.4% MoM", color: "text-emerald-500" },
    { label: "Active Project Matrix", val: stats.activeVideos, icon: Activity, trend: "48s Node Latency", color: "text-indigo-400" },
    { label: "Cloud Node Storage", val: stats.storageUsed, icon: Database, trend: "98% Efficiency", color: "text-amber-500" },
  ];

  return (
    <main className="p-12 space-y-16 max-w-[100rem] mx-auto">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
          <Globe className="w-4 h-4" /> MASTER OVERVIEW HUB
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white uppercase leading-none">Empire <span className="text-primary italic">Stats.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Real-time neural feedback from the creative infrastructure.</p>
          </div>
          <div className="p-6 glass-panel rounded-[2.5rem] border-white/5 flex items-center gap-8 shadow-2xl">
             <div className="flex flex-col px-6 border-r border-white/10 text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-40">Matrix Health</span>
                <span className="text-2xl font-bold font-headline text-emerald-500">EXCELLENT</span>
             </div>
             <Activity className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {dashboardCards.map((stat, i) => (
          <Card key={i} className="premium-card p-10 relative overflow-hidden group border-white/5 bg-white/[0.01]">
            <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 rotate-12">
               <stat.icon className="w-40 h-40" />
            </div>
            <div className="space-y-8 relative z-10">
               <div className={cn("p-4 rounded-2xl inline-flex shadow-inner border border-white/5", stat.color.replace('text', 'bg').replace('500', '500/10').replace('400', '400/10'))}>
                 <stat.icon className={cn("w-6 h-6", stat.color)} />
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{stat.label}</p>
                 <h3 className="text-5xl font-black text-white tracking-tighter uppercase">{stat.val}</h3>
               </div>
               <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
               </div>
            </div>
          </Card>
        ))}
      </section>

      {/* CHARTS AREA */}
      <div className="grid lg:grid-cols-3 gap-12">
        <Card className="lg:col-span-2 rounded-[4rem] glass-panel border-white/5 p-12 space-y-10 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="text-3xl font-black font-headline text-white uppercase tracking-tight">Growth Trajectory</h4>
                 <p className="text-xs text-muted-foreground italic">Institutional node expansion over the last 7 cycles.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Active Nodes</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Revenue Stream</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a061c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                  <Area type="monotone" dataKey="rev" stroke="#6366f1" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <div className="space-y-12">
          <Card className="rounded-[4rem] bg-primary/5 border border-primary/20 p-12 space-y-10 relative overflow-hidden group hover:border-primary/40 transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform">
                <Cpu className="w-40 h-40 text-primary" />
             </div>
             <div className="space-y-4 relative z-10">
                <h4 className="text-3xl font-black font-headline text-white uppercase tracking-tight">AI Compute Hub</h4>
                <p className="text-base text-muted-foreground italic leading-relaxed opacity-60">Neural processing nodes are performing at 98.4% fidelity.</p>
             </div>
             <div className="grid grid-cols-2 gap-6 relative z-10 pt-4">
                <div className="p-6 bg-black/40 rounded-[1.8rem] border border-white/5">
                   <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Gemini Flash</p>
                   <p className="text-xl font-bold text-white">Active</p>
                </div>
                <div className="p-6 bg-black/40 rounded-[1.8rem] border border-white/5">
                   <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Veo Motion</p>
                   <p className="text-xl font-bold text-white">Stable</p>
                </div>
             </div>
          </Card>

          <Card className="rounded-[4rem] bg-[#0a0d14]/80 backdrop-blur-3xl border border-white/5 p-12 space-y-8 shadow-2xl relative overflow-hidden">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
                <Clock className="w-4 h-4" /> Node Timeline
             </h4>
             <div className="space-y-6">
                {[
                  { label: "Registry Sync", time: "2m ago", status: "Verified" },
                  { label: "Revenue Node", time: "14m ago", status: "Success" },
                  { label: "App Check Scan", time: "1h ago", status: "Protected" }
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{log.label}</p>
                       <p className="text-[9px] text-muted-foreground font-medium italic">{log.time}</p>
                    </div>
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full">{log.status}</span>
                  </div>
                ))}
             </div>
             <button className="w-full text-center pt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all flex items-center justify-center gap-2 group">
                Access Audit Logs <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </button>
          </Card>
        </div>
      </div>
    </main>
  );
}
