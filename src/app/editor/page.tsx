
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Trash2, Music, Wand2, Download, 
  Crop, Filter, Gauge, Type, Sparkles, ChevronLeft, Loader2, Video,
  Coins, Upload, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(toolFromUrl === "captions" ? "ai" : "tools");
  const [selectedVideoData, setSelectedVideoData] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");

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
      setSelectedVideoData(project.videoDataUri || null);
    }
  }, [project]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        setSelectedVideoData(dataUri);
        handleSave(dataUri);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Video Loaded",
        description: `${file.name} added to your studio.`,
      });
    }
  };

  const handleSave = (videoUri?: string) => {
    if (!user || !projectRef) return;
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
    };
    if (videoUri) data.videoDataUri = videoUri;
    
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
      toast({ variant: "destructive", title: "Insufficient Credits" });
      return;
    }

    setIsProcessing(true);
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
      toast({ title: "Optimization Complete" });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMagicVideo = async () => {
    if (!videoPrompt) {
      toast({ title: "Prompt Required", description: "Enter a description for your magic video." });
      return;
    }
    if (!profile?.isPremium && (profile?.credits ?? 0) < 10) {
      toast({ variant: "destructive", title: "Insufficient Credits", description: "Video generation costs 10 credits." });
      return;
    }

    setIsProcessing(true);
    setExportProgress(0);
    const progressInterval = setInterval(() => setExportProgress(p => p < 90 ? p + 2 : p), 2000);

    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setSelectedVideoData(result.videoDataUri);
      
      if (projectRef) {
        updateDoc(projectRef, {
          videoDataUri: result.videoDataUri,
          updatedAt: serverTimestamp(),
        });
        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-10) });
        }
      }
      toast({ title: "Magic Complete!", description: "Your AI video has been generated." });
    } catch (e) {
      toast({ variant: "destructive", title: "Generation Error", description: "AI video generation failed." });
    } finally {
      clearInterval(progressInterval);
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
          <Link href="/dashboard" className="p-1 hover:bg-muted rounded-full text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
            className="bg-transparent font-headline font-bold focus:outline-none border-b border-transparent focus:border-primary px-1 text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-foreground" onClick={handleAIAnalyze} disabled={isProcessing}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">AI Optimize</span>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={handleExport} disabled={isProcessing}>
            <Download className="w-4 h-4" />
            {isProcessing ? "Wait..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black flex flex-col relative group">
          <div className="flex-1 relative flex items-center justify-center">
            <div className="aspect-video w-full max-w-4xl bg-[#1a1a1a] shadow-2xl relative flex items-center justify-center cursor-pointer" onClick={handleFileClick}>
               <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
               {!selectedVideoData ? (
                 <div className="flex flex-col items-center gap-4 text-white/20">
                    <Upload className="w-16 h-16" />
                    <span className="text-sm font-medium">Select or Generate a Video</span>
                 </div>
               ) : (
                 <video src={selectedVideoData} className="w-full h-full object-contain" controls={isPlaying} />
               )}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 text-white bg-black/40 backdrop-blur-md py-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full"><SkipBack className="w-6 h-6" /></Button>
            <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full shadow-lg" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full"><SkipForward className="w-6 h-6" /></Button>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-background border-l overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 rounded-none grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Scissors className="w-5 h-5" /> Trim</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Crop className="w-5 h-5" /> Crop</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Gauge className="w-5 h-5" /> Speed</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Filter className="w-5 h-5" /> Filters</Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-sm">Magic Video Gen</h4>
                  </div>
                  <Input 
                    placeholder="Describe a scene (e.g. A cat in space)" 
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="bg-background"
                  />
                  <Button className="w-full gap-2" size="sm" onClick={handleMagicVideo} disabled={isProcessing}>
                    Generate (10c)
                  </Button>
                </div>
                
                <Card className="p-4 border-accent/20 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors" onClick={handleAIAnalyze}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent rounded-lg text-white"><Sparkles className="w-5 h-5" /></div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-bold">Magic SEO</h4>
                      <p className="text-xs text-muted-foreground">Tags & Title (2c)</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="p-4 space-y-4">
               <h4 className="text-sm font-semibold">Library</h4>
               <p className="text-xs text-muted-foreground">Select background music for your masterpiece.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-6">
             <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
             <div className="space-y-2">
               <h3 className="text-2xl font-headline font-bold text-white">AI Alchemy</h3>
               <p className="text-muted-foreground">Consulting the digital muses...</p>
             </div>
             <Progress value={exportProgress} className="h-2" />
           </div>
        </div>
      )}
    </div>
  );
}
