"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video,
  Coins, Plus, RefreshCw, Palette, Mic2, 
  Trash2, TrendingUp, Tags, BarChart4, Music, Star, Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAiThumbnail } from "@/ai/flows/ai-thumbnail-designer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import audioDataPlaceholder from "@/app/lib/placeholder-audio.json";

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
  
  const [title, setTitle] = useState("Naya Design");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ai");
  const [activeInspectorTab, setActiveInspectorTab] = useState("ai");
  
  const [videoData, setVideoData] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [bgMusicUrl, setBgMusicUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const [scriptTopic, setScriptTopic] = useState("");
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  
  const [aiScript, setAiScript] = useState<any>(null);
  const [seoData, setSeoData] = useState<any>(null);

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
    if (project) {
      setTitle(project.title || "Naya Design");
      setVideoData(project.videoDataUri || null);
      setAudioData(project.audioDataUri || null);
      setBgMusicUrl(project.backgroundMusicUrl || null);
      setThumbnailUrl(project.thumbnailUrl || null);
      setAiScript(project.aiNotes ? { script: project.aiNotes } : null);
      if (project.optimizedTitle) {
        setSeoData({
          title: project.optimizedTitle,
          description: project.optimizedDescription,
          hashtags: project.hashtags
        });
      }
      setIsNewProject(false);
    }
  }, [project]);

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
        title: "Credits Khatam!",
        description: `Ye kaam karne ke liye ${cost} credits chahiye. Ad dekho ya upgrade karo.`,
      });
      return false;
    }
    return true;
  };

  const deductCredits = (cost: number) => {
    if (profile?.isPremium || !userProfileRef) return;
    const updateData = { credits: increment(-cost) };
    updateDoc(userProfileRef, updateData).catch(() => {});
  };

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(() => {});
    } else {
      const createData = {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
        thumbnailUrl: data.thumbnailUrl || thumbnailUrl || `https://picsum.photos/seed/${projectRef.id}/600/400`,
      };
      setDoc(projectRef, createData).catch(() => {});
      setIsNewProject(false);
      if (!projectIdFromUrl) router.replace(`/editor?id=${projectRef.id}`);
    }
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic || !checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Viral script likh raha hoon...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setAiScript(result);
      deductCredits(2);
      handleSave({ aiNotes: result.script });
      toast({ title: "Done!", description: "Script ready hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Thumbnail design ho raha hai...");
    try {
      const result = await generateAiThumbnail({ prompt: thumbnailPrompt });
      setThumbnailUrl(result.thumbnailDataUri);
      deductCredits(5);
      handleSave({ thumbnailUrl: result.thumbnailDataUri });
      toast({ title: "Ready!", description: "Thumbnail jud gaya." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !checkCredits(20)) return;
    setIsProcessing(true);
    setProcessingMessage("AI clip render ho rahi hai...");
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      deductCredits(20);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Success!", description: "Video clip ready hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Video Generation Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceText || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Voiceover tayyar ho raha hai...");
    try {
      const result = await generateAiVoiceover({ text: voiceText, voiceName: 'Algenib' });
      setAudioData(result.audioDataUri);
      deductCredits(5);
      handleSave({ audioDataUri: result.audioDataUri });
      toast({ title: "Voice Added!", description: "Awaaz jud gayi." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
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
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8]">
      <Navbar />
      
      <div className="h-16 border-b bg-[#0a0d14]/95 backdrop-blur-2xl px-6 flex items-center justify-between z-40 border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-2xl">
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none w-64 truncate"
            />
            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
              {isSaving ? "Saving..." : "All Changes Saved"}
            </span>
          </div>
        </div>
        <Button className="h-12 px-8 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/30">
          <Download className="w-5 h-5 mr-2" /> Export
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Simple Steps Sidebar */}
        <div className="w-24 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-8 gap-8">
           {[
             { icon: Wand2, id: 'ai', label: 'AI Tools' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Palette, id: 'style', label: 'Style' }
           ].map((item) => (
             <button key={item.id} className={cn(
               "flex flex-col items-center gap-2",
               activeTab === item.id ? "text-primary" : "text-muted-foreground"
             )} onClick={() => setActiveTab(item.id)}>
               <div className={cn("p-3 rounded-2xl", activeTab === item.id && "bg-primary/20")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Content Side */}
        <div className="w-80 bg-[#0a0d14]/50 border-r border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto">
           {activeTab === 'ai' && (
             <div className="space-y-10">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 1: Script Likho</h4>
                   <textarea 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 outline-none"
                      placeholder="Kis topic par video banayein?"
                      value={scriptTopic}
                      onChange={(e) => setScriptTopic(e.target.value)}
                   />
                   <Button className="w-full h-12 rounded-xl font-bold" onClick={handleGenerateScript} disabled={isProcessing}>
                      Generate Script
                   </Button>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Step 2: Video Clip Banao</h4>
                   <textarea 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 outline-none"
                      placeholder="Scene describe karein..."
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                   />
                   <Button className="w-full h-12 rounded-xl font-bold bg-indigo-600" onClick={handleGenerateVideo} disabled={isProcessing}>
                      Generate Video
                   </Button>
                </div>
             </div>
           )}
        </div>

        {/* Big Preview Area */}
        <div className="flex-1 flex flex-col bg-[#0c0f17] relative p-8">
           <div className="flex-1 relative aspect-[9/16] h-full mx-auto bg-black rounded-[3rem] border-[8px] border-white/5 overflow-hidden shadow-2xl group">
              {!videoData && !thumbnailUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                   <Video className="w-12 h-12 text-primary opacity-20 mb-4" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest italic">Aapka Preview Yahan Dikhega</p>
                </div>
              ) : (
                <>
                  {thumbnailUrl && !isPlaying && <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover" />}
                  {videoData && (
                    <video 
                      ref={videoRef}
                      src={videoData} 
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  )}
                </>
              )}
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" onClick={togglePlayback} className="text-white">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                 </Button>
              </div>
           </div>

           {/* Simple Timeline */}
           <div className="h-24 bg-[#0a0d14] mt-8 rounded-[2rem] border border-white/5 flex items-center px-8 gap-4 overflow-x-auto">
              <div className="flex gap-4">
                 {videoData && <div className="h-12 w-32 bg-primary/20 border border-primary/30 rounded-xl flex items-center px-4 text-[10px] font-bold">V1: AI CLIP</div>}
                 {audioData && <div className="h-12 w-32 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center px-4 text-[10px] font-bold">A1: VOICE</div>}
              </div>
           </div>
        </div>

        {/* Right Inspector */}
        <div className="w-80 bg-[#0a0d14] border-l border-white/5 p-6 space-y-10 overflow-y-auto">
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Step 3: Voice & Design</h4>
              <textarea 
                 className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 outline-none"
                 placeholder="Voiceover script..."
                 value={voiceText}
                 onChange={(e) => setVoiceText(e.target.value)}
              />
              <Button className="w-full h-12 rounded-xl font-bold bg-emerald-600" onClick={handleGenerateVoiceover} disabled={isProcessing}>
                 Add AI Voice
              </Button>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Step 4: Thumbnail</h4>
              <textarea 
                 className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 outline-none"
                 placeholder="Thumbnail describe karein..."
                 value={thumbnailPrompt}
                 onChange={(e) => setThumbnailPrompt(e.target.value)}
              />
              <Button className="w-full h-12 rounded-xl font-bold bg-orange-600" onClick={handleGenerateThumbnail} disabled={isProcessing}>
                 Create Thumbnail
              </Button>
           </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center">
           <div className="text-center space-y-6">
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
              <p className="text-xl font-bold italic animate-pulse text-white">{processingMessage}</p>
           </div>
        </div>
      )}
    </div>
  );
}
