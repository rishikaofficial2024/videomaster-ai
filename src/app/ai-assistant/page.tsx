"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, Send, Bot, User, Loader2, 
  ArrowLeft, BrainCircuit, Zap, MessageSquare,
  Tornado, ShieldCheck, Globe, Share2, TrendingUp, Cpu, Rocket, ArrowRight
} from "lucide-react";
import { sendAiChatMessage } from "@/ai/flows/ai-chat-flow";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Identity Verified. Growth Strategist Core Online. How shall we expand your viral empire today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [antigravityMode, setAntigravityMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = customMsg || input.trim();
    if (!userMsg || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const messageWithContext = antigravityMode 
        ? `[ANTIGRAVITY MODE ACTIVE: Focus on high-risk, high-reward viral strategies for social dominance] ${userMsg}` 
        : userMsg;
        
      const result = await sendAiChatMessage({ message: messageWithContext });
      setMessages(prev => [...prev, { role: 'model', text: result.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Neural Sync Error. The core is temporarily busy. Please retry in 10 seconds." }]);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: "Viral Dominance", icon: TrendingUp, msg: "Give me 5 viral strategies to grow my YouTube Shorts channel using this app's AI features." },
    { label: "Expansion Protocol", icon: Rocket, msg: "How can I earn 2000+ credits fast by sharing VideoMaster AI across platforms?" },
    { label: "CTR Engineering", icon: Zap, msg: "Design a high-CTR narrative hook for a tech-focused TikTok reel." }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 mt-20 space-y-10 h-[calc(100vh-120px)] flex flex-col md:flex-row gap-10">
        
        {/* 🧠 NEURAL CORE INFO (DESKTOP) */}
        <div className="hidden md:flex flex-col w-80 space-y-8 shrink-0">
           <div className="space-y-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.4em]">
                <ArrowLeft className="w-3 h-3" /> Exit Terminal
              </Link>
              <h1 className="text-5xl font-headline font-black text-white tracking-tighter leading-none">
                Neural <span className="text-primary italic">Core</span>
              </h1>
           </div>

           <Card className="p-8 bg-primary/10 border-primary/30 rounded-[3rem] space-y-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-all duration-700">
                 <Cpu className="w-40 h-40 text-primary" />
              </div>
              <div className="space-y-2 relative z-10">
                 <h4 className="text-xs font-black uppercase tracking-widest text-primary">Core Intelligence</h4>
                 <p className="text-xl font-bold text-white leading-tight">Gemini 1.5 Flash Overclocked</p>
              </div>
              <div className="space-y-4 pt-4 border-t border-primary/20 relative z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Uptime</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">99.9%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Region</span>
                    <span className="text-[10px] font-bold text-white uppercase">Global Multi-Node</span>
                 </div>
              </div>
           </Card>

           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Quick Protocols</p>
              {presets.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(p.msg)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-primary/10 hover:border-primary/40 transition-all group"
                >
                   <div className="flex items-center gap-4">
                      <p.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-tight text-white/80">{p.label}</span>
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                </button>
              ))}
           </div>
        </div>

        {/* 🎨 MAIN CHAT INTERFACE */}
        <Card className="flex-1 bg-[#0a0d14]/90 backdrop-blur-3xl border-white/5 rounded-[4rem] overflow-hidden flex flex-col shadow-2xl blue-glow relative">
          
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                 <div className="w-16 h-16 bg-primary/20 rounded-[1.5rem] flex items-center justify-center border-2 border-primary/40 shadow-xl relative z-10">
                   <Bot className="w-8 h-8 text-primary" />
                 </div>
              </div>
              <div>
                <p className="text-2xl font-black font-headline text-white uppercase tracking-tight">Growth Strategist</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Neural Link Verified</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 bg-black/40 px-8 py-4 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-4">
                   <Tornado className={cn("w-6 h-6 transition-all", antigravityMode ? "text-primary animate-spin" : "text-muted-foreground")} />
                   <div className="flex flex-col">
                      <Label htmlFor="antigravity" className="text-[10px] font-black uppercase tracking-widest text-white cursor-pointer">Antigravity Mode</Label>
                      <span className="text-[8px] text-muted-foreground font-black uppercase tracking-tight">Viral Ideation Active</span>
                   </div>
                   <Switch 
                     id="antigravity" 
                     checked={antigravityMode} 
                     onCheckedChange={setAntigravityMode}
                     className="data-[state=checked]:bg-primary"
                   />
                </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide relative z-10"
          >
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[85%] p-8 rounded-[3rem] relative",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none shadow-2xl shadow-primary/30" 
                    : "bg-white/5 border border-white/5 text-[#e1e4e8] rounded-tl-none backdrop-blur-xl"
                )}>
                  <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] rounded-tl-none flex items-center gap-4 backdrop-blur-xl">
                  <div className="flex gap-1.5">
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Core Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 border-t border-white/5 bg-black/60 relative z-10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-6"
            >
              <div className="relative flex-1">
                 <Input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder={antigravityMode ? "Initiate viral dominance protocol..." : "Ask for strategic guidance..."}
                   className="h-20 rounded-[2rem] bg-[#05070a] border-white/10 px-10 text-lg text-white focus:border-primary/50 transition-all pr-24 font-medium"
                 />
                 <Button 
                   type="submit" 
                   disabled={loading || !input.trim()}
                   className="absolute right-3 top-3 h-14 w-14 rounded-[1.2rem] bg-primary shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                 >
                   <Send className="w-7 h-7" />
                 </Button>
              </div>
            </form>
            <p className="text-center mt-6 text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-40">Growth Strategist Node v2.5 • Powered by Elite Neural Core</p>
          </div>

          {/* 🌟 HOLOGRAPHIC BACKGROUND EFFECT */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] neural-pulse" />
             <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] neural-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </Card>
      </main>
    </div>
  );
}
