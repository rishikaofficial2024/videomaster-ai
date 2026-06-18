
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Music, Wand2, Download, Crop, Filter, Gauge, 
  Type, Sparkles, ChevronLeft, Loader2, Video,
  Zap, Captions, Mic, Volume2, Image as ImageIcon,
  PenTool, Layout, Layers, Settings2, Share2,
  Maximize2, VolumeX, List, History, MousePointer2
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAiThumbnail } from "@/ai/flows/ai-thumbnail-designer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  
  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("tools");
  const [selectedVideoData, setSelectedVideoData] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [voiceoverText, setVoiceoverText] = useState("");
  const [generatedVoiceover, setGeneratedVoiceover] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [aiScript, setAiScript] = useState<any>(null);
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && !projectIdFromUrl) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl]);

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectRef = useMemo(() => {
    if (!user || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user, db, projectId]);

  const { data: project, loading: projectLoading } = useDoc(projectIdFromUrl ? projectRef : null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
      setSelectedVideoData(project.videoDataUri || null);
      setSubtitles(project.subtitles || null);
      setGeneratedThumbnail(project.thumbnailUrl || null);
      setIsNewProject(false);
    }
  }, [project]);

  const handleSave = (videoUri?: string) => {
    if (!user || !projectRef) return;
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
    };
    if (videoUri) data.videoDataUri = videoUri;
    if (generatedThumbnail) data.thumbnailUrl = generatedThumbnail;
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch((e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "update",
          requestResourceData: data
        }));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        thumbnailUrl: generatedThumbnail || `https://picsum.photos/seed/${projectRef.id}/600/400`,
      }).then(() => {
        setIsNewProject(false);
        if (!projectIdFromUrl) {
          router.replace(`/editor?id=${projectRef.id}`);
        }
      }).catch((e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "create",
          requestResourceData: data
        }));
      });
    }
  };

  const checkCredits = (cost: number) => {
    if (profile?.isPremium) return true;
    if ((profile?.credits ?? 0) < cost) {
      toast({
        variant: "destructive",
        title: "Credits Exhausted",
        description: `Upgrade to Pro to continue. (Action cost: ${cost}c)`,
        action: <Button variant="secondary" size="sm" asChild><Link href="/premium">Upgrade</Link></Button>
      });
      return false;
    }
    return true;
  };

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8]">
      <Navbar />
      
      {/* Top Professional Toolbar */}
      <div className="h-14 border-b bg-[#0a0d14]/80 backdrop-blur-xl px-4 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleSave()}
              className="bg-transparent font-bold text-sm focus:outline-none border-b border-transparent focus:border-primary/50 w-48 truncate"
            />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">V1.0.4-PRO • Last saved 2m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-[11px] font-bold gap-2">
             <History className="w-3.5 h-3.5" /> History
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[11px] font-bold border-white/10 hover:bg-white/5 gap-2">
             <Share2 className="w-3.5 h-3.5" /> Collaboration
          </Button>
          <Button size="sm" className="h-8 px-6 rounded-lg text-[11px] font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2" disabled={isProcessing}>
            <Download className="w-3.5 h-3.5" /> Export Project
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Professional Tool Shelf */}
        <div className="w-16 bg-[#0a0d14] border-r flex flex-col items-center py-4 gap-4 z-30 shrink-0">
           {[
             { icon: MousePointer2, id: 'select' },
             { icon: Scissors, id: 'cut' },
             { icon: Wand2, id: 'ai' },
             { icon: Music, id: 'audio' },
             { icon: Type, id: 'text' },
             { icon: Layers, id: 'layers' }
           ].map((tool) => (
             <button key={tool.id} className={cn(
               "p-3 rounded-xl transition-all",
               activeTab === tool.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-white"
             )} onClick={() => setActiveTab(tool.id)}>
               <tool.icon className="w-5 h-5" />
             </button>
           ))}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0f17]">
          {/* Viewport Area */}
          <div className="flex-1 relative flex items-center justify-center p-4">
             <div className="aspect-video w-full max-w-4xl bg-black rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden flex items-center justify-center">
                {!selectedVideoData ? (
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Video className="w-10 h-10 text-white/20" />
                     </div>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Workspace Empty</p>
                     <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-white/10">Import Media</Button>
                  </div>
                ) : (
                  <video 
                    ref={videoRef}
                    src={selectedVideoData} 
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlayback}
                  />
                )}
                
                {/* Viewport HUD */}
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold font-mono">
                      4K • 60 FPS
                   </div>
                   <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold font-mono text-primary">
                      {isPlaying ? "LIVE" : "PAUSED"}
                   </div>
                </div>
             </div>

             {/* Playback Controls Float */}
             <div className="absolute bottom-10 bg-[#161a25]/90 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><SkipBack className="w-5 h-5" /></Button>
                <button 
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><SkipForward className="w-5 h-5" /></Button>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-4 text-xs font-mono font-bold text-muted-foreground">
                   <span className="text-primary">00:12:44</span>
                   <span>/</span>
                   <span>02:44:00</span>
                </div>
             </div>
          </div>

          {/* Timeline Pro Area */}
          <div className="h-[320px] bg-[#0a0d14] border-t flex flex-col shrink-0">
             <div className="h-10 bg-[#111621] flex items-center justify-between px-6 border-b">
                <div className="flex gap-6 items-center">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Master Track</span>
                   </div>
                   <div className="h-4 w-px bg-white/10" />
                   <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-bold gap-2 text-muted-foreground"><Volume2 className="w-3 h-3" /> Mute Audio</Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-bold gap-2 text-muted-foreground"><Maximize2 className="w-3 h-3" /> Full Timeline</Button>
                   </div>
                </div>
                <div className="flex gap-4 items-center">
                   <Slider defaultValue={[20]} max={100} step={1} className="w-32" />
                   <Settings2 className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {[
                  { label: "V1: MAIN FOOTAGE", color: "bg-primary/20 border-primary/40 text-primary", icon: Video },
                  { label: "V2: AI OVERLAYS", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", icon: Sparkles },
                  { label: "A1: NARRATION", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", icon: Volume2 },
                  { label: "A2: BG MUSIC", color: "bg-orange-500/10 border-orange-500/20 text-orange-400", icon: Music },
                  { label: "T1: CAPTIONS", color: "bg-rose-500/10 border-rose-500/20 text-rose-400", icon: Type }
                ].map((track, i) => (
                  <div key={i} className="flex gap-3 h-12">
                     <div className="w-32 shrink-0 bg-[#161a25] rounded-lg border border-white/5 flex items-center px-3 gap-2">
                        <track.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-tight truncate">{track.label}</span>
                     </div>
                     <div className="flex-1 bg-[#0c0f17] rounded-lg relative border border-white/5 overflow-hidden">
                        {i === 0 && selectedVideoData && (
                          <div className={cn("absolute inset-y-1 left-20 right-40 rounded-md border-x-4", track.color)}></div>
                        )}
                        {i === 4 && subtitles && (
                          <div className={cn("absolute inset-y-1 left-24 right-44 rounded-md border-x-4", track.color)}></div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Tool Inspector */}
        <div className="w-[360px] bg-[#0a0d14] border-l shrink-0 flex flex-col overflow-hidden">
           <Tabs defaultValue="inspector" className="flex-1 flex flex-col">
              <TabsList className="w-full h-14 bg-transparent border-b rounded-none grid grid-cols-2 p-0">
                 <TabsTrigger value="inspector" className="rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-primary font-bold text-xs">Inspector</TabsTrigger>
                 <TabsTrigger value="ai" className="rounded-none data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-primary font-bold text-xs text-primary">AI Studio</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                 <TabsContent value="inspector" className="mt-0 space-y-6">
                    <Accordion type="multiple" defaultValue={["transform", "filters"]} className="w-full">
                       <AccordionItem value="transform" className="border-white/5">
                          <AccordionTrigger className="text-[11px] font-bold uppercase tracking-widest py-3">Transform</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-2">
                             <div className="space-y-2">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold">Scale</label>
                                <Slider defaultValue={[100]} max={200} step={1} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold">Rotation</label>
                                <Slider defaultValue={[0]} max={360} step={1} />
                             </div>
                          </AccordionContent>
                       </AccordionItem>
                       <AccordionItem value="filters" className="border-white/5">
                          <AccordionTrigger className="text-[11px] font-bold uppercase tracking-widest py-3">Filters & Effects</AccordionTrigger>
                          <AccordionContent className="pt-2">
                             <div className="grid grid-cols-3 gap-2">
                                {['Cinematic', 'Lush', 'Grain', 'Sepia', 'Noir', 'Vibrant'].map((f) => (
                                  <button key={f} className="aspect-square bg-[#161a25] rounded-xl border border-white/5 hover:border-primary/50 transition-all text-[10px] font-bold">{f}</button>
                                ))}
                             </div>
                          </AccordionContent>
                       </AccordionItem>
                    </Accordion>
                 </TabsContent>

                 <TabsContent value="ai" className="mt-0 space-y-6">
                    <div className="space-y-6">
                       {/* AI Script Writer */}
                       <div className="p-6 rounded-2xl bg-[#161a25] border border-indigo-500/20 space-y-4 shadow-xl">
                          <div className="flex items-center gap-3">
                             <PenTool className="w-4 h-4 text-indigo-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Viral Script Writer</h4>
                          </div>
                          <textarea 
                            placeholder="What's your video about?" 
                            className="w-full bg-[#0c0f17] border border-white/5 rounded-xl p-3 text-xs h-20 focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={scriptTopic}
                            onChange={(e) => setScriptTopic(e.target.value)}
                          />
                          <Button className="w-full h-10 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-[10px]" size="sm">
                             Generate viral script (2c)
                          </Button>
                       </div>

                       {/* AI Thumbnail Engine */}
                       <div className="p-6 rounded-2xl bg-[#161a25] border border-rose-500/20 space-y-4 shadow-xl">
                          <div className="flex items-center gap-3">
                             <ImageIcon className="w-4 h-4 text-rose-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Thumbnail Designer</h4>
                          </div>
                          <textarea 
                            placeholder="Describe your thumbnail..." 
                            className="w-full bg-[#0c0f17] border border-white/5 rounded-xl p-3 text-xs h-20 focus:ring-1 focus:ring-rose-500 outline-none"
                            value={thumbnailPrompt}
                            onChange={(e) => setThumbnailPrompt(e.target.value)}
                          />
                          <Button className="w-full h-10 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-[10px]" size="sm">
                             Design from scratch (5c)
                          </Button>
                       </div>

                       {/* Pro Action Group */}
                       <div className="grid grid-cols-1 gap-3">
                          <Button variant="outline" className="w-full h-14 justify-start px-4 rounded-xl border-white/10 hover:bg-white/5 group">
                             <Captions className="w-4 h-4 mr-3 text-primary" />
                             <div className="text-left">
                                <p className="text-[11px] font-bold">Auto-Transcription</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">3 Credits</p>
                             </div>
                          </Button>
                          <Button variant="outline" className="w-full h-14 justify-start px-4 rounded-xl border-white/10 hover:bg-white/5 group">
                             <Zap className="w-4 h-4 mr-3 text-orange-400" />
                             <div className="text-left">
                                <p className="text-[11px] font-bold">Viral SEO Magic</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">2 Credits</p>
                             </div>
                          </Button>
                       </div>
                    </div>
                 </TabsContent>
              </div>
           </Tabs>
        </div>
      </div>

      {/* Modern Global Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-8">
             <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 animate-spin text-primary opacity-20" />
                <div className="absolute inset-0 m-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                   <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-headline font-bold text-white tracking-tighter uppercase">AI Orchestration</h3>
               <p className="text-muted-foreground font-medium text-sm">Processing neural layers for maximum quality...</p>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full max-w-sm mx-auto">
                <div 
                  className="h-full bg-primary transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  style={{ width: `${exportProgress || 30}%` }}
                />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
