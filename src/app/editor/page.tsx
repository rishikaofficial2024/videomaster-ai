"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Crown, Lock, Layers, Zap, Volume2, Search,
  HardDrive, Monitor, RefreshCcw, Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import audioData from "@/app/lib/placeholder-audio.json";

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
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("My New Sequence");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [editorMode, setEditorMode] = useState<'easy' | 'pro'>('easy');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  
  const [magicHook, setMagicHook] = useState("");
  const [subtitles, setSubtitles] = useState("");

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
      setTitle(project.title || "My New Sequence");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setMagicHook(project.magicHook || "");
      setSubtitles(project.subtitles || "");
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
      magicHook,
      subtitles,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(async () => {
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
      }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'create',
          requestResourceData: { ...data, status: 'draft' },
        } satisfies SecurityRuleContext));
      });
      setIsNewProject(false);
    }
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
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Media Protocol Executed", description: `${file.name} synced to timeline.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script, magicHook: result.hook });
      setMagicHook(result.hook);
      toast({ title: "Narrative Ready", description: "Elite AI has drafted your viral script." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Neural Link Busy", description: "AI cores are at capacity. Retry in 10s." });
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
      toast({ title: "Visual Rendered", description: "Cinematic sequence added to visuals track." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Render Failed", description: "Could not stabilize motion engine." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoCaption = async () => {
    if (!videoData) {
      toast({ variant: "destructive", title: "No Audio Source", description: "Render visuals first to generate captions." });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await generateAutoCaptionsAndSubtitles({ audioDataUri: "data:audio/wav;base64,UklGR" });
      setSubtitles(result.subtitles);
      handleSave({ subtitles: result.subtitles });
      toast({ title: "Neural Transcription", description: "Subtitles generated via neural sync." });
    } catch (e) {
      toast({ variant: "destructive", title: "Sync Error", description: "Failed to transcribe audio tracks." });
    } finally {
      setIsProcessing(false);
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

  const addAudioTrack = (track: any) => {
    const newAsset: MediaAsset = {
      id: track.id,
      url: track.url,
      type: 'audio',
      name: track.title,
      duration: 10
    };
    const updated = [...mediaAssets, newAsset];
    setMediaAssets(updated);
    handleSave({ mediaAssets: updated });
    toast({ title: "Audio Sync", description: `${track.title} added to secondary track.` });
  };

  // Helper to determine if current videoData is an image or video
  const isImageData = videoData && (videoData.startsWith('data:image') || videoData.includes('picsum.photos') || videoData.includes('unsplash.com'));

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/40">
      <Navbar />
      
      <div className="h-24 border-b bg-[#05070a]/90 backdrop-blur-[80px] px-8 flex items-center justify-between z-40 border-white/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all group">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
               <HardDrive size={18} className="text-primary opacity-40" />
               <input 
                 value={title} 
                 onChange={(e) => setTitle(e.target.value)}
                 className="bg-transparent font-bold text-xl focus:outline-none w-[300px] truncate text-white border-b border-transparent focus:border-primary/40 transition-all"
                 placeholder="Enter Sequence Name"
               />
            </div>
            <div className="flex items-center gap-2 mt-1 ml-7">
              <div className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                {isSaving ? "Neural Sync Active..." : "Local Node Stabilized"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
           <button 
             onClick={() => setEditorMode('easy')}
             className={cn("px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all", editorMode === 'easy' ? "bg-primary text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)]" : "text-muted-foreground hover:text-white")}
           >
             Easy Hub
           </button>
           <button 
             onClick={() => setEditorMode('pro')}
             className={cn("px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2", editorMode === 'pro' ? "bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)]" : "text-muted-foreground hover:text-white")}
           >
             <Crown className="w-4 h-4" /> Pro Studio
           </button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] h-12 px-6 hover:bg-white/5" onClick={() => handleSave()}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Force Sync
          </Button>
          <Button className="h-14 px-10 rounded-xl font-black uppercase tracking-[0.2em] bg-primary shadow-[0_15px_40px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all text-[11px] gap-3">
            {profile?.isPremium ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            Export Studio Build
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-10 gap-10">
           {[
             { icon: Wand2, id: 'ai', label: 'AI CORE' },
             { icon: Film, id: 'media', label: 'ASSETS' },
             { icon: Music, id: 'audio', label: 'AUDIO' },
             { icon: Type, id: 'text', label: 'TEXT' },
             { icon: Settings2, id: 'settings', label: 'SYSTEM' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-3 transition-all group", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-3xl border-2 transition-all group-hover:scale-110", activeTab === item.id ? "bg-primary/10 border-primary/30 shadow-glow" : "bg-transparent border-transparent")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-[0.3em]">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="w-[420px] bg-[#0a0d14] border-r border-white/5 flex flex-col p-8 space-y-10 overflow-y-auto scrollbar-hide relative">
           <div className="absolute inset-0 shimmer opacity-[0.01] pointer-events-none" />
           
           {activeTab === 'ai' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500 relative z-10">
                <header className="flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Neural Processing</h3>
                   <Badge variant="outline" className="border-primary/40 text-primary uppercase text-[8px] font-bold tracking-widest px-3">Elite Mode</Badge>
                </header>

                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">01</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Draft Narrative Logic</p>
                   </div>
                   <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 space-y-4 hover:border-primary/20 transition-all group">
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-primary/40 resize-none font-medium leading-relaxed" 
                        placeholder="Define video objectives (e.g. Viral Tech Review)" 
                        value={scriptTopic} 
                        onChange={(e) => setScriptTopic(e.target.value)} 
                      />
                      <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5" onClick={handleGenerateScript} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Wand2 className="w-4 h-4 mr-3" />}
                         Write Master Script
                      </Button>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">02</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synthesize Motion Visuals</p>
                   </div>
                   <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-primary/40 resize-none font-medium leading-relaxed" 
                        placeholder="Describe cinematic frames (e.g. Hyper-realistic neon city)" 
                        value={videoPrompt} 
                        onChange={(e) => setVideoPrompt(e.target.value)} 
                      />
                      <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 shadow-xl shadow-indigo-600/20 hover:scale-[1.02]" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <VideoIcon className="w-4 h-4 mr-3" />}
                         Render 4K Sequence
                      </Button>
                   </div>
                </div>

                {magicHook && (
                  <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 space-y-4 animate-in slide-in-from-bottom-2">
                     <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Viral Dominance Hook Active</p>
                     </div>
                     <p className="text-xs italic text-white/90 leading-relaxed font-medium">"{magicHook}"</p>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'audio' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 relative z-10">
                <header className="space-y-1">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Audio Library</h3>
                   <p className="text-[10px] text-muted-foreground font-medium italic">High-fidelity royalty free studio tracks.</p>
                </header>
                
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <input className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 text-xs focus:border-primary/40 outline-none" placeholder="Search mood, genre, artist..." />
                </div>

                <div className="space-y-4">
                   {audioData.tracks.map((track) => (
                     <div key={track.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] hover:border-primary/30 transition-all cursor-pointer" onClick={() => addAudioTrack(track)}>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:text-primary transition-colors">
                              <Volume2 size={20} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-white uppercase tracking-tight">{track.title}</span>
                              <span className="text-[9px] text-muted-foreground uppercase font-black">{track.genre} • {track.duration}</span>
                           </div>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'text' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 relative z-10">
                <header className="space-y-1">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Neural Captions</h3>
                   <p className="text-[10px] text-muted-foreground font-medium italic">Auto-transcription powered by Gemini Neural Core.</p>
                </header>

                <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01] text-center space-y-6">
                   <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
                      <Type className="w-8 h-8 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white">Generate Subtitles</h4>
                      <p className="text-[10px] text-muted-foreground italic px-6">Click to analyze audio tracks and generate synced subtitles.</p>
                   </div>
                   <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest hover:bg-primary transition-all" onClick={handleAutoCaption} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Initiate Transcription"}
                   </Button>
                </div>

                {subtitles && (
                   <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary ml-2">Active Sequence Transcript</p>
                      <div className="bg-black/60 border border-white/10 rounded-2xl p-5 font-mono text-[11px] text-emerald-500/80 max-h-64 overflow-y-auto scrollbar-hide leading-relaxed">
                         {subtitles}
                      </div>
                   </div>
                )}
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Asset Protocol</h3>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-44 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] flex flex-col gap-6 hover:bg-primary/5 hover:border-primary/40 transition-all shadow-inner group" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inject Local Artifacts</span>
                </Button>
                <div className="grid grid-cols-2 gap-6">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden relative group cursor-pointer shadow-xl">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-60" /> : <img src={asset.url} className="w-full h-full object-cover opacity-60" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/70 backdrop-blur-sm">
                           <div className="p-3 bg-primary/20 rounded-xl border border-primary/40">
                              <Plus className="w-5 h-5 text-white" />
                           </div>
                        </div>
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded-lg text-[7px] font-black uppercase text-white/40">
                           {asset.type}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col bg-[#020408] p-8 lg:p-12 space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
           </div>
           
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[3rem] border-[16px] border-[#0a0d14] overflow-hidden shadow-2xl group flex flex-col">
              <div className="flex-1 relative flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-6 opacity-10 flex flex-col items-center">
                     <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center">
                        <Monitor size={40} />
                     </div>
                     <p className="text-xl font-bold uppercase tracking-[0.5em]">Sequence Monitor</p>
                  </div>
                ) : isImageData ? (
                  <img src={videoData} className="w-full h-full object-contain" alt="Sequence frame" />
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
                
                <div className="absolute top-6 left-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-xl border border-white/5">
                   <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,1)]" />
                   <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">LIVE HUD FEED</span>
                </div>

                {!isImageData && videoData && (
                  <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="bg-[#05070a]/90 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-16 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        <button className="text-muted-foreground hover:text-primary transition-all active:scale-90" onClick={() => videoRef.current && (videoRef.current.currentTime -= 5)}><SkipBack size={28} /></button>
                        <button 
                          onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                          className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                        >
                          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1.5" />}
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-all active:scale-90" onClick={() => videoRef.current && (videoRef.current.currentTime += 5)}><SkipForward size={28} /></button>
                    </div>
                  </div>
                )}
              </div>
           </div>

           <div className="h-60 bg-[#0a0d14] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="h-14 border-b border-white/5 px-10 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Master Sequence Engine</span>
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <span className="text-[13px] font-mono text-white/50 tracking-tighter">{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
                 </div>
                 <div className="flex gap-6 items-center">
                    <button className="text-muted-foreground hover:text-white transition-all"><Scissors size={18} /></button>
                    <button className="text-muted-foreground hover:text-white transition-all"><Layers size={18} /></button>
                    <button className="p-2.5 hover:bg-rose-500/20 rounded-xl text-rose-500/50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/30"><Trash2 size={18} /></button>
                 </div>
              </div>

              <div 
                ref={timelineRef}
                className="flex-1 overflow-x-auto p-8 space-y-5 relative cursor-crosshair select-none"
                onClick={handleTimelineClick}
              >
                 <div className="h-14 bg-primary/10 border border-primary/20 rounded-2xl relative flex items-center px-6 group hover:bg-primary/20 transition-all overflow-hidden shadow-inner">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-full shadow-glow" />
                    <Film className="w-4 h-4 text-primary mr-8 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mr-10 whitespace-nowrap">Primary Visuals</span>
                    {videoData && (
                      <div className="flex-1 flex gap-1 h-8">
                         {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="flex-1 bg-primary/30 border border-primary/40 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />)}
                      </div>
                    )}
                 </div>

                 <div className="h-12 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative flex items-center px-6 hover:bg-indigo-500/10 transition-all overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-full" />
                    <Volume2 className="w-4 h-4 text-indigo-400 mr-8 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mr-10 whitespace-nowrap">Audio Mix</span>
                    {mediaAssets.some(m => m.type === 'audio') && (
                      <div className="flex-1 h-4 flex items-center gap-0.5">
                         {[...Array(60)].map((_, i) => (
                           <div key={i} className="w-0.5 bg-indigo-500/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                         ))}
                      </div>
                    )}
                 </div>

                 <div className="h-10 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative flex items-center px-6 hover:bg-emerald-500/10 transition-all overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-full" />
                    <Type className="w-4 h-4 text-emerald-400 mr-8 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mr-10 whitespace-nowrap">Subtitles</span>
                    {subtitles && <div className="h-2 w-full bg-emerald-500/30 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]" />}
                 </div>
                 
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)] flex flex-col items-center" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 >
                    <div className="w-4 h-4 bg-white rotate-45 -translate-y-2 shadow-2xl" />
                 </div>
              </div>
           </div>
        </div>

        <div className="w-[380px] bg-[#05070a] border-l border-white/5 p-8 space-y-12 overflow-y-auto scrollbar-hide relative">
           <div className="absolute inset-0 shimmer opacity-[0.01] pointer-events-none" />
           
           <div className="space-y-10 relative z-10">
              <header className="flex items-center gap-4 text-primary">
                 <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Settings2 size={20} />
                 </div>
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">System Config</h4>
              </header>

              <div className="space-y-10">
                 <div className="space-y-5">
                    <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                       <span>Neural Density</span>
                       <span className="text-primary font-black">4K ULTIMATE</span>
                    </div>
                    <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                 </div>

                 <div className="space-y-5">
                    <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                       <span>Vector Velocity</span>
                       <span className="text-indigo-400 font-black">NORMAL (1.0x)</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} className="[&_[role=slider]]:bg-indigo-600" />
                 </div>
              </div>

              <div className="pt-10 border-t border-white/10 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Canvas Architecture</h4>
                 <div className="grid grid-cols-2 gap-5">
                    {[
                      { id: '9:16', label: 'Mobile Reels', icon: Smartphone },
                      { id: '16:9', label: 'Cinematic', icon: Monitor }
                    ].map((ratio) => (
                      <button 
                        key={ratio.id} 
                        className={cn("h-20 flex flex-col items-center justify-center gap-2 rounded-2xl border transition-all shadow-xl group", ratio.id === '9:16' ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/5")}
                      >
                         <ratio.icon size={16} className={cn("transition-transform group-hover:scale-110", ratio.id === '9:16' ? "text-primary" : "text-muted-foreground")} />
                         <span className="text-[9px] font-black uppercase tracking-widest">{ratio.label}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-[100px] flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center space-y-16 max-w-2xl px-12">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/30 blur-[150px] rounded-full animate-pulse" />
                 <div className="w-40 h-40 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto border-2 border-white/10 relative z-10 shadow-[0_0_100px_rgba(59,130,246,0.2)]">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                 </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-5xl font-headline font-black text-white tracking-tighter uppercase leading-none">Neural Magic in Progress</h2>
                 <p className="text-2xl text-muted-foreground italic font-medium opacity-60">Synchronizing global AI engines to materialize your creative vision.</p>
                 <div className="w-64 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden shadow-inner">
                    <div className="h-full bg-primary animate-progress" />
                 </div>
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
