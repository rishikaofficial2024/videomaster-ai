import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s #1 Professional AI Video Studio & Script Writer',
  description: 'Create viral YouTube, TikTok, and Reels 10x faster with VideoMaster AI. The best AI video generator for creators. Features: AI Script Writer, Cinematic Thumbnail Maker, and Veo 2.0 Video Generation. Get 100 free credits and start earning today!',
  keywords: ['AI Video Editor', 'Video Generation', 'Thumbnail Maker', 'AI Scripts', 'YouTube Tools', 'TikTok Editor', 'Monetize Video', 'Viral Reels Maker', 'VideoMaster AI India'],
  authors: [{ name: 'VideoMaster AI Global' }],
  metadataBase: new URL('https://videomaster-ai.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VideoMaster AI - Create Viral Videos in Seconds',
    description: 'The all-in-one AI video studio built to help creators earn more and work less. Join 50,000+ creators today.',
    url: 'https://videomaster-ai.web.app',
    siteName: 'VideoMaster AI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - The Future of Video Creation',
    description: 'Turn text into viral videos in seconds with our elite AI engine.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
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
