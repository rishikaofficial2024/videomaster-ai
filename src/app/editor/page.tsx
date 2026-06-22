"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Palette, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Layout, Crown, Lock, Layers, Zap, Clock, Maximize, Move, Sliders
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
  
  const [title, setTitle] = useState("Untitled Project");
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
      setTitle(project.title || "Untitled Project");
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
    setTimeout(() => setIsSaving(false), 1000);
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
      duration: 5,
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Import Successful", description: `${file.name} added to library.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Engineered", description: "Viral hook detected and ready." });
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
      toast({ title: "Sequence Rendered", description: "Visual data synced to timeline." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Render Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/40">
      <Navbar />
      
      {/* 🚀 ELITE TOOLBAR */}
      <div className="h-20 border-b bg-[#05070a]/90 backdrop-blur-3xl px-8 flex items-center justify-between z-40 border-white/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none w-72 truncate text-white border-b border-transparent focus:border-primary/40 transition-all"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                 {isSaving ? "Synchronizing..." : "Node Verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5">
           <button 
             onClick={() => setEditorMode('normal')}
             className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", editorMode === 'normal' ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white")}
           >
             Standard
           </button>
           <button 
             onClick={() => setEditorMode('advanced')}
             className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", editorMode === 'advanced' ? "bg-indigo-600 text-white shadow-xl" : "text-muted-foreground hover:text-white")}
           >
             {editorMode !== 'advanced' && <Crown className="w-3 h-3" />}
             Advanced
           </button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white" onClick={() => handleSave()}>
            Store Draft
          </Button>
          <Button className="h-12 px-10 rounded-2xl font-black uppercase tracking-[0.2em] bg-primary shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-[11px]">
            {profile?.isPremium ? <Download className="w-4 h-4 mr-2.5" /> : <Lock className="w-4 h-4 mr-2.5" />}
            {profile?.isPremium ? "MASTER EXPORT" : "UNLOCK 4K"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠️ VN SIDEBAR */}
        <div className="w-28 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-12 gap-14">
           {[
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Wand2, id: 'ai', label: 'AI Suite' },
             { icon: Music, id: 'audio', label: 'Tracks' },
             { icon: Type, id: 'text', label: 'Subtitles' },
             { icon: Palette, id: 'style', label: 'Visuals' },
             { icon: Sliders, id: 'filters', label: 'Inspect' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-3 transition-all group", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-[1.4rem] border-2 transition-all group-hover:scale-110", activeTab === item.id ? "bg-primary/15 border-primary/40 shadow-glow shadow-primary/20" : "bg-transparent border-transparent")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-[0.3em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* 📚 DRAWER */}
        <div className="w-[420px] bg-[#05070a]/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-10 space-y-10 overflow-y-auto scrollbar-hide">
           {activeTab === 'media' && (
             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Project Assets</h3>
                   <Badge variant="outline" className="text-[8px] px-3 py-0.5 rounded-full uppercase tracking-widest font-black opacity-30">{mediaAssets.length} Units</Badge>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-48 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] flex flex-col gap-5 group hover:bg-primary/5 hover:border-primary/30 transition-all duration-500" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-5 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform shadow-xl"><Upload className="w-8 h-8" /></div>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Import Neural Data</span>
                </Button>
                <div className="grid grid-cols-2 gap-5">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-[2rem] bg-black border-2 border-white/5 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity" /> : asset.type === 'audio' ? <div className="w-full h-full flex items-center justify-center bg-indigo-500/10"><Music className="w-8 h-8 text-indigo-400" /></div> : <img src={asset.url} className="w-full h-full object-cover opacity-40" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/50">
                           <Plus className="w-7 h-7 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'ai' && (
             <div className="space-y-12">
                <div className="space-y-8">
                   <div className="flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit">
                      <Zap className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Engineering Core</span>
                   </div>
                   
                   <div className="p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 space-y-8 hover:bg-white/[0.04] transition-all duration-700">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Viral Logic Engine</label>
                        <span className="text-[9px] text-muted-foreground font-bold italic opacity-60">Generate retention-optimized scripts.</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-xs h-40 outline-none focus:border-primary/30 transition-all placeholder:opacity-20 leading-relaxed" 
                        placeholder="What is the narrative goal? (e.g. 5 steps to financial freedom)" 
                        value={scriptTopic} 
                        onChange={(e) => setScriptTopic(e.target.value)} 
                      />
                      <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-primary/15 text-primary hover:bg-primary hover:text-white transition-all shadow-2xl shadow-primary/10" onClick={handleGenerateScript} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Wand2 className="w-5 h-5 mr-3" />}
                        GENERATE LOGIC
                      </Button>
                   </div>

                   <div className="p-8 bg-indigo-500/[0.03] rounded-[3rem] border border-indigo-500/10 space-y-8 hover:bg-indigo-500/[0.06] transition-all duration-700 relative overflow-hidden group">
                      <div className="absolute -top-12 -right-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Film className="w-56 h-56" /></div>
                      <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Motion Renderer</label>
                        <span className="text-[9px] text-muted-foreground font-bold italic opacity-60">Convert text to high-fidelity motion.</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-xs h-40 outline-none focus:border-indigo-500/30 transition-all placeholder:opacity-20 leading-relaxed relative z-10" 
                        placeholder="Describe the visual sequence... (e.g. Cyberpunk city in rain, 4k cinematic)" 
                        value={videoPrompt} 
                        onChange={(e) => setVideoPrompt(e.target.value)} 
                      />
                      <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-indigo-600 shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all relative z-10" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Maximize className="w-5 h-5 mr-3" />}
                         RENDER SEQUENCE
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* 🎬 MONITOR */}
        <div className="flex-1 flex flex-col bg-[#020408] p-10 lg:p-14 space-y-10">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[4.5rem] border-[14px] border-[#05070a] overflow-hidden shadow-2xl blue-glow group transition-all duration-700">
              <div className="absolute top-10 left-10 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                 <Badge className="bg-black/60 backdrop-blur-3xl border-white/10 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {videoData ? "4K NEURAL STREAM ACTIVE" : "MONITOR READY"}
                 </Badge>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-8 opacity-[0.08]">
                     <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-white/5">
                        <VideoIcon className="w-12 h-12" />
                     </div>
                     <p className="text-[14px] font-black uppercase tracking-[0.5em]">Waiting for Data Stream</p>
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

              <div className="absolute inset-x-0 bottom-14 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                 <div className="bg-black/80 backdrop-blur-3xl px-12 py-5 rounded-full border border-white/10 flex items-center gap-12 shadow-2xl">
                    <button className="text-muted-foreground hover:text-white transition-colors"><SkipBack className="w-7 h-7" /></button>
                    <button 
                      onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                      className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                    >
                      {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>
                    <button className="text-muted-foreground hover:text-white transition-colors"><SkipForward className="w-7 h-7" /></button>
                 </div>
              </div>
           </div>

           {/* 🎞️ TIMELINE */}
           <div className="h-72 bg-[#05070a]/80 rounded-[4rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative transition-all duration-700">
              <div className="h-14 border-b border-white/5 px-10 flex items-center justify-between bg-white/[0.01]">
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-primary">
                       <Layers className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Timeline Node v2</span>
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <div className="flex items-center gap-3 text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       <span className="text-[11px] font-mono tracking-tighter">{currentTime.toFixed(2)}s / 30.00s</span>
                    </div>
                 </div>
                 <div className="flex gap-5">
                    <button className="p-2.5 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all"><Scissors className="w-5 h-5" /></button>
                    <button className="p-2.5 hover:bg-white/5 rounded-xl text-rose-500/60 hover:text-rose-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto p-6 space-y-4 scrollbar-hide">
                 <div className="h-10 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl flex items-center px-6 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest absolute left-[-80px] lg:static">Text Node</span>
                    {videoData && <div className="h-5 w-72 bg-indigo-500/10 border border-indigo-500/20 rounded-full ml-6 shadow-[0_0_10px_rgba(99,102,241,0.2)]" />}
                 </div>

                 <div className="h-20 bg-white/[0.04] border border-white/5 rounded-[2rem] flex items-center px-6 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-[2rem]" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest absolute left-[-80px] lg:static">Primary Visual</span>
                    <div className="flex gap-3 ml-6">
                       {videoData && (
                         <div className="h-16 w-56 bg-primary/15 border-2 border-primary/30 rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 shimmer opacity-20" />
                            <div className="absolute inset-y-0 right-0 w-1.5 bg-white/10 cursor-ew-resize hover:bg-primary transition-all" />
                         </div>
                       )}
                       {mediaAssets.map((m, i) => m.type !== 'audio' && (
                         <div key={i} className="h-16 w-24 bg-white/5 border border-white/5 rounded-2xl" />
                       ))}
                    </div>
                 </div>

                 <div className="h-12 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl flex items-center px-6 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest absolute left-[-80px] lg:static">Audio Stream</span>
                    {mediaAssets.map((m, i) => m.type === 'audio' && (
                       <div key={i} className="h-7 w-40 bg-emerald-500/10 border border-emerald-500/20 rounded-xl ml-6 flex items-center justify-center">
                          <div className="flex gap-1 items-end h-4">
                             {[1,2,3,4,3,2,3,4,2].map((h, j) => <div key={j} className="w-1 bg-emerald-400/60 rounded-full" style={{ height: `${h * 25}%` }} />)}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div 
                className="absolute top-14 bottom-0 w-0.5 bg-primary z-10 shadow-glow shadow-primary/60 pointer-events-none transition-all duration-100 ease-linear" 
                style={{ left: `${(currentTime / 30) * 100}%` }}
              />
           </div>
        </div>

        {/* 🎚️ INSPECTOR */}
        <div className="w-[420px] bg-[#05070a] border-l border-white/5 p-10 space-y-12 overflow-y-auto scrollbar-hide">
           <div className="space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4 text-emerald-400">
                    <Settings2 className="w-6 h-6" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Master Controller</h4>
                 </div>
                 {editorMode === 'advanced' && <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-400/20 text-[9px] font-black px-4 py-1 rounded-full uppercase">Pro Active</Badge>}
              </div>

              <Tabs defaultValue="adjust" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-2xl mb-12">
                    <TabsTrigger value="adjust" className="rounded-xl text-[10px] font-black uppercase tracking-widest">Adjust</TabsTrigger>
                    <TabsTrigger value="transform" className="rounded-xl text-[10px] font-black uppercase tracking-widest">Layout</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="adjust" className="space-y-10 animate-in fade-in duration-700">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
                             <span className="flex items-center gap-3"><Maximize className="w-4 h-4" /> AI Detail Upscale</span>
                             <span className="text-primary">100%</span>
                          </div>
                          <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
                             <span className="flex items-center gap-3"><Clock className="w-4 h-4" /> Temporal Flow</span>
                             <span className="text-indigo-400">1.0x</span>
                          </div>
                          <Slider defaultValue={[50]} max={100} step={1} className="[&_[role=slider]]:bg-indigo-600 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
                             <span className="flex items-center gap-3"><Sliders className="w-4 h-4" /> Neural Saturation</span>
                             <span className="text-emerald-500">85%</span>
                          </div>
                          <Slider defaultValue={[85]} max={100} step={1} className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-8">
                       <div className="flex items-center gap-3 text-indigo-400">
                          <Layout className="w-5 h-5" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Aspect Matrix</h4>
                       </div>
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: '9:16', label: 'Vertical', active: true },
                            { id: '16:9', label: 'Cinema', active: false },
                            { id: '1:1', label: 'Square', active: false }
                          ].map((ratio) => (
                            <button 
                              key={ratio.id} 
                              className={cn("h-20 flex flex-col items-center justify-center gap-2 rounded-[1.5rem] border-2 transition-all duration-500", ratio.active ? "border-primary bg-primary/10 text-white shadow-glow shadow-primary/10" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/20")}
                            >
                               <span className="text-[11px] font-black tracking-tight">{ratio.id}</span>
                               <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{ratio.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="transform" className="space-y-10 animate-in fade-in duration-700">
                    <div className="grid grid-cols-2 gap-5">
                       <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 text-center space-y-4 hover:bg-white/[0.08] transition-all duration-500 cursor-pointer group">
                          <Move className="w-8 h-8 text-primary mx-auto group-hover:scale-110 transition-transform" />
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Center Frame</p>
                       </div>
                       <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 text-center space-y-4 hover:bg-white/[0.08] transition-all duration-500 cursor-pointer group">
                          <Maximize className="w-8 h-8 text-primary mx-auto group-hover:scale-110 transition-transform" />
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Smart Fit</p>
                       </div>
                    </div>
                 </TabsContent>
              </Tabs>
           </div>

           {/* 🚀 ACTION HUB */}
           <div className="pt-12 border-t border-white/5 space-y-6">
              <Button className="w-full h-24 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 font-black text-base uppercase tracking-[0.3em] gap-5 shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all">
                 <Maximize className="w-6 h-6" /> MASTER EXPORT
              </Button>
              <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-20">Build v2.5.0-Stable Node</p>
           </div>
        </div>
      </div>

      {/* 🔮 AI LOADING */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#020408]/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center space-y-16">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/30 blur-[150px] rounded-full neural-pulse" />
                 <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20 relative z-10 shadow-2xl">
                    <Loader2 className="w-14 h-14 animate-spin text-primary" />
                 </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-5xl font-headline font-bold text-white tracking-tighter uppercase leading-none text-gradient">Neural Sync Active</h2>
                 <p className="text-2xl text-muted-foreground italic font-medium opacity-60">Calculating creative logic pathways...</p>
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
