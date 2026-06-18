
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
  Maximize2, VolumeX, List, History, MousePointer2,
  CheckCircle2, AlertCircle
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
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  
  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("tools");
  const [selectedVideoData, setSelectedVideoData] = useState<string | null>(null);
  
  // AI States
  const [scriptTopic, setScriptTopic] = useState("");
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [optimizedMetadata, setOptimizedMetadata] = useState<any>(null);

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

  const { data: project } = useDoc(projectIdFromUrl ? projectRef : null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
      setSelectedVideoData(project.videoDataUri || null);
      setSubtitles(project.subtitles || null);
      setGeneratedThumbnail(project.thumbnailUrl || null);
      setGeneratedScript({ script: project.aiNotes } || null);
      setIsNewProject(false);
    }
  }, [project]);

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

  const deductCredits = async (cost: number) => {
    if (profile?.isPremium || !userProfileRef) return;
    updateDoc(userProfileRef, {
      credits: increment(-cost)
    }).catch(e => {
       errorEmitter.emit("permission-error", new FirestorePermissionError({
         path: userProfileRef.path,
         operation: "update",
         requestResourceData: { credits: 'decrement' }
       }));
    });
  };

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef) return;
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
      ...extraData
    };
    
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
        thumbnailUrl: data.thumbnailUrl || generatedThumbnail || `https://picsum.photos/seed/${projectRef.id}/600/400`,
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

  // AI Feature Handlers
  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    if (!checkCredits(2)) return;
    
    setIsProcessing(true);
    setProcessingMessage("AI is crafting your viral script...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setGeneratedScript(result);
      await deductCredits(2);
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Generated!", description: "Check the AI Notes section." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt) return;
    if (!checkCredits(5)) return;
    
    setIsProcessing(true);
    setProcessingMessage("Imagen 4 is designing your thumbnail...");
    try {
      const result = await generateAiThumbnail({ prompt: thumbnailPrompt });
      setGeneratedThumbnail(result.thumbnailDataUri);
      await deductCredits(5);
      handleSave({ thumbnailUrl: result.thumbnailDataUri });
      toast({ title: "Design Complete!", description: "Thumbnail updated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!generatedScript?.script) {
       toast({ title: "Script Required", description: "Generate a script first for analysis." });
       return;
    }
    if (!checkCredits(2)) return;
    
    setIsProcessing(true);
    setProcessingMessage("Analyzing neural triggers for SEO...");
    try {
      const result = await aiVideoContentOptimization({ videoTranscript: generatedScript.script });
      setOptimizedMetadata(result);
      await deductCredits(2);
      setTitle(result.title);
      handleSave({ optimizedTitle: result.title, optimizedDescription: result.description, hashtags: result.hashtags });
      toast({ title: "Optimized!", description: "Metadata updated with viral keywords." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
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
      
      {/* Top Toolbar */}
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
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">V1.0.4-PRO • Cloud Synced</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 px-6 rounded-lg text-[11px] font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2" disabled={isProcessing}>
            <Download className="w-3.5 h-3.5" /> Export Project
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Tools */}
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

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0f17]">
          <div className="flex-1 relative flex items-center justify-center p-4">
             <div className="aspect-video w-full max-w-4xl bg-black rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden flex items-center justify-center">
                {!selectedVideoData ? (
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Video className="w-10 h-10 text-white/20" />
                     </div>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Workspace Empty</p>
                     <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-white/10" onClick={() => toast({ title: "Coming Soon", description: "Direct upload will be enabled in v1.1" })}>Import Media</Button>
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
                
                {/* HUD */}
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold font-mono">
                      {profile?.isPremium ? '4K PRO' : '720p FREE'}
                   </div>
                </div>
             </div>

             {/* Playback Controls */}
             <div className="absolute bottom-10 bg-[#161a25]/90 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><SkipBack className="w-5 h-5" /></Button>
                <button 
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><SkipForward className="w-5 h-5" /></Button>
             </div>
          </div>

          {/* Timeline */}
          <div className="h-[320px] bg-[#0a0d14] border-t flex flex-col shrink-0">
             <div className="h-10 bg-[#111621] flex items-center justify-between px-6 border-b">
                <div className="flex gap-6 items-center">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Master Track</span>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {[
                  { label: "V1: MAIN FOOTAGE", color: "bg-primary/20 border-primary/40 text-primary", icon: Video, active: !!selectedVideoData },
                  { label: "V2: AI OVERLAYS", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", icon: Sparkles, active: false },
                  { label: "A1: NARRATION", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", icon: Volume2, active: false },
                  { label: "T1: CAPTIONS", color: "bg-rose-500/10 border-rose-500/20 text-rose-400", icon: Type, active: !!subtitles }
                ].map((track, i) => (
                  <div key={i} className="flex gap-3 h-12">
                     <div className="w-32 shrink-0 bg-[#161a25] rounded-lg border border-white/5 flex items-center px-3 gap-2">
                        <track.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-tight truncate">{track.label}</span>
                     </div>
                     <div className="flex-1 bg-[#0c0f17] rounded-lg relative border border-white/5 overflow-hidden">
                        {track.active && (
                          <div className={cn("absolute inset-y-1 left-4 right-10 rounded-md border-x-4", track.color)}></div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Inspector */}
        <div className="w-[360px] bg-[#0a0d14] border-l shrink-0 flex flex-col overflow-hidden">
           <Tabs defaultValue="ai" className="flex-1 flex flex-col">
              <TabsList className="w-full h-14 bg-transparent border-b rounded-none grid grid-cols-2 p-0">
                 <TabsTrigger value="inspector" className="rounded-none font-bold text-xs">Project Info</TabsTrigger>
                 <TabsTrigger value="ai" className="rounded-none font-bold text-xs text-primary">AI Studio</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                 <TabsContent value="inspector" className="mt-0 space-y-6">
                    {generatedScript && (
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Generated Script</h4>
                         <div className="p-4 bg-[#161a25] rounded-xl text-xs leading-relaxed border border-white/5">
                            {generatedScript.script}
                         </div>
                      </div>
                    )}
                    {optimizedMetadata && (
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Viral Hashtags</h4>
                         <div className="flex flex-wrap gap-2">
                            {optimizedMetadata.hashtags.map((h: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-[10px] font-bold">{h}</span>
                            ))}
                         </div>
                      </div>
                    )}
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
                            className="w-full bg-[#0c0f17] border border-white/5 rounded-xl p-3 text-xs h-20 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                            value={scriptTopic}
                            onChange={(e) => setScriptTopic(e.target.value)}
                          />
                          <Button 
                            className="w-full h-10 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-[10px]" 
                            size="sm"
                            onClick={handleGenerateScript}
                            disabled={isProcessing || !scriptTopic}
                          >
                             {isProcessing && processingMessage.includes("script") ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Generate viral script (2c)"}
                          </Button>
                       </div>

                       {/* AI Thumbnail Engine */}
                       <div className="p-6 rounded-2xl bg-[#161a25] border border-rose-500/20 space-y-4 shadow-xl">
                          <div className="flex items-center gap-3">
                             <ImageIcon className="w-4 h-4 text-rose-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Thumbnail Designer</h4>
                          </div>
                          <textarea 
                            placeholder="Describe your thumbnail visual..." 
                            className="w-full bg-[#0c0f17] border border-white/5 rounded-xl p-3 text-xs h-20 focus:ring-1 focus:ring-rose-500 outline-none resize-none"
                            value={thumbnailPrompt}
                            onChange={(e) => setThumbnailPrompt(e.target.value)}
                          />
                          <Button 
                            className="w-full h-10 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-[10px]" 
                            size="sm"
                            onClick={handleGenerateThumbnail}
                            disabled={isProcessing || !thumbnailPrompt}
                          >
                             {isProcessing && processingMessage.includes("thumbnail") ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Design from scratch (5c)"}
                          </Button>
                          {generatedThumbnail && (
                             <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mt-2">
                                <Image src={generatedThumbnail} alt="Preview" fill className="object-cover" />
                             </div>
                          )}
                       </div>

                       {/* Content Optimizer */}
                       <div className="grid grid-cols-1 gap-3">
                          <Button 
                            variant="outline" 
                            className="w-full h-14 justify-start px-4 rounded-xl border-white/10 hover:bg-white/5 group"
                            onClick={handleOptimizeContent}
                            disabled={isProcessing || !generatedScript}
                          >
                             <Zap className="w-4 h-4 mr-3 text-orange-400" />
                             <div className="text-left">
                                <p className="text-[11px] font-bold">Viral SEO Magic</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">2 Credits</p>
                             </div>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full h-14 justify-start px-4 rounded-xl border-white/10 hover:bg-white/5 group"
                            onClick={() => toast({ title: "Feature Locked", description: "Video generation is a Pro feature." })}
                          >
                             <Sparkles className="w-4 h-4 mr-3 text-blue-400" />
                             <div className="text-left">
                                <p className="text-[11px] font-bold">Veo 2.0 Video Gen</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">10 Credits</p>
                             </div>
                          </Button>
                       </div>
                    </div>
                 </TabsContent>
              </div>
           </Tabs>
        </div>
      </div>

      {/* Global Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 animate-spin text-primary opacity-20" />
                <div className="absolute inset-0 m-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                   <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-headline font-bold text-white tracking-tighter uppercase">AI Orchestration</h3>
               <p className="text-muted-foreground font-medium text-sm leading-relaxed">{processingMessage}</p>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full max-w-sm mx-auto">
                <div className="h-full bg-primary animate-progress-indefinite shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
