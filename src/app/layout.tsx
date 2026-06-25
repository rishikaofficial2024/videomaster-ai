import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

/**
 * 📈 ELITE SEO & METADATA CORE
 */
export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s #1 Professional AI Video Studio',
  description: 'Create viral AI videos 10x faster with Gemini Fast AI. Professional script writing, cinematic video generation, and 4K thumbnail design. Start for FREE now.',
  keywords: ['AI Video Maker', 'Viral Script Writer', 'Cinematic AI', 'VideoMaster AI Tech', 'AI Studio India', 'Gemini Fast AI Video', 'YouTube Shorts AI'],
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { canonical: '/' },
  verification: {
    google: 'google-site-verification-id-placeholder', 
  },
  openGraph: {
    title: 'VideoMaster AI - The Ultimate Production Studio',
    description: 'Transform cinematic ideas into professional video assets with Gemini Fast AI.',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: 'https://picsum.photos/seed/videomaster-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - Master the Viral Social Game',
    description: 'Create viral shorts and reels in seconds with Gemini Fast AI.',
    images: ['https://picsum.photos/seed/videomaster-twitter/1200/630'],
  },
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
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        {/* 💰 MONETIZATION NODE: AdSense Script */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
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
