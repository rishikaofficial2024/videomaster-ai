"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, Scissors, Type, Music, Smile, Wand2, Download, 
  ChevronLeft, Loader2, Video as VideoIcon, Plus, Layout, Settings2,
  Trash2, RotateCcw, RotateCw, Crop, Volume2, Sparkles, Youtube, 
  Smartphone, Monitor, Laptop, Info, Share2, Layers, History, Save, 
  ChevronRight, Undo2, Redo2, Maximize, Pipette, Palette, Ghost,
  CloudUpload, Image as ImageIcon, MessageSquare, Filter as FilterIcon,
  Sun, Contrast, Droplets, BlurIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

function EditorSlider({ label, value, min = 0, max = 100, onChange }: any) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/60">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden group">
         <div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
         <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="h-full bg-primary shadow-glow transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Editor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
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
    toast({ title: `${action} Protocol Engaged`, description: "Processing your request on the neural node..." });
  };

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Masterpiece Finalized", description: "Your 4K video has been archived to the global CDN." });
    }, 4000);
  };

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col bg-[#010101] overflow-hidden text-[#e1e4e8] selection:bg-primary/40">
      {/* Premium Editor Header */}
      <header className="h-24 border-b border-white/5 px-8 flex items-center justify-between bg-[#0a061c]/60 backdrop-blur-3xl z-50 shadow-2xl">
        <div className="flex items-center gap-10">
          <Button variant="ghost" size="icon" asChild className="rounded-3xl h-14 w-14 bg-white/5 hover:bg-primary/20 border border-white/10 transition-all shadow-xl group">
            <Link href="/dashboard"><ChevronLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform" /></Link>
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black tracking-tighter truncate max-w-[400px] uppercase text-white">Neural Edit Node_01</h1>
              <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-[0.5em] border border-emerald-500/20 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">CLOUD SYNCED</div>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.6em] font-black opacity-30 mt-1.5 italic">Engine: Gemini Flash 1.5 • Bitrate: Lossless</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden xl:flex items-center gap-6 px-8 h-14 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
             <div className="flex items-center gap-6 border-r border-white/10 pr-10 mr-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:text-primary transition-colors"><Undo2 size={20} /></Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:text-primary transition-colors"><Redo2 size={20} /></Button>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">
                <Monitor className="h-4 w-4" /> Aspect: 9:16
             </div>
          </div>
          
          <Button className="rounded-[1.8rem] h-16 px-12 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/40 gap-5 group active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white" onClick={handleExport}>
            <Download className="h-6 w-6 group-hover:translate-y-1 transition-transform" /> EXPORT MASTER 4K
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Control Panel */}
        <aside className="w-[500px] border-r border-white/5 bg-[#0a061c]/20 backdrop-blur-3xl flex flex-col z-30 hidden xl:flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-7 h-28 bg-white/5 rounded-none border-b border-white/5 p-4 gap-4">
              {[
                { val: "media", icon: ImageIcon, label: "Media" },
                { val: "edit", icon: Scissors, label: "Tools" },
                { val: "text", icon: Type, label: "Text" },
                { val: "audio", icon: Music, label: "Audio" },
                { val: "ai", icon: Sparkles, label: "AI Hub" },
                { val: "adjust", icon: Palette, label: "Adjust" },
                { val: "assets", icon: Ghost, label: "Node" }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.val}
                  value={tab.val} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[1.5rem] transition-all flex flex-col gap-2.5 h-full py-5 shadow-inner"
                >
                  <tab.icon className="h-6 w-6" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-12">
              <TabsContent value="media" className="mt-0 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/40 ml-4">INGESTION PROTOCOL</h3>
                  <div className="border-4 border-dashed border-white/5 rounded-[4rem] h-72 flex flex-col items-center justify-center gap-8 hover:bg-white/5 hover:border-primary/40 cursor-pointer transition-all group overflow-hidden relative shadow-inner">
                    <div className="p-8 bg-primary/10 rounded-[2.5rem] group-hover:scale-110 transition-all duration-700 shadow-2xl border-2 border-primary/20">
                      <CloudUpload className="h-14 w-14 text-primary" />
                    </div>
                    <div className="text-center space-y-3">
                       <span className="text-lg font-black uppercase tracking-tight text-white">Ingest Broadcast Asset</span>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] italic opacity-40">MP4, MOV, WAV, PNG, RAW</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/40 ml-4">ACTIVE BUFFER</h3>
                   <div className="grid grid-cols-2 gap-8">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] bg-white/5 rounded-[3rem] relative overflow-hidden group cursor-pointer border-2 border-white/5 hover:border-primary/50 transition-all shadow-2xl">
                           <img src={`https://picsum.photos/seed/editor${i}/400/300`} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s]" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-md">
                             <div className="p-5 bg-primary rounded-3xl shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500"><Plus className="h-8 w-8 text-white" /></div>
                           </div>
                           <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-2xl rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl">NODE_BUFFER_0{i}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="mt-0 space-y-12">
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/40 ml-4">ATOMIC TOOLSET</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Scissors, label: "Split Node" },
                      { icon: Crop, label: "Crop Matrix" },
                      { icon: RotateCw, label: "Flip Axis" },
                      { icon: Volume2, label: "Audio Logic" },
                      { icon: Layout, label: "Ratio Protocol" },
                      { icon: History, label: "Snapshots" }
                    ].map(tool => (
                      <button key={tool.label} onClick={() => handleAction(tool.label)} className="flex flex-col items-center justify-center p-10 rounded-[3.5rem] bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all gap-5 group shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <tool.icon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110 duration-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="mt-0 space-y-12">
                <div className="space-y-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/40 ml-4">NEURAL COLOR GRADING</h3>
                  
                  <Card className="rounded-[4rem] bg-white/[0.02] border-white/10 p-12 space-y-12 shadow-inner">
                    <EditorSlider label="Luminance" value={brightness} onChange={setBrightness} />
                    <EditorSlider label="Contrast Matrix" value={contrast} onChange={setContrast} />
                    <EditorSlider label="Chrominance" value={saturation} onChange={setSaturation} />
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                     <Button variant="outline" onClick={() => handleAction("Auto-Grade")} className="h-20 rounded-[2rem] gap-4 font-black uppercase tracking-[0.4em] text-[10px] bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/40 transition-all shadow-xl">
                        <Palette size={18} className="text-primary animate-pulse" /> AUTO GRADE
                     </Button>
                     <Button variant="outline" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }} className="h-20 rounded-[2rem] gap-4 font-black uppercase tracking-[0.4em] text-[10px] bg-white/5 border-white/10 hover:bg-rose-500/10 transition-all shadow-xl">
                        <RotateCcw size={18} className="text-rose-500" /> RESET NODE
                     </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-12">
                <div className="p-12 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-[4rem] border-2 border-primary/40 space-y-8 relative overflow-hidden group shadow-[0_0_80px_rgba(0,112,243,0.2)]">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-[2s]">
                    <Sparkles size={100} />
                  </div>
                  <div className="flex items-center gap-6 text-primary font-black text-sm uppercase tracking-[0.6em] relative z-10">
                    <div className="p-4 bg-primary/20 rounded-3xl shadow-2xl border border-primary/30"><Wand2 className="h-10 w-10" /></div>
                    Neural Core
                  </div>
                  <p className="text-xl text-white font-black italic opacity-90 relative z-10 leading-tight">Deploy elite generative logic to automate your production pipeline.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                   <Button onClick={() => handleAction("AI Enhancement")} className="h-28 rounded-[3rem] flex items-center justify-start px-12 gap-10 font-black uppercase tracking-[0.4em] text-[14px] shadow-2xl shadow-primary/40 border border-primary/40 group relative overflow-hidden active:scale-95 transition-all bg-primary text-white">
                     <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-all duration-[1s]" />
                     <Wand2 className="h-10 w-10 relative z-10 group-hover:animate-pulse" /> 
                     <span className="relative z-10">NEURAL AUTO-ENHANCE</span>
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("AI Transcribe")} className="h-24 rounded-[2.5rem] flex items-center justify-start px-12 gap-8 font-black uppercase tracking-[0.4em] text-[11px] bg-white/5 border-white/10 hover:bg-white/10 group transition-all">
                     <MessageSquare className="h-7 w-7 text-purple-500 group-hover:scale-125 transition-transform" /> NEURAL CAPTION NODE
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Background Removal")} className="h-24 rounded-[2.5rem] flex items-center justify-start px-12 gap-8 font-black uppercase tracking-[0.4em] text-[11px] bg-white/5 border-white/10 hover:bg-white/10 group transition-all">
                     <Monitor className="h-7 w-7 text-blue-500 group-hover:scale-125 transition-transform" /> NEURAL MASKING
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Atomic Eraser")} className="h-24 rounded-[2.5rem] flex items-center justify-start px-12 gap-8 font-black uppercase tracking-[0.4em] text-[11px] bg-white/5 border-white/10 hover:bg-rose-500/10 group transition-all">
                     <Trash2 className="h-7 w-7 text-rose-500 group-hover:scale-125 transition-transform" /> ATOMIC ERASER
                   </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Master Viewport - CapCut Style */}
        <main className="flex-1 flex flex-col bg-black relative">
          <div className="flex-1 flex flex-col items-center justify-center p-16 relative overflow-hidden">
             {/* Atmospheric Neural Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/10 blur-[300px] -z-10 rounded-full animate-pulse duration-[5s]" />
             
             <div className="relative aspect-video max-w-7xl w-full bg-[#050505] rounded-[5rem] shadow-[0_120px_250px_-50px_rgba(0,0,0,1)] overflow-hidden ring-4 ring-white/5 group border-2 border-white/5">
                <video 
                  ref={videoRef}
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  className="w-full h-full object-contain transition-all duration-[1s]"
                  style={{ 
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` 
                  }}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
                
                {/* Center Play Interaction */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black/40 backdrop-blur-[2px]">
                   <button 
                    onClick={togglePlay}
                    className="h-40 w-40 rounded-full bg-white text-primary flex items-center justify-center shadow-[0_0_120px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-90 transition-all group"
                   >
                     {isPlaying ? <Pause className="h-16 w-16 fill-current" /> : <Play className="h-16 w-16 fill-current ml-3 group-hover:animate-pulse" />}
                   </button>
                </div>
                
                {/* HUD Matrix Overlay */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center px-12 py-6 bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
                   <div className="flex items-center gap-12">
                      <span className="text-3xl font-black font-mono tracking-[0.3em] text-primary">00:0{Math.floor(currentTime)}:24</span>
                      <div className="h-10 w-px bg-white/20" />
                      <span className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/60 italic">MASTER_PROTOCOL_v01.mp4</span>
                   </div>
                   <div className="flex items-center gap-12">
                      <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)]" /><span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">LOSSLESS HDR</span></div>
                      <div className="flex items-center gap-4 text-muted-foreground/40"><Monitor className="h-5 w-5" /><span className="text-[11px] font-black uppercase tracking-[0.4em]">16:9 PRO CINEMA</span></div>
                   </div>
                </div>
             </div>
             
             {/* Dynamic HUD Controllers */}
             <div className="flex items-center gap-16 mt-20 p-8 bg-[#0a061c]/80 backdrop-blur-3xl border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.7)] rounded-full px-24 animate-in fade-in slide-in-from-bottom-20 duration-[1.2s] ring-1 ring-white/10">
                <Button variant="ghost" size="icon" className="rounded-3xl h-16 w-16 hover:bg-white/10 hover:text-primary transition-all active:scale-90"><RotateCcw className="h-10 w-10" /></Button>
                <div className="h-12 w-px bg-white/10" />
                <button 
                  onClick={togglePlay}
                  className="h-28 w-28 rounded-[2.5rem] bg-primary text-primary-foreground flex items-center justify-center shadow-[0_30px_70px_rgba(0,112,243,0.5)] hover:scale-110 active:scale-90 transition-all group ring-4 ring-primary/20"
                >
                  {isPlaying ? <Pause className="h-12 w-12 fill-current" /> : <Play className="h-12 w-12 fill-current ml-2 group-hover:animate-pulse" />}
                </button>
                <div className="h-12 w-px bg-white/10" />
                <Button variant="ghost" size="icon" className="rounded-3xl h-16 w-16 hover:bg-white/10 hover:text-primary transition-all active:scale-90"><RotateCw className="h-10 w-10" /></Button>
                <Button variant="ghost" size="icon" className="rounded-3xl h-16 w-16 hover:bg-rose-500/10 hover:text-rose-500 transition-all ml-10 active:scale-90"><Trash2 className="h-10 w-10" /></Button>
                <Button variant="ghost" size="icon" className="rounded-3xl h-16 w-16 hover:bg-white/10 hover:text-primary transition-all ml-4 active:scale-90"><Maximize className="h-9 w-9" /></Button>
             </div>
          </div>

          {/* Multi-Track Neural Timeline Matrix */}
          <div className="h-[450px] bg-[#050505] border-t border-white/5 p-12 flex flex-col gap-12 z-20 shadow-[0_-80px_150px_-30px_rgba(0,0,0,0.9)] relative">
             <div className="absolute top-0 left-1/4 bottom-0 w-px bg-primary/20 z-10 shadow-[0_0_20px_rgba(0,112,243,0.2)]" />
             
             <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 px-10">
                <div className="flex items-center gap-16">
                   <div className="flex items-center gap-5 text-primary"><Layers className="h-6 w-6" /> Timeline Matrix</div>
                   <div className="flex items-center gap-5 hover:text-primary transition-all cursor-pointer group"><Music className="h-6 w-6 group-hover:animate-pulse" /> Audio OSC</div>
                   <div className="flex items-center gap-5 hover:text-primary transition-all cursor-pointer group"><Type className="h-6 w-6 group-hover:animate-pulse" /> Title Layers</div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="px-6 py-2.5 bg-emerald-500/5 rounded-full flex items-center gap-4 border border-emerald-500/10 text-emerald-500 font-bold shadow-inner"><Save className="h-4 w-4" /> Cloud Synced</div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="flex items-center gap-6">
                      <Button variant="ghost" size="sm" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-8 transition-all active:scale-95">Zoom In</Button>
                      <Button variant="ghost" size="sm" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-8 transition-all active:scale-95">Zoom Out</Button>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide pr-6">
                {/* Track 01: Video Matrix */}
                <div className="relative group">
                   <div className="h-28 w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex items-center px-10 gap-10 relative shadow-inner overflow-hidden group/track">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary shadow-[0_0_40px_rgba(0,112,243,1)] z-10" />
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground absolute left-6 top-3 opacity-20">Track_01: VIDEO</div>
                      <div 
                        className="h-20 bg-primary/10 border-2 border-primary/30 rounded-[2rem] flex items-center px-8 gap-8 overflow-hidden relative group/clip cursor-move hover:bg-primary/20 transition-all shadow-2xl"
                        style={{ width: '85%', marginLeft: '5%' }}
                      >
                         {[1,2,3,4,5,6,7,8].map(i => (
                           <div key={i} className="shrink-0 w-32 h-14 bg-black/40 rounded-2xl border border-white/5 group-hover/clip:border-primary/50 transition-all relative overflow-hidden shadow-inner">
                              <img src={`https://picsum.photos/seed/thumb${i}/1200/800`} className="object-cover w-full h-full opacity-40 group-hover:scale-110 transition-transform duration-1000" />
                           </div>
                         ))}
                         <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white shadow-[0_0_30px_white] z-20 animate-pulse" />
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-16 w-16 rounded-[1.8rem] bg-white/5 hover:bg-primary/20 hover:text-primary transition-all shadow-xl"><Plus size={32} /></Button>
                   </div>
                </div>

                {/* Track 02: Titles Matrix */}
                <div className="relative group">
                   <div className="h-20 w-full bg-white/[0.01] border border-white/5 rounded-[2rem] flex items-center px-10 gap-10 relative shadow-inner overflow-hidden">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground absolute left-6 top-2.5 opacity-20">Track_02: TITLES</div>
                      <div 
                        className="h-12 bg-amber-500/10 border-2 border-amber-500/20 rounded-[1.5rem] flex items-center px-8 gap-5 overflow-hidden relative group/title cursor-move shadow-xl"
                        style={{ width: '40%', marginLeft: '18%' }}
                      >
                         <Type className="h-4 w-4 text-amber-500" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/80 truncate">NEURAL_TITLE_01.txt</span>
                      </div>
                   </div>
                </div>

                {/* Track 03: Audio Matrix */}
                <div className="relative group">
                   <div className="h-24 w-full bg-white/[0.01] border border-white/5 rounded-[2rem] flex items-center px-10 gap-10 relative shadow-inner overflow-hidden">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground absolute left-6 top-2.5 opacity-20">Track_03: AUDIO</div>
                      <div 
                        className="h-14 bg-purple-500/10 border-2 border-purple-500/30 rounded-[1.5rem] flex items-center px-8 gap-3 overflow-hidden relative group/audio cursor-move shadow-2xl"
                        style={{ width: '70%', marginLeft: '12%' }}
                      >
                         <div className="flex-1 flex items-center gap-1.5 opacity-40 group-hover/audio:opacity-100 transition-all duration-[1s]">
                           {[...Array(120)].map((_, i) => (
                             <div key={i} className="w-[2px] bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ height: `${Math.sin(i * 0.4) * 50 + 50}%` }} />
                           ))}
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-14 w-14 rounded-[1.5rem] bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-all shadow-xl"><Plus size={28} /></Button>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Neural Mastering Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#000000]/98 backdrop-blur-[60px] z-[500] flex flex-col items-center justify-center gap-16 animate-in fade-in duration-1000">
           <div className="relative">
              <div className="h-64 w-64 rounded-full border-8 border-primary/10 animate-ping absolute inset-0" />
              <div className="h-64 w-64 rounded-full border-8 border-t-primary animate-spin relative z-10 duration-[3s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <VideoIcon className="h-24 w-24 text-primary animate-pulse" />
              </div>
              <div className="absolute -inset-20 bg-primary/20 blur-[150px] rounded-full animate-pulse -z-10" />
           </div>
           <div className="text-center space-y-8">
              <h2 className="text-7xl font-black uppercase tracking-[0.6em] text-white">Neural Mastering</h2>
              <div className="flex items-center justify-center gap-8">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_30px_rgba(16,185,129,1)]" />
                 <p className="text-primary font-black uppercase tracking-[1em] text-[14px] animate-pulse">Encoding 4K Master Pipeline • Global CDN Propagation</p>
              </div>
           </div>
           <div className="w-[700px] h-3 bg-white/5 rounded-full overflow-hidden mt-12 border border-white/10 p-1 shadow-inner">
              <div className="h-full bg-primary animate-progress rounded-full shadow-glow" />
           </div>
           <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[1.5em] opacity-40 mt-16">BROADCAST READY IN 4 SECONDS</p>
        </div>
      )}
    </div>
  );
}
