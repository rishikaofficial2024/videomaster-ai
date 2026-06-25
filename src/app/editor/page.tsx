"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pause, Play, Wand2, Download, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Music, Upload, Film, Settings2, Type, Crown, Zap, Volume2,
  Monitor, RefreshCw, Cpu, Scissors, Timer, Layers, Smile, Undo2, Redo2, 
  Save, Trash2, Gauge, Palette, Mic, Languages, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";

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
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("MASTERPIECE_NODE_01");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(toolFromUrl || 'ai');
  
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    setMounted(true);
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
      setIsNewProject(false);
    } else {
      setProjectId("prj-" + Math.random().toString(36).substring(7));
    }
  }, [projectIdFromUrl]);

  const projectRef = useMemoFirebase(() => {
    if (!user || !db || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user?.uid, db, projectId]);

  const { data: project } = useDoc(projectRef);

  useEffect(() => {
    if (project && mounted) {
      setTitle(project.title || "Untitled Project");
      setVideoData(project.videoDataUri || null);
    }
  }, [project, mounted]);

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef || !mounted) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      videoDataUri: videoData,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data)
        .catch(async (error) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: projectRef.path,
            operation: 'update',
            requestResourceData: data,
          } satisfies SecurityRuleContext));
        })
        .finally(() => setIsSaving(false));
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      })
      .then(() => {
        setIsNewProject(false);
        setIsSaving(false);
      })
      .catch(async (error) => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      });
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsProcessing(true);
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Synthesis Complete", description: "Video clip rendered." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Motion Core Busy", description: "Re-initiating link..." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoiceover = async (lang: 'en' | 'hi') => {
    if (!voiceText) return;
    setIsProcessing(true);
    try {
      const result = await generateAiVoiceover({ text: voiceText, language: lang });
      toast({ title: "Audio Synthesized", description: `${lang.toUpperCase()} Voiceover ready.` });
      // In a real app, we'd add this to the timeline audio track
    } catch (e: any) {
      toast({ variant: "destructive", title: "Audio Node Error", description: "Retry speech protocol." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020108] flex flex-col overflow-hidden text-[#e1e4e8]">
      {/* TOP NAV */}
      <div className="h-20 bg-[#050314]/90 backdrop-blur-3xl px-8 flex items-center justify-between z-40 border-b border-white/5">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-black text-xl focus:outline-none w-[300px] truncate text-white uppercase tracking-tighter"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                {isSaving ? "Syncing..." : "Cloud Node Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Button variant="ghost" className="h-11 px-6 rounded-full border border-white/5 bg-white/5 text-white font-bold text-[10px] uppercase tracking-widest" onClick={() => handleSave()}>
             <Save className="w-3.5 h-3.5 mr-2" /> Save
           </Button>
           <Button className="h-11 px-10 rounded-full font-black uppercase tracking-widest bg-primary text-white shadow-glow text-[10px] gap-2">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT ICON BAR */}
        <div className="w-20 bg-[#050314] border-r border-white/5 flex flex-col items-center py-8 gap-10">
           {[
             { icon: Cpu, id: 'ai', label: 'AI' },
             { icon: Film, id: 'media', label: 'MEDIA' },
             { icon: Type, id: 'text', label: 'TEXT' },
             { icon: Music, id: 'audio', label: 'AUDIO' },
             { icon: Palette, id: 'fx', label: 'FX' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-2 transition-all", activeTab === item.id ? "text-primary scale-110" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-2xl border-2 transition-all", activeTab === item.id ? "bg-primary/15 border-primary shadow-glow" : "bg-transparent border-transparent hover:bg-white/5")}>
                 <item.icon className="w-5 h-5" />
               </div>
               <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* TOOL DRAWER */}
        <div className="w-96 bg-[#0a061c] border-r border-white/5 flex flex-col p-8 space-y-10 overflow-y-auto scrollbar-hide hidden lg:flex shadow-2xl relative z-10">
           {activeTab === 'ai' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">AI Motion Engine</p>
                   </div>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-xs h-32 outline-none focus:border-primary/40 transition-all placeholder:opacity-20 leading-relaxed" 
                     placeholder="Describe your cinematic vision..." 
                     value={videoPrompt} 
                     onChange={(e) => setVideoPrompt(e.target.value)} 
                   />
                   <Button className="w-full h-14 rounded-full font-black text-[9px] uppercase tracking-widest bg-primary shadow-glow" onClick={handleGenerateVideo} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <VideoIcon className="w-4 h-4 mr-2" />}
                      Synthesize Video
                   </Button>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-accent">
                      <Mic className="w-4 h-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Neural Voiceover</p>
                   </div>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-xs h-32 outline-none focus:border-accent/40 transition-all placeholder:opacity-20" 
                     placeholder="Enter script for voiceover..." 
                     value={voiceText} 
                     onChange={(e) => setVoiceText(e.target.value)} 
                   />
                   <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 rounded-xl text-[8px] font-black uppercase tracking-widest border-white/10" onClick={() => handleGenerateVoiceover('en')} disabled={isProcessing}>
                        <Languages className="w-3 h-3 mr-2" /> English
                      </Button>
                      <Button variant="outline" className="h-12 rounded-xl text-[8px] font-black uppercase tracking-widest border-white/10" onClick={() => handleGenerateVoiceover('hi')} disabled={isProcessing}>
                        <Languages className="w-3 h-3 mr-2" /> Hindi
                      </Button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" />
                <div 
                   className="w-full h-48 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-all group cursor-pointer" 
                   onClick={() => fileInputRef.current?.click()}
                >
                   <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Upload Asset</span>
                </div>
             </div>
           )}
        </div>

        {/* MAIN PREVIEW & TIMELINE */}
        <div className="flex-1 flex flex-col bg-[#03010a] p-6 lg:p-10 space-y-10 relative overflow-hidden">
           <div className="flex-1 relative aspect-video mx-auto w-full max-w-5xl bg-black rounded-[3rem] border-[8px] border-[#0a061c] overflow-hidden shadow-2xl group flex flex-col items-center justify-center">
              {!videoData ? (
                <div className="text-center space-y-6 opacity-10">
                   <Monitor size={80} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.6em]">AWAITING SOURCE FEED</p>
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
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <Button 
                   size="icon" 
                   onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} 
                   className={cn("w-24 h-24 rounded-full bg-primary/20 backdrop-blur-3xl border-2 border-primary/50 transition-all pointer-events-auto shadow-glow", isPlaying ? "opacity-0 scale-90" : "opacity-100 scale-100")}
                 >
                   {isPlaying ? <Pause className="fill-primary w-8 h-8" /> : <Play className="fill-primary w-8 h-8 ml-1" />}
                 </Button>
              </div>
           </div>

           {/* TIMELINE */}
           <div className="h-56 glass-panel rounded-[3rem] border-white/5 flex flex-col overflow-hidden shadow-2xl">
              <div className="h-12 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Film className="w-3.5 h-3.5 text-primary" />
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-white">Timeline</h4>
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <span className="text-[11px] font-mono font-bold text-primary tracking-widest">{currentTime.toFixed(2)}s <span className="opacity-20 text-white">/ {duration.toFixed(2)}s</span></span>
                 </div>
                 <div className="flex items-center gap-4">
                    {[Scissors, Timer, Layers].map((Icon, i) => (
                      <Button key={i} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white"><Icon size={14}/></Button>
                    ))}
                 </div>
              </div>

              <div className="flex-1 p-8 space-y-4 relative bg-black/20 overflow-hidden">
                 <div className="h-12 bg-primary/10 border border-primary/20 rounded-xl relative flex items-center px-6">
                    <Film className="w-4 h-4 text-primary mr-4 opacity-30" />
                    {videoData && (
                      <div className="absolute left-0 h-full bg-primary/30 border-x-2 border-primary w-[80%] rounded-xl" />
                    )}
                 </div>
                 <div className="h-10 bg-accent/5 border border-accent/10 rounded-xl relative flex items-center px-6 opacity-30">
                    <Music className="w-3 h-3 text-accent mr-4 opacity-30" />
                 </div>

                 {/* PLAYHEAD */}
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-glow" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 >
                    <div className="absolute -top-1 -left-[5px] w-3 h-3 bg-white rounded-full border-2 border-[#0a061c]" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#020108]/90 backdrop-blur-3xl flex items-center justify-center">
           <div className="text-center space-y-12">
              <div className="relative mx-auto w-24 h-24">
                 <Loader2 className="w-full h-full animate-spin text-primary relative z-10" />
                 <div className="absolute inset-0 blur-3xl bg-primary/40 rounded-full scale-150 animate-pulse" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tighter">Neural Sync Active</h2>
                 <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.6em] animate-pulse">Establishing Production Link...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#020108]" />}>
      <EditorContent />
    </Suspense>
  );
}
