
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Settings, Shield, Bell, HelpCircle, LogOut, 
  ChevronRight, CreditCard, Smartphone, Cloud
} from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find(img => img.id === "avatar-user");

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 space-y-8">
        {/* User Header */}
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-primary shadow-xl">
              <AvatarImage src={userAvatar?.imageUrl} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white cursor-pointer shadow-lg border-2 border-background">
              <Settings className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-headline font-bold">John Doe</h2>
            <p className="text-muted-foreground text-sm">Pro Content Creator • joined Mar 2024</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/premium">
              Manage Pro Subscription
            </Link>
          </Button>
        </div>

        {/* Settings Groups */}
        <section className="space-y-4">
          <Card className="border-none shadow-md overflow-hidden bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">Personal Information</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Security & Privacy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <span className="font-medium">Payments & Subscription</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-400" />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Cloud Storage Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Help & Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 gap-3 p-4 h-auto" asChild>
            <Link href="/">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </Link>
          </Button>
        </section>

        <div className="text-center pb-8">
           <p className="text-[10px] text-muted-foreground uppercase tracking-widest">VideoMaster AI • v2.4.0</p>
        </div>
      </main>
    </div>
  );
}
