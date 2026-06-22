"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Palette, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Layout, Crown, Lock, Layers, Zap, Clock, Maximize, MousePointer2, Move, Sliders
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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  duration?: number;
  startTime?: number;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("Untitled Masterpiece");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [editorMode, setEditorMode] = useState<'normal' | 'advanced'>('normal');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projectRef = useMemoFirebase(() => {
    if (!user || !db || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user?.uid, db, projectId]);

  const { data: project } = useDoc(projectRef);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (project && mounted) {
      setTitle(project.title || "Untitled Masterpiece");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setIsNewProject(false);
    }
  }, [project, mounted]);

  useEffect(() => {
    if (!projectId && !projectIdFromUrl && mounted) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl, mounted]);

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef || !mounted) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      mediaAssets,
      videoDataUri: videoData,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: data,
        }));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'create',
          requestResourceData: { ...data, status: 'draft' },
        }));
      });
      setIsNewProject(false);
    }
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substring(7),
      url: url,
      type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
      name: file.name,
      duration: 5, // Mock duration
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Import Successful" });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Engineered" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
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
      toast({ title: "Clip Rendered" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Render Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/30">
      <Navbar />
      
      {/* 🚀 ELITE TOOLBAR */}
      <div className="h-16 border-b bg-[#0a0d14]/95 backdrop-blur-2xl px-6 flex items-center justify-between z-40 border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2.5 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-base focus:outline-none w-64 truncate text-white border-b border-transparent focus:border-primary/50 transition-all"
            />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 {isSaving ? "Syncing..." : "Cloud Pipeline Verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5">
           <button 
             onClick={() => setEditorMode('normal')}
             className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", editorMode === 'normal' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white")}
           >
             Normal
           </button>
           <button 
             onClick={() => setEditorMode('advanced')}
             className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", editorMode === 'advanced' ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-white")}
           >
             {editorMode !== 'advanced' && <Crown className="w-3 h-3" />}
             Advanced
           </button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-muted-foreground hover:text-white" onClick={() => handleSave()}>
            Save Draft
          </Button>
          <Button className="h-10 px-8 rounded-xl font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs">
            {profile?.isPremium ? <Download className="w-4 h-4 mr-2" /> : <Lock className="w-3 h-3 mr-2" />}
            {profile?.isPremium ? "Master HD" : "Unlock 4K"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠️ VERTICAL VN-STYLE SIDEBAR */}
        <div className="w-24 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-10 gap-12">
           {[
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Wand2, id: 'ai', label: 'AI Suite' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Type, id: 'text', label: 'Text' },
             { icon: Palette, id: 'style', label: 'Effects' },
             { icon: Sliders, id: 'filters', label: 'Filters' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-2.5 transition-all group", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-3.5 rounded-[1.2rem] border-2 transition-all group-hover:scale-110", activeTab === item.id ? "bg-primary/20 border-primary/40 shadow-glow shadow-primary/20" : "bg-transparent border-transparent")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* 📚 ASSET DRAWER */}
        <div className="w-96 bg-[#0a0d14]/60 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 space-y-8 overflow-y-auto scrollbar-hide">
           {activeTab === 'media' && (
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Project Library</h3>
                   <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-black opacity-40">{mediaAssets.length} Clips</Badge>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-40 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] flex flex-col gap-4 group hover:bg-primary/5 hover:border-primary/40 transition-all" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-4 bg-primary/20 rounded-2xl text-primary group-hover:scale-110 transition-transform"><Upload className="w-7 h-7" /></div>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Import Content</span>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-[1.5rem] bg-black border-2 border-white/5 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" /> : asset.type === 'audio' ? <div className="w-full h-full flex items-center justify-center bg-indigo-500/10"><Music className="w-6 h-6 text-indigo-400" /></div> : <img src={asset.url} className="w-full h-full object-cover opacity-50" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                           <Plus className="w-6 h-6 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'ai' && (
             <div className="space-y-10">
                <div className="space-y-6">
                   <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit">
                      <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Neural Engineering Suite</span>
                   </div>
                   
                   <div className="p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5 space-y-6 hover:bg-white/[0.05] transition-all">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Viral Script Engine</label>
                        <span className="text-[8px] text-muted-foreground font-bold italic">Generate hooks that grab attention in 1.5s</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs h-32 outline-none focus:border-primary/50 transition-all placeholder:opacity-30" 
                        placeholder="What is your video about? (e.g. How to make money with AI)" 
                        value={scriptTopic} 
                        onChange={(e) => setScriptTopic(e.target.value)} 
                      />
                      <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10" onClick={handleGenerateScript} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Engineer Script
                      </Button>
                   </div>

                   <div className="p-6 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 space-y-6 hover:bg-indigo-500/10 transition-all relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700"><Film className="w-40 h-40" /></div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Motion Renderer</label>
                        <span className="text-[8px] text-muted-foreground font-bold italic">Text-to-Video conversion via Veo 2.0 Engine</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs h-32 outline-none focus:border-indigo-500/50 transition-all placeholder:opacity-30" 
                        placeholder="Describe the visuals... (e.g. Cinematic drone shot of Tokyo at night)" 
                        value={videoPrompt} 
                        onChange={(e) => setVideoPrompt(e.target.value)} 
                      />
                      <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-indigo-600 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
                         Render AI Clip
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* 🎬 MAIN VIEWPORT & MONITOR */}
        <div className="flex-1 flex flex-col bg-[#0c0f17] p-8 space-y-8">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[4rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl blue-glow group">
              {/* Overlay controls when hovering monitor */}
              <div className="absolute top-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Badge className="bg-black/60 backdrop-blur-xl border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {videoData ? "4K PREVIEW ACTIVE" : "ENGINE READY"}
                 </Badge>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-6 opacity-20">
                     <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-white/5">
                        <VideoIcon className="w-10 h-10" />
                     </div>
                     <p className="text-[12px] font-black uppercase tracking-[0.4em]">Neural Studio Waiting</p>
                  </div>
                ) : (
                  <video 
                    ref={videoRef} 
                    src={videoData} 
                    className="w-full h-full object-contain" 
                    onPlay={() => setIsPlaying(true)} 
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  />
                )}
              </div>

              {/* Playback HUD */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                 <div className="bg-black/80 backdrop-blur-2xl px-10 py-4 rounded-full border border-white/10 flex items-center gap-10 shadow-2xl">
                    <button className="text-muted-foreground hover:text-white transition-colors"><SkipBack className="w-6 h-6" /></button>
                    <button 
                      onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                      className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/30"
                    >
                      {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                    </button>
                    <button className="text-muted-foreground hover:text-white transition-colors"><SkipForward className="w-6 h-6" /></button>
                 </div>
              </div>
           </div>

           {/* 🎞️ ADVANCED VN-STYLE TIMELINE */}
           <div className="h-64 bg-[#0a0d14] rounded-[3.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="h-12 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-primary">
                       <Layers className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Timeline Engine v2</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-mono">{currentTime.toFixed(2)}s / 00:30</span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all"><Scissors className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-rose-500/60 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>

              {/* Scrollable Tracks Area */}
              <div className="flex-1 overflow-x-auto p-4 space-y-3 scrollbar-hide">
                 {/* Track 1: Text/Subtitles */}
                 <div className="h-8 bg-white/[0.02] border border-dashed border-white/5 rounded-xl flex items-center px-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest absolute left-[-60px] md:static">Subtitles</span>
                    {videoData && <div className="h-4 w-64 bg-indigo-500/20 border border-indigo-500/30 rounded-full ml-4" />}
                 </div>

                 {/* Track 2: Primary Video/Visuals */}
                 <div className="h-16 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center px-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest absolute left-[-60px] md:static">Visuals</span>
                    <div className="flex gap-2 ml-4">
                       {videoData && (
                         <div className="h-12 w-48 bg-primary/20 border-2 border-primary/40 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-0 shimmer opacity-20" />
                            <div className="absolute inset-y-0 right-0 w-1 bg-white/20 cursor-ew-resize hover:bg-primary transition-all" />
                         </div>
                       )}
                       {mediaAssets.map((m, i) => m.type !== 'audio' && (
                         <div key={i} className="h-12 w-20 bg-white/5 border border-white/10 rounded-xl" />
                       ))}
                    </div>
                 </div>

                 {/* Track 3: Audio/SFX */}
                 <div className="h-10 bg-white/[0.02] border border-dashed border-white/5 rounded-xl flex items-center px-4 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest absolute left-[-60px] md:static">Audio</span>
                    {mediaAssets.map((m, i) => m.type === 'audio' && (
                       <div key={i} className="h-6 w-32 bg-emerald-500/20 border border-emerald-500/30 rounded-lg ml-4 flex items-center justify-center">
                          <div className="flex gap-0.5 items-end h-3">
                             {[1,2,3,4,3,2,1,2,3].map((h, j) => <div key={j} className="w-0.5 bg-emerald-400" style={{ height: `${h * 20}%` }} />)}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Playhead Indicator */}
              <div 
                className="absolute top-12 bottom-0 w-0.5 bg-primary z-10 shadow-glow shadow-primary/50 pointer-events-none" 
                style={{ left: `${(currentTime / 30) * 100}%` }}
              />
           </div>
        </div>

        {/* 🎚️ INSPECTOR SIDEBAR */}
        <div className="w-96 bg-[#0a0d14] border-l border-white/5 p-8 space-y-10 overflow-y-auto scrollbar-hide">
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <Settings2 className="w-5 h-5" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Master Inspector</h4>
                 </div>
                 {editorMode === 'advanced' && <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-400/20 text-[8px] font-black">PRO ACTIVE</Badge>}
              </div>

              <Tabs defaultValue="adjust" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-2xl mb-8">
                    <TabsTrigger value="adjust" className="rounded-xl text-[10px] font-black uppercase tracking-widest">Adjust</TabsTrigger>
                    <TabsTrigger value="transform" className="rounded-xl text-[10px] font-black uppercase tracking-widest">Layout</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="adjust" className="space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                             <span className="flex items-center gap-2"><Maximize className="w-3 h-3" /> AI Upscale</span>
                             <span className="text-primary">100%</span>
                          </div>
                          <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                             <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Motion Speed</span>
                             <span className="text-indigo-400">1.0x</span>
                          </div>
                          <Slider defaultValue={[50]} max={100} step={1} className="[&_[role=slider]]:bg-indigo-600" />
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                             <span className="flex items-center gap-2"><Sliders className="w-3 h-3" /> Neural Gain</span>
                             <span className="text-emerald-500">80%</span>
                          </div>
                          <Slider defaultValue={[80]} max={100} step={1} className="[&_[role=slider]]:bg-emerald-500" />
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                       <div className="flex items-center gap-2 text-indigo-400">
                          <Layout className="w-4 h-4" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest">Smart Canvas</h4>
                       </div>
                       <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: '9:16', label: 'Reels', active: true },
                            { id: '16:9', label: 'Cinema', active: false },
                            { id: '1:1', label: 'Social', active: false }
                          ].map((ratio) => (
                            <button 
                              key={ratio.id} 
                              className={cn("h-16 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all", ratio.active ? "border-primary bg-primary/10 text-white shadow-glow shadow-primary/10" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/20")}
                            >
                               <span className="text-[10px] font-black">{ratio.id}</span>
                               <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{ratio.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="transform" className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 text-center space-y-2 hover:bg-white/[0.08] transition-all cursor-pointer">
                          <Move className="w-6 h-6 text-primary mx-auto" />
                          <p className="text-[8px] font-black uppercase tracking-widest">Center Frame</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 text-center space-y-2 hover:bg-white/[0.08] transition-all cursor-pointer">
                          <Maximize className="w-6 h-6 text-primary mx-auto" />
                          <p className="text-[8px] font-black uppercase tracking-widest">Fit to Screen</p>
                       </div>
                    </div>
                 </TabsContent>
              </Tabs>
           </div>

           {/* 🚀 ACTION HUB */}
           <div className="pt-10 border-t border-white/5">
              <Button className="w-full h-20 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 font-black text-sm gap-4 shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] transition-all">
                 <Maximize className="w-5 h-5" /> MASTER EXPORT 4K
              </Button>
              <p className="text-center mt-6 text-[8px] font-black text-muted-foreground uppercase tracking-[0.6em] opacity-30">Production Node v2.5 Stable</p>
           </div>
        </div>
      </div>

      {/* 🔮 AI LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#05070a]/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-500">
           <div className="text-center space-y-12">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full neural-pulse" />
                 <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto border-4 border-primary relative z-10 shadow-2xl">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                 </div>
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase leading-none">NEURAL SYNC IN PROGRESS</h2>
                 <p className="text-xl text-muted-foreground italic font-medium">Encoding your creative logic via Elite AI Core...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#05070a]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
