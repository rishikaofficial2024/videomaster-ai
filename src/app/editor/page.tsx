
"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Trash2, Layers, Music, Wand2, Download, 
  Crop, Filter, Gauge, Type, Share2, Sparkles, ChevronLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function EditorPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleExport = () => {
    setIsProcessing(true);
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      if (val >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        toast({
          title: "Export Complete!",
          description: "Video saved to your cloud studio in 1080p.",
        });
      }
    }, 300);
  };

  const handleAIAnalyze = async () => {
    toast({ title: "AI Alchemist", description: "Analyzing scenes for optimized content..." });
    // Simulate AI Flow call
    try {
      const result = await aiVideoContentOptimization({ videoTranscript: "This is a cinematic travel vlog about Bali." });
      console.log(result);
      toast({
        title: "Optimization Complete",
        description: `Generated title: ${result.title.substring(0, 30)}...`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col md:pt-20">
      <Navbar />
      
      {/* Editor Header */}
      <div className="bg-background border-b px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-1 hover:bg-muted rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <span className="font-headline font-bold hidden sm:inline">Project_Untitled_01</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleAIAnalyze}>
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
        {/* Preview Area */}
        <div className="flex-1 bg-black flex flex-col relative group">
          <div className="flex-1 relative flex items-center justify-center">
            {/* Simulated Video Canvas */}
            <div className="aspect-video w-full max-w-4xl bg-[#1a1a1a] shadow-2xl relative flex items-center justify-center">
               <Play className="w-16 h-16 text-white/20" />
               <div className="absolute bottom-10 left-0 right-0 text-center text-white font-bold drop-shadow-md">
                 [AI Subtitle Placeholder]
               </div>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 text-white bg-black/40 backdrop-blur-md py-4 transition-transform translate-y-full group-hover:translate-y-0">
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

        {/* Sidebar / Tools */}
        <div className="w-full lg:w-80 bg-background border-l overflow-y-auto">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="w-full h-12 rounded-none grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl">
                  <Scissors className="w-5 h-5" /> Trim
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl">
                  <Crop className="w-5 h-5" /> Crop
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl">
                  <Gauge className="w-5 h-5" /> Speed
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl">
                  <Filter className="w-5 h-5" /> Filters
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Filter Intensity</span>
                  <span className="text-xs text-muted-foreground">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} className="text-primary" />
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-4 space-y-4">
              <Card className="p-4 border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg text-white">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Auto Captions</h4>
                    <p className="text-xs text-muted-foreground">Transcribe audio to subtitles</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-accent/20 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Magic Descriptions</h4>
                    <p className="text-xs text-muted-foreground">Generate SEO-friendly text</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="audio" className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Background Music</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Music className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Lofi Beats Vol. {i}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-primary">Add</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Timeline Area */}
      <div className="bg-card h-48 lg:h-64 border-t relative overflow-hidden flex flex-col pb-20 md:pb-0">
        <div className="flex items-center px-4 py-2 border-b bg-muted/20 gap-4">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><Scissors className="w-4 h-4" /></Button>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><Trash2 className="w-4 h-4" /></Button>
          </div>
          <div className="flex-1 timeline-scrubber">
            <div className="absolute inset-0 bg-primary/10" style={{ width: '35%' }}></div>
            <div className="timeline-handle" style={{ left: '35%' }}></div>
          </div>
          <span className="text-[10px] font-mono font-medium">00:35 / 02:45</span>
        </div>
        
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-1 h-full min-w-[2000px] relative">
            {/* Tracks */}
            <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center gap-0.5 border-b border-white/5">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-16 w-32 bg-primary/40 rounded border border-white/10 relative overflow-hidden">
                  <Image src={`https://picsum.photos/seed/clip-${i}/128/64`} alt="Frame" fill className="object-cover opacity-50" />
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-center gap-0.5">
               <div className="h-10 w-[500px] bg-accent/40 rounded border border-white/10 flex items-center px-4 text-[10px] text-white overflow-hidden">
                 <Music className="w-3 h-3 mr-2" /> Cinematic Background Track.mp3
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exporting Progress Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-center items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-6">
             <div className="relative inline-block">
               <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Video className="w-10 h-10 text-primary" />
               </div>
             </div>
             <div>
               <h3 className="text-2xl font-headline font-bold">Crafting your Masterpiece</h3>
               <p className="text-muted-foreground">Applying AI enhancements and rendering in 1080p...</p>
             </div>
             <Progress value={45} className="h-2" />
             <Button variant="ghost" onClick={() => setIsProcessing(false)} className="text-muted-foreground">Cancel Export</Button>
           </div>
        </div>
      )}
    </div>
  );
}
