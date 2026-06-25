"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, Scissors, Type, Music, Smile, Wand2, Download, 
  ChevronLeft, Loader2, Video as VideoIcon, Plus, Layout, Settings2,
  Trash2, RotateCcw, RotateCw, Crop, Volume2, Sparkles, Youtube, 
  Smartphone, Monitor, Laptop, Info, Share2, Layers, History, Save, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Editor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAction = (action: string) => {
    toast({ title: `${action} Protocol Engaged`, description: "Processing your request on the cloud node..." });
  };

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Masterpiece Finalized", description: "Your 4K video has been archived and is ready for broadcast." });
    }, 3000);
  };

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col bg-[#05070a] overflow-hidden text-[#e1e4e8] dark">
      {/* Editor Header */}
      <header className="h-20 border-b border-white/5 px-6 flex items-center justify-between bg-[#0a061c]/80 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Link href="/dashboard"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tight truncate max-w-[300px] uppercase">Neural Edit Node_01</h1>
              <div className="px-2 py-0.5 bg-primary/20 rounded-md text-[9px] font-black text-primary uppercase tracking-widest border border-primary/30">Auto-Saving</div>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold opacity-40 mt-1 italic">Last sync: 2m ago • 4K Protocol Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2 bg-white/5 border-white/10 hover:bg-white/10 hidden md:flex uppercase text-[10px] tracking-widest">
            <Layout className="h-4 w-4" /> Ratio: 9:16
          </Button>
          <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/40 gap-3 group" onClick={handleExport}>
            <Download className="h-4 w-4 group-hover:translate-y-1 transition-transform" /> Export Master 4K
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Creative Arsenal */}
        <aside className="w-96 border-r border-white/5 bg-[#0a061c]/40 backdrop-blur-3xl flex flex-col z-30 hidden xl:flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 h-20 bg-white/5 rounded-none border-b border-white/5 p-2 gap-2">
              {[
                { val: "media", icon: VideoIcon, label: "Import" },
                { val: "edit", icon: Scissors, label: "Edit" },
                { val: "text", icon: Type, label: "Text" },
                { val: "audio", icon: Music, label: "Audio" },
                { val: "ai", icon: Sparkles, label: "AI Hub" }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.val}
                  value={tab.val} 
                  title={tab.label}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl transition-all flex flex-col gap-1 h-full"
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
              <TabsContent value="media" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Ingestion Node</h3>
                  <div className="border-2 border-dashed border-white/10 rounded-[2rem] h-48 flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-primary/50 cursor-pointer transition-all group overflow-hidden relative">
                    <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                      <Plus className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-center">
                       <span className="text-xs font-black uppercase tracking-widest">Broadcast Media</span>
                       <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight opacity-60 italic">Drop files or tap to select</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Archived Assets</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] bg-white/5 rounded-[1.5rem] relative overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-all">
                           <img src={`https://picsum.photos/seed/ed${i}/300/200`} className="object-cover w-full h-full opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" data-ai-hint="video fragment" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                             <div className="p-2 bg-primary rounded-xl"><Plus className="h-5 w-5 text-white" /></div>
                           </div>
                           <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black uppercase tracking-widest">Clip_{i}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="mt-0 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Atomic Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Scissors, label: "Split" },
                      { icon: Crop, label: "Crop" },
                      { icon: RotateCw, label: "Rotate" },
                      { icon: Volume2, label: "Volume" }
                    ].map(tool => (
                      <button key={tool.label} onClick={() => handleAction(tool.label)} className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group">
                        <tool.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Master Controls</h3>
                  <div className="space-y-3">
                     <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3"><Settings2 size={16} className="text-primary" /> Global Filters</span>
                        <ChevronRight size={14} className="opacity-40" />
                     </Button>
                     <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3"><History size={16} className="text-emerald-500" /> Version Control</span>
                        <ChevronRight size={14} className="opacity-40" />
                     </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-8">
                <div className="p-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-[2.5rem] border border-primary/30 space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles size={48} />
                  </div>
                  <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.3em] relative z-10">
                    <Wand2 className="h-6 w-6" /> Neural Forge
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium italic opacity-80 relative z-10">Engage the AI core to automate high-fidelity edits and creative workflows.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   <Button onClick={() => handleAction("AI Enhance")} className="h-20 rounded-[1.8rem] flex items-center justify-start px-8 gap-6 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 border border-primary/40 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                     <Wand2 className="h-6 w-6 relative z-10 group-hover:animate-pulse" /> 
                     <span className="relative z-10">Neural Auto-Enhance</span>
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Subtitles")} className="h-16 rounded-2xl flex items-center justify-start px-8 gap-5 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10">
                     <Sparkles className="h-5 w-5 text-purple-500" /> AI Caption Node
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Background")} className="h-16 rounded-2xl flex items-center justify-start px-8 gap-5 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10">
                     <Monitor className="h-5 w-5 text-blue-500" /> Neural Masking
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Object Removal")} className="h-16 rounded-2xl flex items-center justify-start px-8 gap-5 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10">
                     <Trash2 className="h-5 w-5 text-rose-500" /> Atomic Erase
                   </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Main Viewport Matrix */}
        <main className="flex-1 flex flex-col bg-black relative">
          <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
             
             <div className="relative aspect-video max-w-5xl w-full bg-[#0a061c] rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.9)] overflow-hidden ring-1 ring-white/10 group">
                <video 
                  ref={videoRef}
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40">
                   <button 
                    onClick={togglePlay}
                    className="h-24 w-24 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                   >
                     {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
                   </button>
                </div>
                
                {/* Visual HUD Overlays */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
                   <div className="flex items-center gap-6">
                      <span className="text-sm font-black font-mono tracking-widest text-primary">00:0{Math.floor(currentTime)}:24</span>
                      <div className="h-4 w-px bg-white/20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master_Feed.mp4</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-widest">4K Lossless</span></div>
                      <div className="flex items-center gap-2 text-muted-foreground/60"><Monitor className="h-3 w-3" /><span className="text-[10px] font-black uppercase tracking-widest">16:9 Cinema</span></div>
                   </div>
                </div>
             </div>
             
             {/* Dynamic HUD Controls */}
             <div className="flex items-center gap-8 mt-12 p-5 bg-[#0a061c]/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-full px-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-white/10 hover:text-primary transition-all"><RotateCcw className="h-6 w-6" /></Button>
                <div className="h-8 w-px bg-white/10" />
                <button 
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95 group"
                >
                  {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1 group-hover:animate-pulse" />}
                </button>
                <div className="h-8 w-px bg-white/10" />
                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-white/10 hover:text-primary transition-all"><RotateCw className="h-6 w-6" /></Button>
                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-rose-500/10 hover:text-rose-500 transition-all ml-4"><Trash2 className="h-6 w-6" /></Button>
             </div>
          </div>

          {/* Neural Timeline - Multi-Track Experience */}
          <div className="h-64 bg-[#0a061c] border-t border-white/5 p-6 flex flex-col gap-6 z-20 shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.5)]">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 px-4">
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-3 text-primary"><Layers className="h-4 w-4" /> Sequential Node Map</div>
                   <div className="flex items-center gap-3"><Music className="h-4 w-4" /> Audio Oscillator</div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 bg-white/5 rounded-full flex items-center gap-2"><Save className="h-3 w-3" /> Auto-Saved</div>
                   <div className="h-4 w-px bg-white/10" />
                   <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[9px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4">Zoom In</Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[9px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4">Zoom Out</Button>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
                {/* Video Master Track */}
                <div className="relative group">
                   <div className="h-16 w-full bg-white/[0.02] border border-white/5 rounded-2xl flex items-center px-6 gap-6 relative shadow-inner overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(0,112,243,0.8)] z-10" />
                      <div 
                        className="h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center px-4 gap-4 overflow-hidden relative group/clip cursor-move active:scale-[0.98] transition-all"
                        style={{ width: '75%', marginLeft: '5%' }}
                      >
                         {[1,2,3,4,5,6,7,8,9,10].map(i => (
                           <div key={i} className="shrink-0 w-16 h-10 bg-black/20 rounded-md border border-white/5 group-hover/clip:border-primary/50 transition-colors" />
                         ))}
                         <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white/80 shadow-[0_0_10px_white] z-20" />
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-10 w-10 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"><Plus size={20} /></Button>
                   </div>
                </div>

                {/* Neural Audio Track */}
                <div className="relative group">
                   <div className="h-12 w-full bg-white/[0.02] border border-white/5 rounded-2xl flex items-center px-6 gap-6 relative shadow-inner overflow-hidden">
                      <div 
                        className="h-8 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center px-4 gap-1 overflow-hidden relative group/audio cursor-move"
                        style={{ width: '60%', marginLeft: '12%' }}
                      >
                         <div className="flex-1 flex items-center gap-0.5 opacity-40 group-hover/audio:opacity-80 transition-opacity">
                           {[...Array(60)].map((_, i) => (
                             <div key={i} className="w-[1px] bg-purple-400" style={{ height: `${Math.sin(i) * 50 + 50}%` }} />
                           ))}
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-all"><Plus size={16} /></Button>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Neural Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-xl z-[200] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500">
           <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-primary/20 animate-ping absolute inset-0" />
              <div className="h-32 w-32 rounded-full border-4 border-t-primary animate-spin relative z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <VideoIcon className="h-10 w-10 text-primary animate-pulse" />
              </div>
           </div>
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-[0.3em] text-white">Neural Mastering Active</h2>
              <p className="text-primary font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Encoding 4K Ultra HD Stream • Optimizing Fidelity</p>
           </div>
           <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-primary animate-progress" />
           </div>
        </div>
      )}
    </div>
  );
}
