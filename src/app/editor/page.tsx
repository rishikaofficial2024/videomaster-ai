"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/sidebar"; // Placeholder import, assuming standard shadcn slider exists or using generic
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

// Custom Slider for internal Adjust tab
function EditorSlider({ label, value, min = 0, max = 100, onChange }: any) {
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

export default function Editor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Correction State
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
      {/* Editor Master Header */}
      <header className="h-20 border-b border-white/5 px-6 flex items-center justify-between bg-[#0a061c]/80 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Link href="/dashboard"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tight truncate max-w-[300px] uppercase">Neural Edit Node_01</h1>
              <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Auto-Saving</div>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold opacity-30 mt-1 italic">Last sync: 2m ago • 4K Engine Locked</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-6 h-12 bg-white/5 rounded-2xl border border-white/10">
             <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Undo2 size={16} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Redo2 size={16} /></Button>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Monitor className="h-3 w-3" /> Ratio: 9:16
             </div>
          </div>
          
          <Button className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/40 gap-4 group" onClick={handleExport}>
            <Download className="h-5 w-5 group-hover:translate-y-1 transition-transform" /> Export Master 4K
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Matrix */}
        <aside className="w-[450px] border-r border-white/5 bg-[#0a061c]/40 backdrop-blur-3xl flex flex-col z-30 hidden xl:flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-7 h-24 bg-white/5 rounded-none border-b border-white/5 p-3 gap-3">
              {[
                { val: "media", icon: ImageIcon, label: "Media" },
                { val: "edit", icon: Scissors, label: "Tools" },
                { val: "text", icon: Type, label: "Text" },
                { val: "audio", icon: Music, label: "Audio" },
                { val: "ai", icon: Sparkles, label: "AI Hub" },
                { val: "adjust", icon: Palette, label: "Adjust" },
                { val: "assets", icon: Ghost, label: "Overlays" }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.val}
                  value={tab.val} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl transition-all flex flex-col gap-2 h-full py-4"
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide space-y-10">
              <TabsContent value="media" className="mt-0 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-2">Ingestion Protocol</h3>
                  <div className="border-4 border-dashed border-white/5 rounded-[3rem] h-64 flex flex-col items-center justify-center gap-6 hover:bg-white/5 hover:border-primary/40 cursor-pointer transition-all group overflow-hidden relative shadow-inner">
                    <div className="p-6 bg-primary/10 rounded-[2rem] group-hover:scale-110 transition-transform shadow-2xl">
                      <CloudUpload className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                       <span className="text-sm font-black uppercase tracking-widest">Broadcast Asset</span>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] italic opacity-40">MP4, MOV, WAV, PNG, JPEG</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-2">Active Buffer</h3>
                   <div className="grid grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] bg-white/5 rounded-[2.5rem] relative overflow-hidden group cursor-pointer border-2 border-white/5 hover:border-primary/50 transition-all shadow-xl">
                           <img src={`https://picsum.photos/seed/ed${i}/400/300`} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" data-ai-hint="video fragment" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-sm">
                             <div className="p-4 bg-primary rounded-[1.5rem] shadow-2xl scale-50 group-hover:scale-100 transition-transform"><Plus className="h-6 w-6 text-white" /></div>
                           </div>
                           <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-xl rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">CLIP_{i}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="mt-0 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-2">Atomic Toolset</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Scissors, label: "Split Node" },
                      { icon: Crop, label: "Crop Matrix" },
                      { icon: RotateCw, label: "Flip Axis" },
                      { icon: Volume2, label: "Audio Logic" },
                      { icon: Layout, label: "Resolution" },
                      { icon: History, label: "Versioning" }
                    ].map(tool => (
                      <button key={tool.label} onClick={() => handleAction(tool.label)} className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all gap-4 group shadow-xl">
                        <tool.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-8 bg-indigo-500/5 rounded-[3rem] border border-indigo-500/20 space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3"><FilterIcon size={14} /> Transitions</h4>
                   <p className="text-xs text-muted-foreground italic leading-relaxed">Add cinematic blending nodes between timeline segments.</p>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="mt-0 space-y-10">
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground ml-2">Color Correction Node</h3>
                  
                  <Card className="rounded-[3rem] bg-white/[0.02] border-white/10 p-10 space-y-8 shadow-inner">
                    <EditorSlider 
                      label="Brightness Hub" 
                      icon={Sun} 
                      value={brightness} 
                      onChange={setBrightness} 
                    />
                    <EditorSlider 
                      label="Contrast Logic" 
                      icon={Contrast} 
                      value={contrast} 
                      onChange={setContrast} 
                    />
                    <EditorSlider 
                      label="Saturation Node" 
                      icon={Droplets} 
                      value={saturation} 
                      onChange={setSaturation} 
                    />
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                     <Button variant="outline" onClick={() => handleAction("Auto-Color")} className="h-16 rounded-2xl gap-3 font-black uppercase tracking-widest text-[9px] bg-white/5 border-white/10">
                        <Palette size={14} className="text-primary" /> Auto Grade
                     </Button>
                     <Button variant="outline" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }} className="h-16 rounded-2xl gap-3 font-black uppercase tracking-widest text-[9px] bg-white/5 border-white/10">
                        <RotateCcw size={14} className="text-rose-500" /> Reset All
                     </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-10">
                <div className="p-10 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-[3rem] border border-primary/30 space-y-6 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                    <Sparkles size={64} />
                  </div>
                  <div className="flex items-center gap-6 text-primary font-black text-sm uppercase tracking-[0.4em] relative z-10">
                    <div className="p-3 bg-primary/20 rounded-2xl shadow-inner"><Wand2 className="h-8 w-8" /></div>
                    Neural Matrix
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium italic opacity-90 relative z-10">Deploy elite generative AI to automate your visual storytelling.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                   <Button onClick={() => handleAction("AI Enhance")} className="h-24 rounded-[2.5rem] flex items-center justify-start px-10 gap-8 font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-primary/30 border border-primary/40 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-80 group-hover:opacity-100 transition-all duration-700" />
                     <Wand2 className="h-8 w-8 relative z-10 group-hover:animate-pulse" /> 
                     <span className="relative z-10">NEURAL AUTO-ENHANCE</span>
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("AI Subtitles")} className="h-20 rounded-[2rem] flex items-center justify-start px-10 gap-6 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10 group">
                     <MessageSquare className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" /> AI Subtitle Node
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("BG Remove")} className="h-20 rounded-[2rem] flex items-center justify-start px-10 gap-6 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10 group">
                     <Monitor className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" /> Neural Masking
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Object Removal")} className="h-20 rounded-[2rem] flex items-center justify-start px-10 gap-6 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10 hover:bg-white/10 group">
                     <Trash2 className="h-6 w-6 text-rose-500 group-hover:scale-110 transition-transform" /> Atomic Eraser
                   </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Master Viewport Hub */}
        <main className="flex-1 flex flex-col bg-black relative">
          <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
             {/* Neural Background Atmos */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 blur-[200px] -z-10 rounded-full animate-pulse" />
             
             <div className="relative aspect-video max-w-6xl w-full bg-[#0a061c] rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] overflow-hidden ring-2 ring-white/5 group border-2 border-white/5">
                <video 
                  ref={videoRef}
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  className="w-full h-full object-contain transition-all duration-700"
                  style={{ 
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` 
                  }}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black/60 backdrop-blur-sm">
                   <button 
                    onClick={togglePlay}
                    className="h-32 w-32 rounded-full bg-white text-primary flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.4)] hover:scale-110 transition-all active:scale-95 group"
                   >
                     {isPlaying ? <Pause className="h-14 w-14 fill-current" /> : <Play className="h-14 w-14 fill-current ml-2 group-hover:animate-pulse" />}
                   </button>
                </div>
                
                {/* Visual HUD Nodes */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center px-10 py-5 bg-black/60 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl">
                   <div className="flex items-center gap-10">
                      <span className="text-xl font-black font-mono tracking-[0.2em] text-primary">00:0{Math.floor(currentTime)}:24</span>
                      <div className="h-6 w-px bg-white/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">MASTER_PROTOCOL_v01.mp4</span>
                   </div>
                   <div className="flex items-center gap-10">
                      <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Lossless Active</span></div>
                      <div className="flex items-center gap-3 text-muted-foreground/60"><Monitor className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">16:9 CINEMA</span></div>
                   </div>
                </div>
             </div>
             
             {/* Unified HUD Controllers */}
             <div className="flex items-center gap-12 mt-16 p-6 bg-[#0a061c]/80 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-full px-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-white/10 hover:text-primary transition-all"><RotateCcw className="h-8 w-8" /></Button>
                <div className="h-10 w-px bg-white/10" />
                <button 
                  onClick={togglePlay}
                  className="h-24 w-24 rounded-[2.5rem] bg-primary text-primary-foreground flex items-center justify-center shadow-[0_20px_50px_rgba(0,112,243,0.4)] hover:scale-110 transition-all active:scale-95 group"
                >
                  {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-2 group-hover:animate-pulse" />}
                </button>
                <div className="h-10 w-px bg-white/10" />
                <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-white/10 hover:text-primary transition-all"><RotateCw className="h-8 w-8" /></Button>
                <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-rose-500/10 hover:text-rose-500 transition-all ml-6"><Trash2 className="h-8 w-8" /></Button>
                <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-white/10 hover:text-primary transition-all ml-2"><Maximize className="h-7 w-7" /></Button>
             </div>
          </div>

          {/* Sequential Multi-Track Timeline Matrix */}
          <div className="h-96 bg-[#0a061c] border-t border-white/5 p-10 flex flex-col gap-10 z-20 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.7)]">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 px-6">
                <div className="flex items-center gap-12">
                   <div className="flex items-center gap-4 text-primary"><Layers className="h-5 w-5" /> Timeline Matrix</div>
                   <div className="flex items-center gap-4 hover:text-primary transition-colors cursor-pointer"><Music className="h-5 w-5" /> Audio OSC</div>
                   <div className="flex items-center gap-4 hover:text-primary transition-colors cursor-pointer"><Type className="h-5 w-5" /> Title Layers</div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="px-5 py-2 bg-emerald-500/5 rounded-full flex items-center gap-3 border border-emerald-500/10 text-emerald-500"><Save className="h-4 w-4" /> Cloud Synced</div>
                   <div className="h-6 w-px bg-white/10" />
                   <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-10 rounded-[1rem] font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-6">Zoom In</Button>
                      <Button variant="ghost" size="sm" className="h-10 rounded-[1rem] font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-6">Zoom Out</Button>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-4">
                {/* Video Protocol Track */}
                <div className="relative group">
                   <div className="h-24 w-full bg-white/[0.01] border border-white/5 rounded-[2rem] flex items-center px-8 gap-8 relative shadow-inner overflow-hidden group/track">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_25px_rgba(0,112,243,1)] z-10" />
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground absolute left-4 top-2 opacity-20">Track_01: VIDEO</div>
                      <div 
                        className="h-16 bg-primary/10 border-2 border-primary/30 rounded-[1.5rem] flex items-center px-6 gap-6 overflow-hidden relative group/clip cursor-move hover:bg-primary/20 transition-all shadow-2xl"
                        style={{ width: '80%', marginLeft: '4%' }}
                      >
                         {[1,2,3,4,5,6,7,8].map(i => (
                           <div key={i} className="shrink-0 w-24 h-12 bg-black/40 rounded-[0.8rem] border border-white/5 group-hover/clip:border-primary/50 transition-all relative overflow-hidden">
                              <img src={`https://picsum.photos/seed/thumb${i}/100/50`} className="object-cover w-full h-full opacity-40" data-ai-hint="video thumb" />
                           </div>
                         ))}
                         <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white shadow-[0_0_20px_white] z-20 animate-pulse" />
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-12 w-12 rounded-[1.2rem] bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"><Plus size={24} /></Button>
                   </div>
                </div>

                {/* Overlays / Titles Track */}
                <div className="relative group">
                   <div className="h-16 w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] flex items-center px-8 gap-8 relative shadow-inner overflow-hidden">
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground absolute left-4 top-1.5 opacity-20">Track_02: TITLES</div>
                      <div 
                        className="h-10 bg-amber-500/10 border-2 border-amber-500/20 rounded-[1rem] flex items-center px-6 gap-4 overflow-hidden relative group/title cursor-move"
                        style={{ width: '30%', marginLeft: '15%' }}
                      >
                         <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 truncate">NEURAL_TITLE_01.txt</span>
                      </div>
                   </div>
                </div>

                {/* Neural Audio Protocol Track */}
                <div className="relative group">
                   <div className="h-20 w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] flex items-center px-8 gap-8 relative shadow-inner overflow-hidden">
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground absolute left-4 top-1.5 opacity-20">Track_03: AUDIO</div>
                      <div 
                        className="h-12 bg-purple-500/10 border-2 border-purple-500/30 rounded-[1.2rem] flex items-center px-6 gap-2 overflow-hidden relative group/audio cursor-move shadow-xl"
                        style={{ width: '65%', marginLeft: '10%' }}
                      >
                         <div className="flex-1 flex items-center gap-1 opacity-40 group-hover/audio:opacity-100 transition-all duration-700">
                           {[...Array(80)].map((_, i) => (
                             <div key={i} className="w-[1.5px] bg-purple-500 rounded-full" style={{ height: `${Math.sin(i * 0.5) * 60 + 40}%` }} />
                           ))}
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-10 w-10 rounded-[1rem] bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-all"><Plus size={20} /></Button>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Global Neural Encoding Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#020202]/95 backdrop-blur-[40px] z-[500] flex flex-col items-center justify-center gap-12 animate-in fade-in duration-1000">
           <div className="relative">
              <div className="h-48 w-48 rounded-full border-4 border-primary/10 animate-ping absolute inset-0" />
              <div className="h-48 w-48 rounded-full border-4 border-t-primary animate-spin relative z-10 duration-[2s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <VideoIcon className="h-16 w-16 text-primary animate-pulse" />
              </div>
              <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full animate-pulse -z-10" />
           </div>
           <div className="text-center space-y-6">
              <h2 className="text-6xl font-black uppercase tracking-[0.4em] text-white">Neural Mastering</h2>
              <div className="flex items-center justify-center gap-6">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-primary font-black uppercase tracking-[0.8em] text-[12px] animate-pulse">Encoding 4K Master Flow • Bitrate Optimization</p>
              </div>
           </div>
           <div className="w-[500px] h-2.5 bg-white/5 rounded-full overflow-hidden mt-8 border border-white/10 p-0.5">
              <div className="h-full bg-primary animate-progress rounded-full" />
           </div>
           <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[1em] opacity-40 mt-10">BROADCAST READY IN 4 SECONDS</p>
        </div>
      )}
    </div>
  );
}
