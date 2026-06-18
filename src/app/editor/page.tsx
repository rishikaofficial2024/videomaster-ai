
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Music, Wand2, Download, Sparkles, ChevronLeft, Loader2, Video,
  Zap, Volume2, Image as ImageIcon,
  PenTool, Layers, MousePointer2,
  Coins, Plus, RefreshCw, AlertCircle, CloudCheck, Cloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  
  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeTool, setActiveTool] = useState("ai");
  const [activeInspectorTab, setActiveInspectorTab] = useState("ai");
  
  // Media States
  const [videoData, setVideoData] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // AI Input/Output States
  const [scriptTopic, setScriptTopic] = useState("");
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  
  const [aiScript, setAiScript] = useState<any>(null);

  // Load project if exists
  const projectRef = useMemo(() => {
    if (!user || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user, db, projectId]);

  const { data: project } = useDoc(projectRef);

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
      setVideoData(project.videoDataUri || null);
      setThumbnailUrl(project.thumbnailUrl || null);
      setAiScript(project.aiNotes ? { script: project.aiNotes } : null);
      setIsNewProject(false);
    }
  }, [project]);

  // Project ID Generation
  useEffect(() => {
    if (!projectId && !projectIdFromUrl) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl]);

  const checkCredits = (cost: number) => {
    if (profile?.isPremium) return true;
    if ((profile?.credits ?? 0) < cost) {
      toast({
        variant: "destructive",
        title: "Credits Required",
        description: `This action costs ${cost} credits. Please top up.`,
        action: <Button variant="secondary" size="sm" asChild><Link href="/premium">Upgrade</Link></Button>
      });
      return false;
    }
    return true;
  };

  const deductCredits = async (cost: number) => {
    if (profile?.isPremium || !userProfileRef) return;
    updateDoc(userProfileRef, { credits: increment(-cost) }).catch(() => {});
  };

  const handleSave = async (extraData: any = {}) => {
    if (!user || !projectRef) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
      ...extraData
    };
    
    try {
      if (!isNewProject) {
        await updateDoc(projectRef, data).catch((e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: data
          }));
        });
      } else {
        await setDoc(projectRef, {
          ...data,
          createdAt: serverTimestamp(),
          thumbnailUrl: data.thumbnailUrl || thumbnailUrl || `https://picsum.photos/seed/${projectRef.id}/600/400`,
        });
        setIsNewProject(false);
        if (!projectIdFromUrl) router.replace(`/editor?id=${projectRef.id}`);
      }
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  // AI Actions
  const handleGenerateScript = async () => {
    if (!scriptTopic || !checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Generating narrative structure...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setAiScript(result);
      await deductCredits(2);
      await handleSave({ aiNotes: result.script });
      toast({ title: "Script Optimized", description: "Project notes updated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Designing cinematic thumbnail...");
    try {
      const result = await generateAiThumbnail({ prompt: thumbnailPrompt });
      setThumbnailUrl(result.thumbnailDataUri);
      await deductCredits(5);
      await handleSave({ thumbnailUrl: result.thumbnailDataUri });
      toast({ title: "Thumbnail Ready", description: "Master design applied." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Design Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !checkCredits(20)) return;
    setIsProcessing(true);
    setProcessingMessage("Veo 2.0 is rendering visual clip...");
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      await deductCredits(20);
      await handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Clip Rendered", description: "Successfully added to project." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Engine Error", description: "Connection timeout. Please retry." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceText || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Synthesizing neural voice...");
    try {
      const result = await generateAiVoiceover({ text: voiceText, voiceName: 'Algenib' });
      setAudioData(result.audioDataUri);
      await deductCredits(5);
      toast({ title: "Audio Ready", description: "Narration track generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Audio Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8] font-body">
      <Navbar />
      
      {/* Top Bar */}
      <div className="h-14 border-b bg-[#0a0d14]/90 backdrop-blur-2xl px-4 flex items-center justify-between z-40 shrink-0">
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
            <div className="flex items-center gap-2">
               {isSaving ? (
                 <div className="flex items-center gap-1">
                   <RefreshCw className="w-2.5 h-2.5 animate-spin text-primary" />
                   <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Saving to Cloud</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1">
                   <Activity className="w-2.5 h-2.5 text-emerald-500" />
                   <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Neural Link Active</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary tracking-widest">{profile?.credits ?? 0} STUDIO CREDITS</span>
           </div>
           <Button size="sm" className="h-9 px-6 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 gap-2">
             <Download className="w-4 h-4" /> Export 4K
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tool Shelf */}
        <div className="w-16 bg-[#0a0d14] border-r flex flex-col items-center py-6 gap-6 z-30 shrink-0">
           {[
             { icon: MousePointer2, id: 'select' },
             { icon: Scissors, id: 'cut' },
             { icon: Wand2, id: 'ai' },
             { icon: Music, id: 'audio' },
             { icon: Layers, id: 'layers' }
           ].map((tool) => (
             <button key={tool.id} className={cn(
               "p-3 rounded-xl transition-all relative group",
               activeTool === tool.id ? "bg-primary text-white shadow-2xl shadow-primary/40" : "text-muted-foreground hover:bg-white/5"
             )} onClick={() => setActiveTool(tool.id)}>
               <tool.icon className="w-5 h-5" />
               <div className="absolute left-full ml-4 px-2 py-1 bg-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                  {tool.id.toUpperCase()}
               </div>
             </button>
           ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0f17] relative">
          <div className="flex-1 relative flex items-center justify-center p-8">
             <div className="aspect-video w-full max-w-5xl bg-black rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden flex items-center justify-center group/player">
                {!videoData ? (
                  <div className="text-center space-y-6">
                     <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-float">
                        <Video className="w-10 h-10 text-primary" />
                     </div>
                     <h3 className="text-lg font-bold font-headline uppercase tracking-widest text-white">Visual Engine Ready</h3>
                     <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">Initiate AI generation from the sidebar to create cinematic visuals.</p>
                  </div>
                ) : (
                  <video 
                    ref={videoRef}
                    src={videoData} 
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlayback}
                  />
                )}

                {/* Video Controls HUD */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl opacity-0 group-hover/player:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipBack className="w-4 h-4" /></Button>
                   <button onClick={togglePlayback} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                   </button>
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipForward className="w-4 h-4" /></Button>
                </div>
             </div>
          </div>

          {/* Timeline Engine */}
          <div className="h-[280px] bg-[#0a0d14] border-t flex flex-col shrink-0">
             <div className="h-10 bg-[#111621]/80 px-6 flex items-center justify-between border-b">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Neural Timeline v2.4</span>
                   </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest">00:00:00:00</div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {[
                  { label: "V1: VIDEO GEN", active: !!videoData, icon: Sparkles, color: "bg-primary/20 border-primary/40 text-primary" },
                  { label: "A1: NARRATION", active: !!audioData, icon: Volume2, color: "bg-indigo-500/20 border-indigo-500/40 text-indigo-400" },
                  { label: "G1: THUMBNAIL", active: !!thumbnailUrl, icon: ImageIcon, color: "bg-rose-500/20 border-rose-500/40 text-rose-400" }
                ].map((track, i) => (
                  <div key={i} className="flex gap-4 h-14">
                     <div className="w-40 shrink-0 bg-[#161a25] rounded-xl border border-white/5 flex items-center px-4 gap-3">
                        <track.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest truncate">{track.label}</span>
                     </div>
                     <div className="flex-1 bg-[#0c0f17] rounded-xl relative border border-white/5 overflow-hidden">
                        {track.active && (
                          <div className={cn("absolute inset-y-1 left-8 right-20 rounded-lg border-x-4 flex items-center px-4 overflow-hidden", track.color)}>
                             <div className="flex items-end gap-0.5 h-6 opacity-30">
                                {[1,2,3,4,5,6,7,8,9,10,8,6,4,2,5,7,9,10,8,6,4,2].map((h, j) => (
                                  <div key={j} className="w-1 bg-current rounded-full" style={{ height: `${h * 10}%` }} />
                                ))}
                             </div>
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Inspector Sidebar */}
        <div className="w-[400px] bg-[#0a0d14] border-l shrink-0 flex flex-col overflow-hidden">
           <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab} className="flex-1 flex flex-col">
              <TabsList className="w-full h-14 bg-transparent border-b rounded-none grid grid-cols-2 p-0">
                 <TabsTrigger value="ai" className="rounded-none font-bold text-[10px] tracking-widest data-[state=active]:text-primary">AI NEURAL ENGINE</TabsTrigger>
                 <TabsTrigger value="project" className="rounded-none font-bold text-[10px] tracking-widest">PROJECT SYNC</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                 <TabsContent value="ai" className="mt-0 space-y-8">
                    {/* Script Tool */}
                    <div className="p-6 rounded-[2rem] bg-[#161a25] border border-indigo-500/20 space-y-4 shadow-2xl">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <PenTool className="w-4 h-4 text-indigo-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Viral Script Writer</h4>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">2 Credits</span>
                       </div>
                       <textarea 
                          placeholder="What is your video about?" 
                          className="w-full bg-[#0c0f17] border border-white/5 rounded-2xl p-4 text-xs h-24 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-muted-foreground/30"
                          value={scriptTopic}
                          onChange={(e) => setScriptTopic(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-xs shadow-xl shadow-indigo-500/20" onClick={handleGenerateScript} disabled={isProcessing || !scriptTopic}>
                          {isProcessing && processingMessage.includes("script") ? <Loader2 className="animate-spin" /> : "Initiate Analysis"}
                       </Button>
                    </div>

                    {/* Veo 2.0 Video Gen */}
                    <div className="p-6 rounded-[2rem] bg-[#161a25] border border-blue-500/20 space-y-4 shadow-2xl">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Sparkles className="w-4 h-4 text-blue-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Veo 2.0 Visual Gen</h4>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">20 Credits</span>
                       </div>
                       <textarea 
                          placeholder="Describe your cinematic scene..." 
                          className="w-full bg-[#0c0f17] border border-white/5 rounded-2xl p-4 text-xs h-24 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-muted-foreground/30"
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-xs shadow-xl shadow-blue-500/20" onClick={handleGenerateVideo} disabled={isProcessing || !videoPrompt}>
                          {isProcessing && processingMessage.includes("rendering") ? <Loader2 className="animate-spin" /> : "Render Clip"}
                       </Button>
                    </div>

                    {/* Voiceover Tool */}
                    <div className="p-6 rounded-[2rem] bg-[#161a25] border border-cyan-500/20 space-y-4 shadow-2xl">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Volume2 className="w-4 h-4 text-cyan-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Neural Voiceover</h4>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">5 Credits</span>
                       </div>
                       <textarea 
                          placeholder="Paste narration script..." 
                          className="w-full bg-[#0c0f17] border border-white/5 rounded-2xl p-4 text-xs h-24 focus:ring-1 focus:ring-cyan-500 outline-none resize-none transition-all placeholder:text-muted-foreground/30"
                          value={voiceText}
                          onChange={(e) => setVoiceText(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-cyan-600 hover:bg-cyan-700 text-xs shadow-xl shadow-cyan-500/20" onClick={handleGenerateVoiceover} disabled={isProcessing || !voiceText}>
                          {isProcessing && processingMessage.includes("neural") ? <Loader2 className="animate-spin" /> : "Synthesize Voice"}
                       </Button>
                       {audioData && (
                         <div className="pt-2">
                           <audio controls src={audioData} className="w-full h-10 rounded-xl" />
                         </div>
                       )}
                    </div>

                    {/* Thumbnail Tool */}
                    <div className="p-6 rounded-[2rem] bg-[#161a25] border border-rose-500/20 space-y-4 shadow-2xl">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <ImageIcon className="w-4 h-4 text-rose-400" />
                             <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Thumbnail Designer</h4>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">5 Credits</span>
                       </div>
                       <textarea 
                          placeholder="Visual composition description..." 
                          className="w-full bg-[#0c0f17] border border-white/5 rounded-2xl p-4 text-xs h-24 focus:ring-1 focus:ring-rose-500 outline-none resize-none transition-all placeholder:text-muted-foreground/30"
                          value={thumbnailPrompt}
                          onChange={(e) => setThumbnailPrompt(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 text-xs shadow-xl shadow-rose-500/20" onClick={handleGenerateThumbnail} disabled={isProcessing || !thumbnailPrompt}>
                          {isProcessing && processingMessage.includes("designing") ? <Loader2 className="animate-spin" /> : "Generate Cover"}
                       </Button>
                    </div>
                 </TabsContent>

                 <TabsContent value="project" className="mt-0 space-y-8">
                    <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <CloudCheck className="w-5 h-5 text-emerald-500" />
                          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Cloud Status</h4>
                       </div>
                       <p className="text-[10px] text-muted-foreground leading-relaxed">All changes are automatically synced to your secure cloud workspace. You can pick up where you left off on any device.</p>
                    </div>

                    {aiScript && (
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Generated Script</h4>
                         <div className="p-6 bg-[#161a25] rounded-[2rem] text-[11px] leading-relaxed border border-white/5 font-medium text-white/80">
                            {aiScript.script}
                         </div>
                      </div>
                    )}
                 </TabsContent>
              </div>
           </Tabs>
        </div>
      </div>

      {/* Global Processing HUD */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-12">
           <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
             <div className="relative w-32 h-32 mx-auto">
                <Loader2 className="w-32 h-32 animate-spin text-primary opacity-20" />
                <div className="absolute inset-0 m-auto w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                   <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
             </div>
             <div className="space-y-3">
               <h3 className="text-3xl font-headline font-bold text-white tracking-tighter uppercase">AI Processing</h3>
               <p className="text-muted-foreground font-medium text-base leading-relaxed italic">{processingMessage}</p>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full max-w-sm mx-auto">
                <div className="h-full bg-primary animate-progress-indefinite shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
