
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Trash2, Music, Wand2, Download, 
  Crop, Filter, Gauge, Type, Sparkles, ChevronLeft, Loader2, Video,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(toolFromUrl === "captions" ? "ai" : "tools");

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid, "projects", projectIdFromUrl || "new-" + Date.now());
  }, [user, db, projectIdFromUrl]);

  const { data: project, loading: projectLoading } = useDoc(projectIdFromUrl ? projectRef : null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
    }
  }, [project]);

  const handleSave = () => {
    if (!user || !projectRef) return;
    const data = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
    };
    
    if (projectIdFromUrl) {
      updateDoc(projectRef, data).catch(async (e) => {
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
        thumbnailUrl: `https://picsum.photos/seed/${projectRef.id}/600/400`,
      }).catch(async (e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "create",
          requestResourceData: data
        }));
      });
      router.replace(`/editor?id=${projectRef.id}`);
    }
    
    toast({ title: "Project Saved" });
  };

  const handleExport = () => {
    if (!profile?.isPremium && (profile?.credits ?? 0) < 5) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "Exporting costs 5 credits. Upgrade to PRO for unlimited exports.",
        action: <Button variant="outline" size="sm" asChild><Link href="/premium">Upgrade</Link></Button>
      });
      return;
    }

    setIsProcessing(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          if (!profile?.isPremium && userProfileRef) {
            updateDoc(userProfileRef, { credits: increment(-5) });
          }

          toast({
            title: "Export Complete!",
            description: "Video saved to your cloud studio in 1080p.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleAIAnalyze = async () => {
    if (!profile?.isPremium && (profile?.credits ?? 0) < 2) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "AI Tools cost 2 credits per use.",
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: "AI Alchemist", description: "Analyzing scenes for optimized content..." });
    try {
      const result = await aiVideoContentOptimization({ 
        videoTranscript: "Cinematic travel vlog exploring the hidden beaches of Bali." 
      });
      
      if (projectRef) {
        updateDoc(projectRef, {
          optimizedTitle: result.title,
          optimizedDescription: result.description,
          hashtags: result.hashtags,
          updatedAt: serverTimestamp(),
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-2) });
        }
      }

      toast({
        title: "Optimization Complete",
        description: `Generated title: ${result.title.substring(0, 30)}...`,
      });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to optimize content." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoCaptions = async () => {
     if (!profile?.isPremium && (profile?.credits ?? 0) < 3) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "Auto Captions cost 3 credits.",
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: "Transcribing...", description: "AI is listening to your audio..." });
    try {
      // Mock audio data for the prototype
      const result = await generateAutoCaptionsAndSubtitles({ 
        audioDataUri: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" 
      });
      
      if (projectRef) {
        updateDoc(projectRef, {
          transcript: result.subtitles,
          updatedAt: serverTimestamp(),
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-3) });
        }
      }

      toast({
        title: "Captions Ready!",
        description: "Subtitles have been added to your timeline.",
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Transcription Error", description: "Failed to generate captions." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col md:pt-20">
      <Navbar />
      
      <div className="bg-background border-b px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-1 hover:bg-muted rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="bg-transparent font-headline font-bold focus:outline-none border-b border-transparent focus:border-primary px-1 max-w-[150px] sm:max-w-none"
          />
        </div>
        <div className="flex items-center gap-2">
          {!profile?.isPremium && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-muted-foreground mr-2">
              <Coins className="w-3.5 h-3.5 text-orange-400" /> {profile?.credits ?? 0}
            </div>
          )}
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleAIAnalyze} disabled={isProcessing}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">AI Optimize</span>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={handleExport} disabled={isProcessing}>
            <Download className="w-4 h-4" />
            {isProcessing ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black flex flex-col relative group">
          <div className="flex-1 relative flex items-center justify-center">
            <div className="aspect-video w-full max-w-4xl bg-[#1a1a1a] shadow-2xl relative flex items-center justify-center">
               <Video className="w-16 h-16 text-white/10" />
               <div className="absolute bottom-10 left-0 right-0 text-center text-white font-bold drop-shadow-md px-4">
                 {project?.optimizedTitle || project?.title}
               </div>
               {project?.transcript && (
                 <div className="absolute bottom-4 left-0 right-0 text-center text-xs bg-black/60 py-1 px-4 text-primary font-medium">
                   [Subtitles Enabled]
                 </div>
               )}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 text-white bg-black/40 backdrop-blur-md py-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button 
              size="icon" 
              className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full shadow-lg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-background border-l overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 rounded-none grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl"><Scissors className="w-5 h-5" /> Trim</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl"><Crop className="w-5 h-5" /> Crop</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl"><Gauge className="w-5 h-5" /> Speed</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl"><Filter className="w-5 h-5" /> Filters</Button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Intensity</span>
                  <span className="text-muted-foreground">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-4 space-y-4">
              <Card className="p-4 border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" onClick={handleAutoCaptions}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg text-white"><Type className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Auto Captions</h4>
                    <p className="text-xs text-muted-foreground">AI Transcribe audio (3c)</p>
                  </div>
                  {project?.transcript && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </div>
              </Card>
              <Card className="p-4 border-accent/20 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors" onClick={handleAIAnalyze}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg text-white"><Sparkles className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Magic SEO</h4>
                    <p className="text-xs text-muted-foreground">Tags & Title (2c)</p>
                  </div>
                  {project?.hashtags && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="audio" className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Library</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Vibe Track {i}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">Add</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-card h-48 lg:h-64 border-t flex flex-col pb-20 md:pb-0">
        <div className="flex items-center px-4 py-2 border-b bg-muted/20 gap-4">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Scissors className="w-4 h-4" /></Button>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="flex-1 timeline-scrubber h-1">
            <div className="absolute h-1 bg-primary" style={{ width: '35%' }}></div>
          </div>
          <span className="text-[10px] font-mono">00:35 / 02:45</span>
        </div>
        
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-1 h-full min-w-[2000px] relative">
            <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center gap-0.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-16 w-32 bg-primary/20 rounded border border-white/5 relative overflow-hidden">
                  <Image src={`https://picsum.photos/seed/thumb-${i}/128/64`} alt="Frame" fill className="object-cover opacity-30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-6">
             <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
             <div className="space-y-2">
               <h3 className="text-2xl font-headline font-bold">AI Alchemist at Work</h3>
               <p className="text-muted-foreground">Rendering cinematic enhancements...</p>
             </div>
             <Progress value={exportProgress} className="h-2" />
             <Button variant="ghost" onClick={() => setIsProcessing(false)} className="text-muted-foreground">Cancel</Button>
           </div>
        </div>
      )}
    </div>
  );
}
