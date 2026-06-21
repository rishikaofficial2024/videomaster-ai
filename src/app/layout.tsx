import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - World\'s No.1 AI Video Studio (.tech)',
  description: 'Create viral YouTube Shorts and Reels 10x faster. VideoMaster AI is the most stable studio for global creators. Get 100 FREE credits on signup!',
  keywords: [
    'AI Video Generator', 
    'Viral Reels Maker AI', 
    'Best AI Script Writer YouTube', 
    'Cinematic Thumbnail Maker AI', 
    'VideoMaster AI Studio',
    'Text to Video AI Free',
    'VideoMaster-AI.tech'
  ],
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { 
    canonical: '/',
  },
  openGraph: {
    title: 'VideoMaster AI - Viral Studio for Modern Creators',
    description: 'Transform your ideas into professional videos with AI. 100 Free Credits inside!',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/videomaster-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'VideoMaster AI Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - Master the Viral Game',
    description: 'The first elite AI design studio for tech-savvy creators.',
    images: ['https://picsum.photos/seed/videomaster-twitter/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
        {/* 💰 Official AdSense Node - DO NOT REMOVE */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-8946933317699938" />
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
