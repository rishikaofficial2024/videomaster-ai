
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s No.1 AI Video Studio & Viral Script Maker (.in)',
  description: 'Create viral YouTube Shorts and Reels 10x faster. VideoMaster AI is the most stable AI video studio for Indian creators. Get 100 FREE credits on signup! Generate scripts, thumbnails, and cinematic clips automatically.',
  keywords: [
    'AI Video Generator India', 
    'Viral Reels Maker AI', 
    'Best AI Script Writer YouTube', 
    'Cinematic Thumbnail Maker AI', 
    'VideoMaster AI Studio',
    'Text to Video AI India Free',
    'VideoMaster.ai.in'
  ],
  metadataBase: new URL('https://studio-9489287013-59986.web.app'),
  alternates: { 
    canonical: 'https://studio-9489287013-59986.web.app',
  },
  openGraph: {
    title: 'VideoMaster AI - Viral Studio for Indian Creators',
    description: 'Transform your ideas into professional videos with AI. 100 Free Credits inside!',
    url: 'https://studio-9489287013-59986.web.app',
    siteName: 'VideoMaster AI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI',
    description: 'India\'s Elite AI Video Studio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
        {/* Google AdSense Global Tag */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-8946933317699938" />
        {/* Google Search Console Verification Placeholder */}
        <meta name="google-site-verification" content="Aapka_Verification_Code_Yahan_Aayega" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
