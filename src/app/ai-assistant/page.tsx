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
  Tornado, ShieldCheck, Globe, Share2, TrendingUp
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
    { role: 'model', text: 'Hello! I am your VideoMaster Growth Strategist. How can I help you create your next viral masterpiece or grow your audience today?' }
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
        ? `[ANTIGRAVITY MODE ACTIVE: Focus on high-risk, high-reward viral strategies] ${userMsg}` 
        : userMsg;
        
      const result = await sendAiChatMessage({ message: messageWithContext });
      setMessages(prev => [...prev, { role: 'model', text: result.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: "Viral Growth Strategy", icon: TrendingUp, msg: "Give me 5 viral strategies to grow my YouTube Shorts channel using this app." },
    { label: "Share & Earn Credits", icon: Share2, msg: "How can I earn 1000+ credits fast by sharing VideoMaster AI?" },
    { label: "High-CTR Scripts", icon: Zap, msg: "Write a high-CTR opening hook for a finance niche reel." }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 mt-20 space-y-8 h-[calc(100vh-120px)] flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <div className="space-y-2 text-center md:text-left">
            <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Back to Studio
            </Link>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tighter">AI <span className="text-primary italic">Growth Strategist</span></h1>
          </div>
          
          <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-xl">
             <div className="flex items-center gap-3">
                <Tornado className={cn("w-5 h-5 transition-all", antigravityMode ? "text-primary animate-spin" : "text-muted-foreground")} />
                <div className="flex flex-col">
                   <Label htmlFor="antigravity" className="text-[10px] font-bold uppercase tracking-widest text-white cursor-pointer">Antigravity Mode</Label>
                   <span className="text-[8px] text-muted-foreground font-bold uppercase">Viral Ideation active</span>
                </div>
                <Switch 
                  id="antigravity" 
                  checked={antigravityMode} 
                  onCheckedChange={setAntigravityMode}
                  className="data-[state=checked]:bg-primary"
                />
             </div>
          </div>
        </header>

        {/* 🎨 PRESET ACTIONS */}
        <div className="flex flex-wrap gap-3 shrink-0">
           {presets.map((p, i) => (
             <button 
               key={i} 
               onClick={() => handleSend(p.msg)}
               disabled={loading}
               className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all uppercase tracking-widest"
             >
                <p.icon className="w-3 h-3" /> {p.label}
             </button>
           ))}
        </div>

        <Card className="flex-1 bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl blue-glow">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Growth Neural Core</p>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Always Online</p>
              </div>
            </div>
            {antigravityMode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                 <Zap className="w-3 h-3 text-primary" />
                 <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Stability Lock Active</span>
              </div>
            )}
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
          >
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[80%] p-6 rounded-[2rem]",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20" 
                    : "bg-white/5 border border-white/5 text-[#e1e4e8] rounded-tl-none"
                )}>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-black/40">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-4"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={antigravityMode ? "Ask for viral expansion strategies..." : "Ask anything..."}
                className="h-16 rounded-2xl bg-[#05070a] border-white/10 px-6 pr-20 text-white focus:border-primary/50 transition-all"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="absolute right-2 h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
