"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play,
  Wand2, Download, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Music, 
  Upload, Film,
  Settings2, Type, Crown, Zap, Volume2,
  Monitor, RefreshCw, Cpu, Smartphone, Scissors, Timer, 
  Layers, Smile, Undo2, Redo2, Maximize, Crop, RotateCcw, 
  Check, Save, Trash2, Gauge, Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  speed?: number;
  filter?: string;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("Gemini Fast Studio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(toolFromUrl || 'ai');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  
  const [magicHook, setMagicHook] = useState("");
  const [subtitles, setSubtitles] = useState("");
  
  // Advanced Features State
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeFilter, setActiveFilter] = useState("none");
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
      setIsNewProject(false);
    } else {
      // ✅ HYDRATION FIX: Generate ID only on client
      const newId = "prj-" + Math.random().toString(36).substring(7);
      setProjectId(newId);
    }
  }, [projectIdFromUrl]);

  const projectRef = useMemoFirebase(() => {
    if (!user || !db || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user?.uid, db, projectId]);

  const { data: project } = useDoc(projectRef);

  useEffect(() => {
    if (project && mounted) {
      setTitle(project.title || "Gemini Fast Studio");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setMagicHook(project.magicHook || "");
      setSubtitles(project.subtitles || "");
    }
  }, [project, mounted]);

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef || !mounted) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      mediaAssets,
      videoDataUri: videoData,
      magicHook,
      subtitles,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      }).then(() => setIsNewProject(false));
    }
    
    // Add to history for Undo/Redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image';
    
    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substring(7),
      url: url,
      type: type,
      name: file.name,
      duration: 5,
      speed: 1,
      filter: 'none'
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setMediaAssets(prev.mediaAssets);
      setVideoData(prev.videoDataUri);
      setHistoryIndex(historyIndex - 1);
      toast({ title: "Undo successful" });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setMediaAssets(next.mediaAssets);
      setVideoData(next.videoDataUri);
      setHistoryIndex(historyIndex + 1);
      toast({ title: "Redo successful" });
    }
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script, magicHook: result.hook });
      setMagicHook(result.hook);
      toast({ title: "Script Engineered" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: "Neural sync interrupted." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsProcessing(true);
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Video Synthesized" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: "Motion core busy." });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8]">
      <Navbar />
      
      {/* 🚀 TOP BAR: Elite Controls */}
      <div className="h-20 border-b bg-[#05070a]/90 backdrop-blur-3xl px-6 flex items-center justify-between z-40 border-white/5 mt-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none w-[200px] md:w-[300px] truncate text-white"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                {isSaving ? "Auto-Saving..." : "Project Synced"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} className="h-9 w-9 rounded-lg">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="h-9 w-9 rounded-lg">
                <Redo2 className="w-4 h-4" />
              </Button>
           </div>
           
           <div className="h-10 w-px bg-white/10 mx-2 hidden md:block" />

           <Button className="h-11 px-6 rounded-xl font-black uppercase tracking-[0.1em] bg-primary shadow-glow text-[10px] gap-2 hover:scale-105 transition-all">
            <Download className="w-4 h-4" />
            Export 4K
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠️ LEFT SIDEBAR: Tools */}
        <div className="w-20 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-8 gap-8">
           {[
             { icon: Wand2, id: 'ai', label: 'AI' },
             { icon: Film, id: 'media', label: 'ASSETS' },
             { icon: Scissors, id: 'edit', label: 'TRIM' },
             { icon: Palette, id: 'filters', label: 'FX' },
             { icon: Music, id: 'audio', label: 'AUDIO' },
             { icon: Type, id: 'text', label: 'TEXT' },
             { icon: Settings2, id: 'settings', label: 'BUILD' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === item.id ? "text-primary" : "text-muted-foreground")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-3 rounded-2xl border-2 transition-all", activeTab === item.id ? "bg-primary/10 border-primary/30 scale-110" : "bg-transparent border-transparent hover:bg-white/5")}>
                 <item.icon className="w-5 h-5" />
               </div>
               <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* 🎛️ PANEL: Active Tool Settings */}
        <div className="w-[380px] bg-[#0a0d14] border-r border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto scrollbar-hide hidden lg:flex">
           {activeTab === 'ai' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-primary">Viral Strategist</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm h-28 outline-none focus:border-primary/40 transition-all" 
                     placeholder="Topic for viral video..." 
                     value={scriptTopic} 
                     onChange={(e) => setScriptTopic(e.target.value)} 
                   />
                   <Button className="w-full h-12 rounded-xl font-black text-[9px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20" onClick={handleGenerateScript} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Wand2 className="w-3 h-3 mr-2" />}
                      Write Script
                   </Button>
                </div>

                <div className="space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Veo Motion Engine</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm h-28 outline-none focus:border-indigo-400/40 transition-all" 
                     placeholder="Describe cinematic clip..." 
                     value={videoPrompt} 
                     onChange={(e) => setVideoPrompt(e.target.value)} 
                   />
                   <Button className="w-full h-12 rounded-xl font-black text-[9px] uppercase tracking-widest bg-indigo-600 shadow-xl hover:bg-indigo-700" onClick={handleGenerateVideo} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <VideoIcon className="w-3 h-3 mr-2" />}
                      Generate Clip
                   </Button>
                </div>
             </div>
           )}

           {activeTab === 'edit' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Playback Speed</p>
                      <span className="text-primary font-bold text-xs">{playbackSpeed}x</span>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {[0.5, 1, 1.5, 2].map(speed => (
                        <Button 
                          key={speed} 
                          variant={playbackSpeed === speed ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setPlaybackSpeed(speed)}
                          className="rounded-lg h-10 text-[10px]"
                        >
                          {speed}x
                        </Button>
                      ))}
                   </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Orientation</p>
                   <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="flex flex-col h-20 gap-2 rounded-xl">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-[8px]">9:16</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col h-20 gap-2 rounded-xl">
                        <Monitor className="w-4 h-4" />
                        <span className="text-[8px]">16:9</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col h-20 gap-2 rounded-xl">
                        <Maximize className="w-4 h-4" />
                        <span className="text-[8px]">1:1</span>
                      </Button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] flex flex-col gap-4 hover:bg-white/[0.05] transition-all group" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-all">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                   </div>
                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Import Content</span>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-xl bg-black border border-white/10 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-60" /> : <img src={asset.url} className="w-full h-full object-cover opacity-60" alt={asset.name} />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-all">
                           <Plus className="w-5 h-5 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* 🎬 PREVIEW: Main Viewport */}
        <div className="flex-1 flex flex-col bg-[#020408] p-4 md:p-8 space-y-6 relative overflow-hidden">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[2.5rem] border-[8px] border-[#0a0d14] overflow-hidden shadow-2xl group flex flex-col items-center justify-center">
              {!videoData ? (
                <div className="text-center space-y-4 opacity-10">
                   <Monitor size={48} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Output Node</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  src={videoData} 
                  className="w-full h-full object-contain" 
                  onPlay={() => setIsPlaying(true)} 
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  style={{ filter: activeFilter === 'none' ? 'none' : activeFilter }}
                />
              )}
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <Button 
                   size="icon" 
                   onClick={togglePlay} 
                   className={cn("w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border-2 border-primary/40 transition-all pointer-events-auto", isPlaying ? "opacity-0 scale-90" : "opacity-100 scale-100 hover:scale-110")}
                 >
                   {isPlaying ? <Pause className="fill-primary" /> : <Play className="fill-primary ml-1" />}
                 </Button>
              </div>
           </div>

           {/* 📽️ TIMELINE: Multi-track simulation */}
           <div className="h-52 bg-[#0a0d14] rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <Film className="w-3.5 h-3.5 text-primary" />
                       <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Project Timeline</h4>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize className="w-3 h-3" /></Button>
                 </div>
              </div>

              <div 
                ref={timelineRef}
                className="flex-1 overflow-x-auto p-6 space-y-3 relative cursor-crosshair scrollbar-hide"
                onClick={handleTimelineClick}
              >
                 {/* Simulate layers */}
                 <div className="h-10 bg-primary/10 border border-primary/20 rounded-xl relative flex items-center px-4">
                    <Film className="w-3 h-3 text-primary mr-3 opacity-40" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Video Layer 1</span>
                    {videoData && (
                      <div className="absolute left-0 h-full bg-primary/30 border-x border-primary w-[80%] rounded-xl" />
                    )}
                 </div>

                 <div className="h-10 bg-rose-500/5 border border-rose-500/10 rounded-xl relative flex items-center px-4 opacity-40">
                    <Type className="w-3 h-3 text-rose-400 mr-3 opacity-40" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">Captions</span>
                 </div>

                 <div className="h-10 bg-indigo-500/5 border border-indigo-500/10 rounded-xl relative flex items-center px-4 opacity-40">
                    <Volume2 className="w-3 h-3 text-indigo-400 mr-3 opacity-40" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Studio Audio</span>
                 </div>
                 
                 {/* Playhead */}
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-glow" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 >
                    <div className="absolute -top-1 -left-[3px] w-2 h-2 bg-white rounded-full" />
                 </div>
              </div>
           </div>
        </div>

        {/* 📊 RIGHT PANEL: Stats & Export */}
        <div className="w-[320px] bg-[#05070a] border-l border-white/5 p-6 space-y-8 hidden xl:flex flex-col">
           <header className="flex items-center gap-3 text-primary">
              <Cpu size={18} />
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em]">Engine Stats</h4>
           </header>

           <div className="space-y-6 flex-1">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Neural Performance</p>
                 <div className="flex items-center justify-between">
                    <span className="text-xl font-bold font-headline">Ultra Tier</span>
                    <Zap className="text-emerald-500 w-4 h-4 animate-pulse" />
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[94%]" />
                 </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Export Node</p>
                 <div className="space-y-2">
                    {[
                      { label: 'SD 720p', speed: 'Fast' },
                      { label: 'HD 1080p', speed: 'Balanced' },
                      { label: 'Elite 4K', speed: 'Render required', active: true }
                    ].map((fmt, i) => (
                      <button key={i} className={cn("w-full p-3.5 rounded-xl border flex items-center justify-between transition-all", fmt.active ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/5 text-muted-foreground")}>
                        <span className="text-[10px] font-bold uppercase">{fmt.label}</span>
                        <span className="text-[8px] italic opacity-60">{fmt.speed}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                 <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                    <RefreshCw size={12} className="animate-spin-slow" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Neural Link Active</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground italic leading-tight">Your changes are being streamed to the cloud factory in real-time.</p>
              </div>
           </div>

           <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white font-bold text-[10px] uppercase tracking-widest" onClick={() => handleSave()}>
              <Save className="w-3 h-3 mr-2" /> Save Workspace
           </Button>
        </div>
      </div>

      {/* 🔮 MODAL: Processing */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-[80px] flex items-center justify-center">
           <div className="text-center space-y-10 max-w-sm px-6">
              <div className="relative mx-auto">
                 <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                 <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter">GEMINI CORE PROCESSING</h2>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest animate-pulse">Syncing with High-Speed Neural Nodes...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#020408]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
